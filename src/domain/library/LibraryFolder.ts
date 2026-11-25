import type { BookFile } from "./BookFile";

export class LibraryFolder {
	public constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly path: string,
		public readonly books: readonly BookFile[],
	) {}

	public get totalBooks(): number {
		return this.books.length;
	}
}
