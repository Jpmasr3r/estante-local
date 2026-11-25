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
		<div className="mt-3 grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-3">
			<label>
				<span className="font-semibold text-stone-600 text-xs uppercase tracking-wider">
					Formato
				</span>
				<select
					className="mt-1.5 h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-stone-700 outline-none focus:border-amber-700"
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
				<span className="font-semibold text-stone-600 text-xs uppercase tracking-wider">
					Pasta
				</span>
				<select
					className="mt-1.5 h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-stone-700 outline-none focus:border-amber-700"
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
				<span className="font-semibold text-stone-600 text-xs uppercase tracking-wider">
					Informações
				</span>
				<select
					className="mt-1.5 h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-stone-700 outline-none focus:border-amber-700"
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
					className="rounded-lg px-3 py-2 font-semibold text-amber-900 text-sm hover:bg-amber-50"
					onClick={onClear}
					type="button"
				>
					Limpar filtros
				</button>
			</div>
		</div>
	);
}
