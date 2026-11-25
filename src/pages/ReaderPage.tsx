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
		<section className="flex min-h-[calc(100vh-4.5rem)] flex-col bg-stone-900">
			<header className="flex flex-wrap items-center justify-between gap-4 border-white/10 border-b bg-stone-950 px-5 py-3 text-white sm:px-8">
				<div className="flex min-w-0 items-center gap-4">
					<Link
						className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-semibold text-sm text-stone-200 hover:bg-white/10"
						to="/biblioteca"
					>
						<span aria-hidden="true">←</span>
						Voltar
					</Link>
					<div className="min-w-0 border-white/15 border-l pl-4">
						<h1 className="truncate font-semibold">{book.title}</h1>
						<p className="truncate text-stone-400 text-xs">
							{book.relativePath}
						</p>
					</div>
				</div>

				{sourceUrl && (
					<a
						className="rounded-lg border border-white/20 px-3 py-2 font-semibold text-sm text-stone-200 hover:bg-white/10"
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
					className="min-h-0 flex-1 border-0 bg-stone-800"
					src={`${sourceUrl}#view=FitH`}
					title={`Leitura de ${book.title}`}
				/>
			) : (
				<div className="grid flex-1 place-items-center px-6 py-16 text-center">
					<div className="max-w-md text-stone-200">
						<h2 className="font-bold text-2xl">
							{isLoading ? "Carregando PDF..." : "Acesso ao arquivo necessário"}
						</h2>
						{!isLoading && (
							<>
								<p className="mt-3 text-stone-400 leading-relaxed">
									Autorize novamente a pasta para abrir este arquivo. Em
									navegadores sem acesso persistente, releia a pasta nas
									configurações.
								</p>
								<button
									className="mt-6 rounded-xl bg-amber-700 px-5 py-3 font-semibold text-white hover:bg-amber-600"
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
