import { BookFile } from "../../domain/library/BookFile";
import { LibraryFolder } from "../../domain/library/LibraryFolder";

export class DirectoryReader {
	public async read(
		handle: FileSystemDirectoryHandle,
		folderId: string = crypto.randomUUID(),
	): Promise<LibraryFolder> {
		const books = await this.readDirectory(handle, handle.name);
		books.sort((first, second) =>
			first.title.localeCompare(second.title, "pt-BR"),
		);

		return new LibraryFolder(folderId, handle.name, handle.name, books);
	}

	public readFiles(
		files: FileList,
		folderId: string = crypto.randomUUID(),
	): LibraryFolder {
		const selectedFiles = Array.from(files);
		const firstPath = selectedFiles[0]?.webkitRelativePath;
		const folderName = firstPath?.split("/")[0] || "Pasta selecionada";
		const books = selectedFiles
			.map((file) => BookFile.from(file))
			.filter((book): book is BookFile => book !== null)
			.sort((first, second) =>
				first.title.localeCompare(second.title, "pt-BR"),
			);

		return new LibraryFolder(folderId, folderName, folderName, books);
	}

	private async readDirectory(
		handle: FileSystemDirectoryHandle,
		currentPath: string,
	): Promise<BookFile[]> {
		const books: BookFile[] = [];

		for await (const entry of handle.values()) {
			const entryPath = `${currentPath}/${entry.name}`;

			if (entry.kind === "directory") {
				books.push(...(await this.readDirectory(entry, entryPath)));
				continue;
			}

			const book = BookFile.from(await entry.getFile(), entryPath);

			if (book) {
				books.push(book);
			}
		}

		return books;
	}
}
