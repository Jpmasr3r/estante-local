export interface BookMetadataCandidate {
	providerId: string;
	title: string;
	authors: readonly string[];
	coverUrl: string | null;
	firstPublishYear: number | null;
}

export interface BookMetadataProvider {
	searchByTitle(title: string): Promise<readonly BookMetadataCandidate[]>;
}
