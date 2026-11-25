import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LibrarySettingsModal } from "../components/library/LibrarySettingsModal";
import { libraryManager } from "../config/library";
import type { LocalLibrary } from "../domain/library/LocalLibrary";

interface LibraryPageProps {
	library: LocalLibrary;
}

export function LibraryPage({ library: initialLibrary }: LibraryPageProps) {
	const navigate = useNavigate();
	const [library, setLibrary] = useState(initialLibrary);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [statusMessage, setStatusMessage] = useState<string | null>(null);

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
							placeholder="Pesquisar por título ou autor..."
							type="search"
						/>
					</label>

					<button
						className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 font-semibold text-stone-700 shadow-sm"
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
					</button>
				</div>

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
				) : (
					<div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
						{library.books.map((book) => (
							<article className="group" key={book.id}>
								<div
									className={`relative aspect-[2/3] overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-md transition-transform duration-300 group-hover:-translate-y-1 ${
										book.format === "PDF"
											? "from-amber-900 to-amber-700"
											: "from-emerald-900 to-emerald-700"
									}`}
								>
									<div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.12)_50%,transparent_65%)]" />
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
										<p className="text-center font-serif text-xl leading-tight sm:text-2xl">
											{book.title}
										</p>
										<p className="text-right text-white/70 text-xs uppercase tracking-widest">
											{book.format}
										</p>
									</div>
								</div>
								<h2 className="mt-4 truncate font-bold text-stone-900">
									{book.title}
								</h2>
								<p className="mt-1 truncate text-sm text-stone-500">
									{book.relativePath}
								</p>
							</article>
						))}
					</div>
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
		</section>
	);
}
