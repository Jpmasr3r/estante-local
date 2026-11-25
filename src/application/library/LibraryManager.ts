import type { LibraryFolder } from "../../domain/library/LibraryFolder";
import type { LocalLibrary } from "../../domain/library/LocalLibrary";
import type { DirectoryHandleRepository } from "./DirectoryHandleRepository";
import type { DirectoryPicker, DirectorySelection } from "./DirectoryPicker";
import type { DirectoryReader } from "./DirectoryReader";
import type { LibrarySession } from "./LibrarySession";

export interface LibraryRefreshResult {
	library: LocalLibrary | null;
	failedFolders: number;
}

export class LibraryManager {
	public constructor(
		private readonly session: LibrarySession,
		private readonly directoryReader: DirectoryReader,
		private readonly handleRepository: DirectoryHandleRepository,
		private readonly directoryPicker: DirectoryPicker,
	) {}

	public getLibrary(): LocalLibrary | null {
		return this.session.getCurrentLibrary();
	}

	public async addFolder(): Promise<LocalLibrary | null> {
		const selectedFolder = await this.directoryPicker.select();

		if (!selectedFolder) {
			return this.getLibrary();
		}

		const folder = await this.readSelection(selectedFolder);

		return this.session.addFolder(folder);
	}

	public async replaceFolder(folderId: string): Promise<LocalLibrary | null> {
		const selectedFolder = await this.directoryPicker.select();

		if (!selectedFolder) {
			return this.getLibrary();
		}

		const folder = await this.readSelection(selectedFolder, folderId);

		return this.session.replaceFolder(folder);
	}

	public async removeFolder(folderId: string): Promise<LocalLibrary | null> {
		try {
			await this.handleRepository.remove(folderId);
		} catch {
			// A remoção dos metadados continua mesmo sem acesso ao IndexedDB.
		}

		return this.session.removeFolder(folderId);
	}

	public async refreshFolders(): Promise<LibraryRefreshResult> {
		const currentLibrary = this.getLibrary();

		if (!currentLibrary) {
			return { library: null, failedFolders: 0 };
		}

		let failedFolders = 0;
		let refreshedLibrary = currentLibrary;

		for (const folder of currentLibrary.folders) {
			const refreshedFolder = await this.refreshFolder(folder);

			if (!refreshedFolder) {
				failedFolders += 1;
				continue;
			}

			refreshedLibrary = this.session.replaceFolder(refreshedFolder);
		}

		return { library: refreshedLibrary, failedFolders };
	}

	private async refreshFolder(
		folder: LibraryFolder,
	): Promise<LibraryFolder | null> {
		try {
			const handle = await this.handleRepository.find(folder.id);

			if (!handle) {
				return null;
			}

			const currentPermission = await handle.queryPermission({ mode: "read" });
			const permission =
				currentPermission === "granted"
					? currentPermission
					: await handle.requestPermission({ mode: "read" });

			if (permission !== "granted") {
				return null;
			}

			return await this.directoryReader.read(handle, folder.id);
		} catch {
			return null;
		}
	}

	private async readSelection(
		selection: DirectorySelection,
		folderId?: string,
	): Promise<LibraryFolder> {
		if (selection.kind === "files") {
			return this.directoryReader.readFiles(selection.files, folderId);
		}

		const folder = await this.directoryReader.read(selection.handle, folderId);
		await this.saveHandle(folder.id, selection.handle);

		return folder;
	}

	private async saveHandle(
		folderId: string,
		handle: FileSystemDirectoryHandle,
	): Promise<void> {
		try {
			await this.handleRepository.save(folderId, handle);
		} catch {
			// A pasta continua disponível na sessão atual quando o IndexedDB falha.
		}
	}
}
