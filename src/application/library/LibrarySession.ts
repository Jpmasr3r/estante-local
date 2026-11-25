import type { LibraryFolder } from "../../domain/library/LibraryFolder";
import { LocalLibrary } from "../../domain/library/LocalLibrary";
import type { LibraryRepository } from "./LibraryRepository";

export class LibrarySession {
	private currentLibrary: LocalLibrary | null;

	public constructor(private readonly libraryRepository: LibraryRepository) {
		this.currentLibrary = this.libraryRepository.find();
	}

	public addFolder(folder: LibraryFolder): LocalLibrary {
		this.currentLibrary = this.currentLibrary
			? this.currentLibrary.addFolder(folder)
			: new LocalLibrary([folder]);
		this.libraryRepository.save(this.currentLibrary);

		return this.currentLibrary;
	}

	public replaceFolder(folder: LibraryFolder): LocalLibrary {
		this.currentLibrary = this.currentLibrary
			? this.currentLibrary.replaceFolder(folder)
			: new LocalLibrary([folder]);
		this.libraryRepository.save(this.currentLibrary);

		return this.currentLibrary;
	}

	public removeFolder(folderId: string): LocalLibrary | null {
		if (!this.currentLibrary) {
			return null;
		}

		this.currentLibrary = this.currentLibrary.removeFolder(folderId);
		this.libraryRepository.save(this.currentLibrary);

		return this.currentLibrary;
	}

	public getCurrentLibrary(): LocalLibrary | null {
		return this.currentLibrary;
	}
}
