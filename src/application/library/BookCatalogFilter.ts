import type { BookFile, BookFormat } from "../../domain/library/BookFile";
import type { LocalLibrary } from "../../domain/library/LocalLibrary";

export type FormatFilter = BookFormat | "ALL";
export type MetadataFilter = "ALL" | "ENRICHED" | "LOCAL";

export interface BookCatalogCriteria {
	query: string;
	format: FormatFilter;
	folderId: string;
	metadata: MetadataFilter;
}

export class BookCatalogFilter {
	public filter(
		library: LocalLibrary,
		criteria: BookCatalogCriteria,
	): readonly BookFile[] {
		const normalizedQuery = this.normalize(criteria.query);

		return library.folders.flatMap((folder) =>
			folder.books.filter(
				(book) =>
					this.matchesQuery(book, normalizedQuery) &&
					this.matchesFormat(book, criteria.format) &&
					(criteria.folderId === "ALL" || folder.id === criteria.folderId) &&
					this.matchesMetadata(book, criteria.metadata),
			),
		);
	}

	private matchesQuery(book: BookFile, normalizedQuery: string): boolean {
		if (!normalizedQuery) {
			return true;
		}

		const searchableContent = [
			book.title,
			book.fileName,
			book.relativePath,
			...(book.metadata?.authors ?? []),
		]
			.map((value) => this.normalize(value))
			.join(" ");

		return searchableContent.includes(normalizedQuery);
	}

	private matchesFormat(book: BookFile, format: FormatFilter): boolean {
		return format === "ALL" || book.format === format;
	}

	private matchesMetadata(book: BookFile, metadata: MetadataFilter): boolean {
		if (metadata === "ENRICHED") {
			return book.metadata !== null;
		}

		if (metadata === "LOCAL") {
			return book.metadata === null;
		}

		return true;
	}

	private normalize(value: string): string {
		return value
			.normalize("NFD")
			.replaceAll(/[\u0300-\u036f]/g, "")
			.toLocaleLowerCase("pt-BR")
			.trim();
	}
}
