import { z } from "zod";

import type { LibraryRepository } from "../../application/library/LibraryRepository";
import { BookFile } from "../../domain/library/BookFile";
import { LibraryFolder } from "../../domain/library/LibraryFolder";
import { LocalLibrary } from "../../domain/library/LocalLibrary";

const STORAGE_KEY = "estante-local:library";

const storedMetadataSchema = z.object({
	providerId: z.string().min(1),
	title: z.string().min(1),
	authors: z.array(z.string()),
	coverUrl: z.url().nullable(),
	firstPublishYear: z.number().int().nullable(),
});

const storedLibrarySchema = z.object({
	version: z.literal(3),
	folders: z.array(
		z.object({
			id: z.string().min(1),
			name: z.string().min(1),
			path: z.string().min(1),
			books: z.array(
				z.object({
					id: z.string().min(1),
					fileName: z.string().min(1),
					format: z.enum(["PDF", "EPUB"]),
					relativePath: z.string().min(1),
					metadata: storedMetadataSchema.nullable(),
				}),
			),
		}),
	),
});

export class LocalStorageLibraryRepository implements LibraryRepository {
	public find(): LocalLibrary | null {
		try {
			const storedValue = localStorage.getItem(STORAGE_KEY);

			if (!storedValue) {
				return null;
			}

			const result = storedLibrarySchema.safeParse(JSON.parse(storedValue));

			if (!result.success) {
				localStorage.removeItem(STORAGE_KEY);
				return null;
			}

			const folders = result.data.folders.map(
				(folder) =>
					new LibraryFolder(
						folder.id,
						folder.name,
						folder.path,
						folder.books.map((book) => BookFile.restore(book)),
					),
			);

			return new LocalLibrary(folders);
		} catch {
			return null;
		}
	}

	public save(library: LocalLibrary): void {
		const storedLibrary = {
			version: 3,
			folders: library.folders.map((folder) => ({
				id: folder.id,
				name: folder.name,
				path: folder.path,
				books: folder.books.map((book) => ({
					id: book.id,
					fileName: book.fileName,
					format: book.format,
					relativePath: book.relativePath,
					metadata: book.metadata
						? {
								providerId: book.metadata.providerId,
								title: book.metadata.title,
								authors: book.metadata.authors,
								coverUrl: book.metadata.coverUrl,
								firstPublishYear: book.metadata.firstPublishYear,
							}
						: null,
				})),
			})),
		};

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(storedLibrary));
		} catch {
			// A biblioteca continua disponível em memória quando o armazenamento falha.
		}
	}
}
