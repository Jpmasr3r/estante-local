import { z } from "zod";

import type {
	BookMetadataCandidate,
	BookMetadataProvider,
} from "../../application/metadata/BookMetadataProvider";

const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const OPEN_LIBRARY_COVERS_URL = "https://covers.openlibrary.org/b/id";

const searchResponseSchema = z.object({
	docs: z.array(
		z.object({
			key: z.string().min(1),
			title: z.string().min(1),
			author_name: z.array(z.string()).optional().default([]),
			cover_i: z.number().int().positive().optional(),
			first_publish_year: z.number().int().optional(),
		}),
	),
});

export class OpenLibraryMetadataProvider implements BookMetadataProvider {
	public async searchByTitle(
		title: string,
	): Promise<readonly BookMetadataCandidate[]> {
		const parameters = new URLSearchParams({
			title,
			lang: "pt",
			limit: "5",
			fields: "key,title,author_name,cover_i,first_publish_year",
		});
		const response = await fetch(
			`${OPEN_LIBRARY_SEARCH_URL}?${parameters.toString()}`,
		);

		if (!response.ok) {
			throw new Error(`Open Library respondeu com status ${response.status}.`);
		}

		const result = searchResponseSchema.safeParse(await response.json());

		if (!result.success) {
			return [];
		}

		return result.data.docs.map((book) => ({
			providerId: book.key,
			title: book.title,
			authors: book.author_name,
			coverUrl: book.cover_i
				? `${OPEN_LIBRARY_COVERS_URL}/${book.cover_i}-M.jpg?default=false`
				: null,
			firstPublishYear: book.first_publish_year ?? null,
		}));
	}
}
