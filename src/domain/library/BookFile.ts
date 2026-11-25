import { BookMetadata, type BookMetadataData } from "./BookMetadata";

export type BookFormat = "PDF" | "EPUB";

interface RestoredBookFile {
	id: string;
	fileName: string;
	format: BookFormat;
	relativePath: string;
	metadata: BookMetadataData | null;
}

export class BookFile {
	private constructor(
		public readonly id: string,
		public readonly fileName: string,
		public readonly format: BookFormat,
		public readonly relativePath: string,
		public readonly source: File | null,
		public readonly metadata: BookMetadata | null,
	) {}

	public get title(): string {
		return this.metadata?.title ?? this.fileName;
	}

	public static from(
		file: File,
		path = file.webkitRelativePath || file.name,
	): BookFile | null {
		const extension = file.name.split(".").pop()?.toLowerCase();

		if (extension !== "pdf" && extension !== "epub") {
			return null;
		}

		return new BookFile(
			`${path}-${file.size}-${file.lastModified}`,
			file.name,
			extension.toUpperCase() as BookFormat,
			path,
			file,
			null,
		);
	}

	public static restore(book: RestoredBookFile): BookFile {
		return new BookFile(
			book.id,
			book.fileName,
			book.format,
			book.relativePath,
			null,
			book.metadata ? new BookMetadata(book.metadata) : null,
		);
	}

	public withMetadata(metadata: BookMetadata): BookFile {
		return new BookFile(
			this.id,
			this.fileName,
			this.format,
			this.relativePath,
			this.source,
			metadata,
		);
	}
}
