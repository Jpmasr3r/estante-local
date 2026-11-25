import { useEffect } from "react";

import type { LocalLibrary } from "../../domain/library/LocalLibrary";

interface LibrarySettingsModalProps {
	library: LocalLibrary;
	onAddFolder: () => Promise<void>;
	onClose: () => void;
	onRemoveFolder: (folderId: string) => Promise<void>;
	onReplaceFolder: (folderId: string) => Promise<void>;
}

export function LibrarySettingsModal({
	library,
	onAddFolder,
	onClose,
	onRemoveFolder,
	onReplaceFolder,
}: LibrarySettingsModalProps) {
	useEffect(() => {
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", closeOnEscape);
		return () => document.removeEventListener("keydown", closeOnEscape);
	}, [onClose]);

	return (
		<div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
			<button
				aria-label="Fechar configurações"
				className="absolute inset-0 bg-black/55 backdrop-blur-sm"
				onClick={onClose}
				type="button"
			/>

			<section
				aria-labelledby="settings-title"
				aria-modal="true"
				className="app-panel relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-surface shadow-2xl"
				role="dialog"
			>
				<header className="sticky top-0 flex items-start justify-between gap-4 border-border border-b bg-surface px-6 py-5 sm:px-8">
					<div>
						<h2 className="font-bold text-2xl text-text" id="settings-title">
							Configurações da biblioteca
						</h2>
						<p className="mt-1 text-sm text-muted">
							Gerencie as pastas usadas para encontrar seus livros.
						</p>
					</div>
					<button
						aria-label="Fechar"
						className="app-button grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-strong"
						onClick={onClose}
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
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</header>

				<div className="space-y-4 px-6 py-6 sm:px-8">
					{library.folders.map((folder) => (
						<article
							className="app-panel rounded-2xl border border-border bg-surface p-4 shadow-sm"
							key={folder.id}
						>
							<div className="flex items-start gap-3">
								<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-strong text-accent-strong">
									<svg
										aria-hidden="true"
										className="size-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="1.8"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3.75 9.75h16.5m-16.5 0V18A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V9.75m-16.5 0V7.5A2.25 2.25 0 0 1 6 5.25h3.129a2.25 2.25 0 0 1 1.591.659l.621.621a2.25 2.25 0 0 0 1.591.659H18a2.25 2.25 0 0 1 2.25 2.25v.311"
										/>
									</svg>
								</span>
								<div className="min-w-0 flex-1">
									<h3 className="truncate font-bold text-text">
										{folder.name}
									</h3>
									<p className="mt-1 break-all text-sm text-muted">
										Caminho disponível: {folder.path}
									</p>
									<p className="mt-1 text-muted text-xs">
										{folder.totalBooks} arquivos PDF ou EPUB
									</p>
								</div>
							</div>

							<div className="mt-4 flex justify-end gap-2 border-border border-t pt-3">
								<button
									className="app-button rounded-lg px-3 py-2 font-semibold text-sm text-muted hover:bg-surface-strong"
									onClick={() => onReplaceFolder(folder.id)}
									type="button"
								>
									Modificar
								</button>
								<button
									className="app-button rounded-lg px-3 py-2 font-semibold text-danger text-sm hover:bg-surface-strong"
									onClick={() => onRemoveFolder(folder.id)}
									type="button"
								>
									Remover
								</button>
							</div>
						</article>
					))}

					<button
						className="app-button flex w-full items-center justify-center gap-2 rounded-xl border-2 border-accent/25 border-dashed px-4 py-4 font-semibold text-accent-strong hover:bg-surface-strong"
						onClick={onAddFolder}
						type="button"
					>
						<span className="text-xl leading-none">+</span>
						Adicionar pasta
					</button>

					<p className="text-center text-muted text-xs leading-relaxed">
						Por segurança, o navegador não permite exibir o caminho absoluto das
						pastas. Somente os nomes e caminhos relativos ficam disponíveis.
					</p>
				</div>
			</section>
		</div>
	);
}
