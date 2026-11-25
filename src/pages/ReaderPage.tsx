import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { libraryManager } from "../config/library";
import type { BookFile } from "../domain/library/BookFile";

interface ReaderPageProps {
	book: BookFile;
}

export function ReaderPage({ book }: ReaderPageProps) {
	const [file, setFile] = useState<File | null>(book.source);
	const [sourceUrl, setSourceUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(book.source === null);

	useEffect(() => {
		if (file) {
			return;
		}

		let isMounted = true;

		libraryManager.getBookSource(book.id).then((storedFile) => {
			if (isMounted) {
				setFile(storedFile);
				setIsLoading(false);
			}
		});

		return () => {
			isMounted = false;
		};
	}, [book.id, file]);

	useEffect(() => {
		if (!file) {
			setSourceUrl(null);
			return;
		}

		const objectUrl = URL.createObjectURL(file);
		setSourceUrl(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [file]);

	const handleRequestAccess = async () => {
		setIsLoading(true);
		const storedFile = await libraryManager.getBookSource(book.id, true);
		setFile(storedFile);
		setIsLoading(false);
	};

	return (
		<section className="flex min-h-[calc(100vh-4.5rem)] flex-col bg-background">
			<header className="app-toolbar flex flex-wrap items-center justify-between gap-4 border-border border-b bg-surface px-5 py-3 text-text sm:px-8">
				<div className="flex min-w-0 items-center gap-4">
					<Link
						className="app-button inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-semibold text-sm text-text hover:bg-surface-strong"
						to="/biblioteca"
					>
						<span aria-hidden="true">←</span>
						Voltar
					</Link>
					<div className="min-w-0 border-border border-l pl-4">
						<h1 className="truncate font-semibold">{book.title}</h1>
						<p className="truncate text-muted text-xs">{book.relativePath}</p>
					</div>
				</div>

				{sourceUrl && (
					<a
						className="app-button rounded-lg border border-border px-3 py-2 font-semibold text-sm text-text hover:bg-surface-strong"
						href={sourceUrl}
						rel="noreferrer"
						target="_blank"
					>
						Abrir em nova aba
					</a>
				)}
			</header>

			{sourceUrl ? (
				<iframe
					className="min-h-0 flex-1 border-0 bg-surface-strong"
					src={`${sourceUrl}#view=FitH`}
					title={`Leitura de ${book.title}`}
				/>
			) : (
				<div className="grid flex-1 place-items-center px-6 py-16 text-center">
					<div className="max-w-md text-text">
						<h2 className="font-bold text-2xl">
							{isLoading ? "Carregando PDF..." : "Acesso ao arquivo necessário"}
						</h2>
						{!isLoading && (
							<>
								<p className="mt-3 text-muted leading-relaxed">
									Autorize novamente a pasta para abrir este arquivo. Em
									navegadores sem acesso persistente, releia a pasta nas
									configurações.
								</p>
								<button
									className="app-primary mt-6 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-contrast hover:bg-accent-strong"
									onClick={handleRequestAccess}
									type="button"
								>
									Autorizar acesso
								</button>
							</>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
