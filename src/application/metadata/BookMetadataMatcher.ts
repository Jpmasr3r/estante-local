import type { BookMetadataCandidate } from "./BookMetadataProvider";
import type { BookTitleNormalizer } from "./BookTitleNormalizer";

export class BookMetadataMatcher {
	public constructor(private readonly titleNormalizer: BookTitleNormalizer) {}

	public findBestMatch(
		searchedTitle: string,
		candidates: readonly BookMetadataCandidate[],
	): BookMetadataCandidate | null {
		const normalizedSearch =
			this.titleNormalizer.normalizeForComparison(searchedTitle);

		return (
			candidates.find((candidate) =>
				this.isValidMatch(normalizedSearch, candidate.title),
			) ?? null
		);
	}

	private isValidMatch(
		normalizedSearch: string,
		candidateTitle: string,
	): boolean {
		const normalizedCandidate =
			this.titleNormalizer.normalizeForComparison(candidateTitle);

		if (!normalizedSearch || !normalizedCandidate) {
			return false;
		}

		if (normalizedSearch === normalizedCandidate) {
			return true;
		}

		if (
			normalizedSearch.startsWith(`${normalizedCandidate} `) ||
			normalizedCandidate.startsWith(`${normalizedSearch} `)
		) {
			return true;
		}

		const searchTokens = new Set(normalizedSearch.split(" "));
		const candidateTokens = new Set(normalizedCandidate.split(" "));
		const commonTokens = [...searchTokens].filter((token) =>
			candidateTokens.has(token),
		).length;
		const diceScore =
			(2 * commonTokens) / (searchTokens.size + candidateTokens.size);

		return diceScore >= 0.75;
	}
}
