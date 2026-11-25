export class BookTitleNormalizer {
	public normalizeFileName(fileName: string): string {
		return fileName
			.replace(/\.pdf$/i, "")
			.split(/\s+[–—-]\s+/)[0]
			.replaceAll(/\[[^\]]*]|\([^)]*pdf[^)]*\)/gi, " ")
			.replaceAll(/[_]+/g, " ")
			.replaceAll(/\s+/g, " ")
			.trim();
	}

	public normalizeForComparison(title: string): string {
		return title
			.normalize("NFD")
			.replaceAll(/[\u0300-\u036f]/g, "")
			.toLocaleLowerCase("pt-BR")
			.replaceAll(/[^a-z0-9]+/g, " ")
			.trim();
	}
}
