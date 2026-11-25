import { z } from "zod";

import type { LibraryRepository } from "../../application/library/LibraryRepository";
import { BookFile } from "../../domain/library/BookFile";
import { LibraryFolder } from "../../domain/library/LibraryFolder";
import { LocalLibrary } from "../../domain/library/LocalLibrary";

const STORAGE_KEY = "estante-local:library";

const storedLibrarySchema = z.object({
	version: z.literal(2),
	folders: z.array(
		z.object({
			id: z.string().min(1),
			name: z.string().min(1),
			path: z.string().min(1),
			books: z.array(
				z.object({
					id: z.string().min(1),
					title: z.string().min(1),
					format: z.enum(["PDF", "EPUB"]),
					relativePath: z.string().min(1),
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
			version: 2,
			folders: library.folders.map((folder) => ({
				id: folder.id,
				name: folder.name,
				path: folder.path,
				books: folder.books.map((book) => ({
					id: book.id,
					title: book.title,
					format: book.format,
					relativePath: book.relativePath,
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
