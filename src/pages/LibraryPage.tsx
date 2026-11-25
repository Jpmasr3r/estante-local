import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	BookCatalogFilter,
	type FormatFilter,
	type MetadataFilter,
} from "../application/library/BookCatalogFilter";
import { BookEditModal } from "../components/library/BookEditModal";
import { LibraryFilters } from "../components/library/LibraryFilters";
import { LibrarySettingsModal } from "../components/library/LibrarySettingsModal";
import { libraryManager } from "../config/library";
import type { BookFile } from "../domain/library/BookFile";
import type { BookMetadataData } from "../domain/library/BookMetadata";
import type { LocalLibrary } from "../domain/library/LocalLibrary";

interface LibraryPageProps {
	library: LocalLibrary;
}

const bookCatalogFilter = new BookCatalogFilter();

export function LibraryPage({ library: initialLibrary }: LibraryPageProps) {
	const navigate = useNavigate();
	const [library, setLibrary] = useState(initialLibrary);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);
	const [editingBook, setEditingBook] = useState<BookFile | null>(null);
	const [query, setQuery] = useState("");
	const [formatFilter, setFormatFilter] = useState<FormatFilter>("ALL");
	const [folderFilter, setFolderFilter] = useState("ALL");
	const [metadataFilter, setMetadataFilter] = useState<MetadataFilter>("ALL");
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);

	const filteredBooks = useMemo(
		() =>
			bookCatalogFilter.filter(library, {
				query,
				format: formatFilter,
				folderId: folderFilter,
				metadata: metadataFilter,
			}),
		[library, query, formatFilter, folderFilter, metadataFilter],
	);
	const activeFilterCount = [
		formatFilter !== "ALL",
		folderFilter !== "ALL",
		metadataFilter !== "ALL",
	].filter(Boolean).length;

	const handleAddFolder = async () => {
		try {
			const updatedLibrary = await libraryManager.addFolder();

			if (updatedLibrary) {
				setLibrary(updatedLibrary);
			}
		} catch {
			setStatusMessage("Não foi possível adicionar a pasta.");
		}
	};

	const handleReplaceFolder = async (folderId: string) => {
		try {
			const updatedLibrary = await libraryManager.replaceFolder(folderId);

			if (updatedLibrary) {
				setLibrary(updatedLibrary);
			}
		} catch {
			setStatusMessage("Não foi possível modificar a pasta.");
		}
	};

	const handleRemoveFolder = async (folderId: string) => {
		const updatedLibrary = await libraryManager.removeFolder(folderId);

		if (!updatedLibrary || updatedLibrary.folders.length === 0) {
			navigate("/", { replace: true });
			return;
		}

		setLibrary(updatedLibrary);
		if (folderFilter === folderId) {
			setFolderFilter("ALL");
		}
	};

	const handleRefreshFolders = async () => {
		setIsRefreshing(true);
		setStatusMessage(null);

		try {
			const result = await libraryManager.refreshFolders();

			if (result.library) {
				setLibrary(result.library);
			}

			setStatusMessage(
				result.failedFolders > 0
					? `${result.failedFolders} pasta(s) precisam ter o acesso renovado nas configurações.`
					: "Pastas relidas com sucesso.",
			);
		} catch {
			setStatusMessage("Não foi possível reler as pastas.");
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleOpenBook = (bookId: string) => {
		navigate(`/leitor/${encodeURIComponent(bookId)}`);
	};

	const handleSaveBook = (metadata: Omit<BookMetadataData, "providerId">) => {
		if (!editingBook) {
			return;
		}

		const updatedLibrary = libraryManager.updateBookMetadata(
			editingBook.id,
			metadata,
		);

		if (updatedLibrary) {
			setLibrary(updatedLibrary);
		}

		setEditingBook(null);
	};

	const handleClearFilters = () => {
		setQuery("");
		setFormatFilter("ALL");
		setFolderFilter("ALL");
		setMetadataFilter("ALL");
	};

	return (
		<section className="min-h-[calc(100vh-4.5rem)] bg-[#f7f4ed] px-5 py-10 sm:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
					<div>
						<p className="font-semibold text-amber-900 text-sm uppercase tracking-widest">
							Minha coleção
						</p>
						<h1 className="mt-2 font-bold text-3xl text-stone-900 tracking-tight sm:text-4xl">
							Biblioteca
						</h1>
						<p className="mt-2 text-stone-600">
							{library.totalBooks}{" "}
							{library.totalBooks === 1
								? "livro encontrado"
								: "livros encontrados"}{" "}
							em {library.folders.length}{" "}
							{library.folders.length === 1 ? "pasta" : "pastas"}
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<button
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 font-semibold text-sm text-stone-700 shadow-sm disabled:cursor-wait disabled:opacity-60"
							disabled={isRefreshing}
							onClick={handleRefreshFolders}
							type="button"
						>
							<svg
								aria-hidden="true"
								className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.023 9.348h4.992V4.356m-1.396 10.212A8.25 8.25 0 1 1 19.62 9.35"
								/>
							</svg>
							{isRefreshing ? "Relendo..." : "Reler pastas"}
						</button>

						<button
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-900 px-4 py-2.5 font-semibold text-amber-50 text-sm shadow-sm hover:bg-amber-950"
							onClick={() => setIsSettingsOpen(true)}
							type="button"
						>
							<svg
								aria-hidden="true"
								className="size-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.073.04.145.083.216.127.325.2.72.263 1.077.13l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.244a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 0 1 0 .255c-.008.378.137.75.43.992l1.003.827c.424.35.534.954.26 1.43l-1.296 2.245a1.125 1.125 0 0 1-1.37.489l-1.217-.456c-.357-.133-.752-.07-1.076.13a6.715 6.715 0 0 1-.217.127c-.331.184-.581.496-.644.869l-.214 1.282c-.09.541-.56.94-1.11.94h-2.592c-.55 0-1.02-.399-1.11-.94l-.213-1.282c-.063-.373-.313-.685-.645-.869a6.52 6.52 0 0 1-.216-.127c-.325-.2-.72-.263-1.077-.13l-1.217.456a1.125 1.125 0 0 1-1.37-.489L3.66 15.36a1.125 1.125 0 0 1 .26-1.43l1.003-.827c.293-.242.438-.614.43-.992a6.779 6.779 0 0 1 0-.255c.008-.379-.137-.751-.43-.992L3.92 10.06a1.125 1.125 0 0 1-.26-1.431l1.296-2.244a1.125 1.125 0 0 1 1.37-.49l1.217.457c.357.133.752.07 1.076-.131.072-.044.144-.086.217-.126.331-.184.581-.496.644-.87l.214-1.281Z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
								/>
							</svg>
							Configurações
						</button>
					</div>
				</header>

				{statusMessage && (
					<p
						className="mt-5 rounded-xl bg-white px-4 py-3 text-sm text-stone-600 shadow-sm"
						role="status"
					>
						{statusMessage}
					</p>
				)}

				<div className="mt-10 flex flex-col gap-3 sm:flex-row">
					<label className="relative flex-1">
						<span className="sr-only">Pesquisar livros</span>
						<svg
							aria-hidden="true"
							className="-translate-y-1/2 absolute top-1/2 left-4 size-5 text-stone-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
							/>
						</svg>
						<input
							className="h-12 w-full rounded-xl border border-stone-300 bg-white pr-4 pl-12 text-stone-800 shadow-sm outline-none placeholder:text-stone-400"
							onChange={(event) => setQuery(event.currentTarget.value)}
							placeholder="Pesquisar por título, autor ou arquivo..."
							type="search"
							value={query}
						/>
					</label>

					<button
						aria-expanded={isFiltersOpen}
						className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-5 font-semibold shadow-sm ${
							isFiltersOpen || activeFilterCount > 0
								? "border-amber-800 bg-amber-50 text-amber-900"
								: "border-stone-300 bg-white text-stone-700"
						}`}
						onClick={() => setIsFiltersOpen((isOpen) => !isOpen)}
						type="button"
					>
						<svg
							aria-hidden="true"
							className="size-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.012L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
							/>
						</svg>
						Filtros
						{activeFilterCount > 0 && (
							<span className="grid size-5 place-items-center rounded-full bg-amber-900 text-amber-50 text-xs">
								{activeFilterCount}
							</span>
						)}
					</button>
				</div>

				{isFiltersOpen && (
					<LibraryFilters
						format={formatFilter}
						folderId={folderFilter}
						library={library}
						metadata={metadataFilter}
						onClear={handleClearFilters}
						onFolderChange={setFolderFilter}
						onFormatChange={setFormatFilter}
						onMetadataChange={setMetadataFilter}
					/>
				)}

				{library.totalBooks === 0 ? (
					<div className="mt-8 rounded-2xl border border-stone-300 border-dashed bg-white px-6 py-16 text-center">
						<svg
							aria-hidden="true"
							className="mx-auto size-12 text-stone-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h3A2.25 2.25 0 0 1 12 5.25V21a2.25 2.25 0 0 0-2.25-2.25h-3A2.25 2.25 0 0 0 4.5 21V5.25Zm15 0A2.25 2.25 0 0 0 17.25 3h-3A2.25 2.25 0 0 0 12 5.25V21a2.25 2.25 0 0 1 2.25-2.25h3A2.25 2.25 0 0 1 19.5 21V5.25Z"
							/>
						</svg>
						<h2 className="mt-4 font-bold text-xl text-stone-800">
							Nenhum livro compatível encontrado
						</h2>
						<p className="mt-2 text-stone-500">
							A pasta selecionada não possui arquivos PDF ou EPUB.
						</p>
					</div>
				) : filteredBooks.length === 0 ? (
					<div className="mt-8 rounded-2xl border border-stone-300 border-dashed bg-white px-6 py-14 text-center">
						<h2 className="font-bold text-xl text-stone-800">
							Nenhum livro corresponde à busca
						</h2>
						<p className="mt-2 text-stone-500">
							Tente outro termo ou remova alguns filtros.
						</p>
						<button
							className="mt-5 rounded-xl bg-amber-900 px-4 py-2.5 font-semibold text-amber-50 text-sm"
							onClick={handleClearFilters}
							type="button"
						>
							Limpar busca e filtros
						</button>
					</div>
				) : (
					<>
						<p className="mt-7 text-stone-500 text-sm">
							Exibindo {filteredBooks.length} de {library.totalBooks}{" "}
							{library.totalBooks === 1 ? "livro" : "livros"}
						</p>
						<div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
							{filteredBooks.map((book) => (
								<article key={book.id}>
									<button
										aria-label={
											book.format === "PDF"
												? `Ler ${book.title}`
												: `${book.title}: leitura EPUB ainda indisponível`
										}
										className={`relative block aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-left shadow-md transition-transform duration-300 ${
											book.format === "PDF"
												? "cursor-pointer from-amber-900 to-amber-700 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-amber-900 focus-visible:outline-offset-2"
												: "cursor-default from-emerald-900 to-emerald-700"
										}`}
										disabled={book.format !== "PDF"}
										onClick={() => handleOpenBook(book.id)}
										type="button"
									>
										{book.metadata?.coverUrl && (
											<img
												alt={`Capa de ${book.title}`}
												className="absolute inset-0 size-full object-cover"
												src={book.metadata.coverUrl}
											/>
										)}
										<div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.12)_50%,transparent_65%)]" />
										<div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15" />
										<div className="relative flex h-full flex-col justify-between border border-white/20 p-4 text-white">
											<svg
												aria-hidden="true"
												className="size-7 opacity-80"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="1.5"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h3A2.25 2.25 0 0 1 12 5.25V21a2.25 2.25 0 0 0-2.25-2.25h-3A2.25 2.25 0 0 0 4.5 21V5.25Zm15 0A2.25 2.25 0 0 0 17.25 3h-3A2.25 2.25 0 0 0 12 5.25V21a2.25 2.25 0 0 1 2.25-2.25h3A2.25 2.25 0 0 1 19.5 21V5.25Z"
												/>
											</svg>
											{!book.metadata?.coverUrl && (
												<p className="text-center font-serif text-xl leading-tight sm:text-2xl">
													{book.title}
												</p>
											)}
											<p className="text-right text-white/70 text-xs uppercase tracking-widest">
												{book.format}
											</p>
										</div>
									</button>
									<h2 className="mt-4 truncate font-bold text-stone-900">
										{book.title}
									</h2>
									<p className="mt-1 truncate text-sm text-stone-500">
										{book.metadata?.authors.length
											? book.metadata.authors.join(", ")
											: book.relativePath}
									</p>
									{book.metadata?.firstPublishYear && (
										<p className="mt-1 text-stone-400 text-xs">
											Primeira publicação: {book.metadata.firstPublishYear}
										</p>
									)}
									{book.format === "PDF" && (
										<button
											className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-semibold text-stone-600 text-xs shadow-sm hover:border-amber-800 hover:text-amber-900"
											onClick={() => setEditingBook(book)}
											type="button"
										>
											<svg
												aria-hidden="true"
												className="size-3.5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
												/>
											</svg>
											Editar
										</button>
									)}
								</article>
							))}
						</div>
					</>
				)}
			</div>

			{isSettingsOpen && (
				<LibrarySettingsModal
					library={library}
					onAddFolder={handleAddFolder}
					onClose={() => setIsSettingsOpen(false)}
					onRemoveFolder={handleRemoveFolder}
					onReplaceFolder={handleReplaceFolder}
				/>
			)}

			{editingBook && (
				<BookEditModal
					book={editingBook}
					onClose={() => setEditingBook(null)}
					onSave={handleSaveBook}
				/>
			)}
		</section>
	);
}
