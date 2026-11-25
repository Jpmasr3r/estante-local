import type { BookFile } from "./BookFile";
import type { LibraryFolder } from "./LibraryFolder";

export class LocalLibrary {
	public constructor(public readonly folders: readonly LibraryFolder[]) {}

	public get books(): readonly BookFile[] {
		return this.folders.flatMap((folder) => folder.books);
	}

	public get totalBooks(): number {
		return this.folders.reduce((total, folder) => total + folder.totalBooks, 0);
	}

	public addFolder(folder: LibraryFolder): LocalLibrary {
		return new LocalLibrary([...this.folders, folder]);
	}

	public replaceFolder(folder: LibraryFolder): LocalLibrary {
		return new LocalLibrary(
			this.folders.map((current) =>
				current.id === folder.id ? folder : current,
			),
		);
	}

	public removeFolder(folderId: string): LocalLibrary {
		return new LocalLibrary(
			this.folders.filter((folder) => folder.id !== folderId),
		);
	}

	public replaceBook(book: BookFile): LocalLibrary {
		return new LocalLibrary(
			this.folders.map((folder) =>
				folder.books.some((currentBook) => currentBook.id === book.id)
					? folder.replaceBook(book)
					: folder,
			),
		);
	}
}
