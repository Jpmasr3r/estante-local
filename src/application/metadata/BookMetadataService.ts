import type { BookFile } from "../../domain/library/BookFile";
import { BookMetadata } from "../../domain/library/BookMetadata";
import { LibraryFolder } from "../../domain/library/LibraryFolder";
import type { BookMetadataMatcher } from "./BookMetadataMatcher";
import type { BookMetadataProvider } from "./BookMetadataProvider";
import type { BookTitleNormalizer } from "./BookTitleNormalizer";

const CONCURRENT_REQUESTS = 3;

export class BookMetadataService {
	public constructor(
		private readonly provider: BookMetadataProvider,
		private readonly titleNormalizer: BookTitleNormalizer,
		private readonly matcher: BookMetadataMatcher,
	) {}

	public async enrichFolder(folder: LibraryFolder): Promise<LibraryFolder> {
		const enrichedBooks: BookFile[] = [];

		for (
			let index = 0;
			index < folder.books.length;
			index += CONCURRENT_REQUESTS
		) {
			const books = folder.books.slice(index, index + CONCURRENT_REQUESTS);
			enrichedBooks.push(
				...(await Promise.all(books.map((book) => this.enrichBook(book)))),
			);
		}

		return new LibraryFolder(
			folder.id,
			folder.name,
			folder.path,
			enrichedBooks,
		);
	}

	private async enrichBook(book: BookFile): Promise<BookFile> {
		if (book.metadata) {
			return book;
		}

		const searchedTitle = this.titleNormalizer.normalizeFileName(book.fileName);

		if (searchedTitle.length < 2) {
			return book;
		}

		try {
			const candidates = await this.provider.searchByTitle(searchedTitle);
			const match = this.matcher.findBestMatch(searchedTitle, candidates);

			return match ? book.withMetadata(new BookMetadata(match)) : book;
		} catch {
			return book;
		}
	}
}
