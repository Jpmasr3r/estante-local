export interface BookMetadataData {
	providerId: string;
	title: string;
	authors: readonly string[];
	coverUrl: string | null;
	firstPublishYear: number | null;
}

export class BookMetadata {
	public readonly providerId: string;
	public readonly title: string;
	public readonly authors: readonly string[];
	public readonly coverUrl: string | null;
	public readonly firstPublishYear: number | null;

	public constructor(data: BookMetadataData) {
		this.providerId = data.providerId;
		this.title = data.title;
		this.authors = data.authors;
		this.coverUrl = data.coverUrl;
		this.firstPublishYear = data.firstPublishYear;
	}
}
