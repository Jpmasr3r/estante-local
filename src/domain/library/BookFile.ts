export type BookFormat = "PDF" | "EPUB";

interface RestoredBookFile {
	id: string;
	title: string;
	format: BookFormat;
	relativePath: string;
}

export class BookFile {
	private constructor(
		public readonly id: string,
		public readonly title: string,
		public readonly format: BookFormat,
		public readonly relativePath: string,
		public readonly source: File | null,
	) {}

	public static from(
		file: File,
		path = file.webkitRelativePath || file.name,
	): BookFile | null {
		const extension = file.name.split(".").pop()?.toLowerCase();

		if (extension !== "pdf" && extension !== "epub") {
			return null;
		}

		const title = file.name
			.replace(/\.(pdf|epub)$/i, "")
			.replaceAll(/[_-]+/g, " ")
			.trim();
		const relativePath = path;

		return new BookFile(
			`${relativePath}-${file.size}-${file.lastModified}`,
			title || file.name,
			extension.toUpperCase() as BookFormat,
			relativePath,
			file,
		);
	}

	public static restore(book: RestoredBookFile): BookFile {
		return new BookFile(
			book.id,
			book.title,
			book.format,
			book.relativePath,
			null,
		);
	}
}
