import type {
	FormatFilter,
	MetadataFilter,
} from "../../application/library/BookCatalogFilter";
import type { LocalLibrary } from "../../domain/library/LocalLibrary";

interface LibraryFiltersProps {
	format: FormatFilter;
	folderId: string;
	library: LocalLibrary;
	metadata: MetadataFilter;
	onClear: () => void;
	onFormatChange: (format: FormatFilter) => void;
	onFolderChange: (folderId: string) => void;
	onMetadataChange: (metadata: MetadataFilter) => void;
}

export function LibraryFilters({
	format,
	folderId,
	library,
	metadata,
	onClear,
	onFormatChange,
	onFolderChange,
	onMetadataChange,
}: LibraryFiltersProps) {
	return (
		<div className="app-panel mt-3 grid gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:grid-cols-3">
			<label>
				<span className="font-semibold text-muted text-xs uppercase tracking-wider">
					Formato
				</span>
				<select
					className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 text-text outline-none focus:border-accent"
					onChange={(event) =>
						onFormatChange(event.target.value as FormatFilter)
					}
					value={format}
				>
					<option value="ALL">Todos os formatos</option>
					<option value="PDF">PDF</option>
					<option value="EPUB">EPUB</option>
				</select>
			</label>

			<label>
				<span className="font-semibold text-muted text-xs uppercase tracking-wider">
					Pasta
				</span>
				<select
					className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 text-text outline-none focus:border-accent"
					onChange={(event) => onFolderChange(event.target.value)}
					value={folderId}
				>
					<option value="ALL">Todas as pastas</option>
					{library.folders.map((folder) => (
						<option key={folder.id} value={folder.id}>
							{folder.name}
						</option>
					))}
				</select>
			</label>

			<label>
				<span className="font-semibold text-muted text-xs uppercase tracking-wider">
					Informações
				</span>
				<select
					className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 text-text outline-none focus:border-accent"
					onChange={(event) =>
						onMetadataChange(event.target.value as MetadataFilter)
					}
					value={metadata}
				>
					<option value="ALL">Todas</option>
					<option value="ENRICHED">Com metadados</option>
					<option value="LOCAL">Somente dados locais</option>
				</select>
			</label>

			<div className="flex justify-end sm:col-span-3">
				<button
					className="app-button rounded-lg px-3 py-2 font-semibold text-accent-strong text-sm hover:bg-surface-strong"
					onClick={onClear}
					type="button"
				>
					Limpar filtros
				</button>
			</div>
		</div>
	);
}
