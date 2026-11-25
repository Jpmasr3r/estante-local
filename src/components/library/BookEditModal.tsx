import { type FormEvent, useEffect, useState } from "react";
import { z } from "zod";

import type { BookFile } from "../../domain/library/BookFile";
import type { BookMetadataData } from "../../domain/library/BookMetadata";

const currentYear = new Date().getFullYear();

const bookFormSchema = z.object({
	title: z.string().trim().min(1, "Informe um título."),
	authors: z.string(),
	coverUrl: z.union([
		z.literal(""),
		z.url({ error: "Informe uma URL de imagem válida." }),
	]),
	firstPublishYear: z.union([
		z.literal(""),
		z.coerce
			.number()
			.int()
			.min(0)
			.max(currentYear + 1, "Informe um ano válido."),
	]),
});

interface BookEditModalProps {
	book: BookFile;
	onClose: () => void;
	onSave: (metadata: Omit<BookMetadataData, "providerId">) => void;
}

export function BookEditModal({ book, onClose, onSave }: BookEditModalProps) {
	const [coverPreview, setCoverPreview] = useState(
		book.metadata?.coverUrl ?? "",
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", closeOnEscape);
		return () => document.removeEventListener("keydown", closeOnEscape);
	}, [onClose]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const result = bookFormSchema.safeParse({
			title: formData.get("title"),
			authors: formData.get("authors"),
			coverUrl: formData.get("coverUrl"),
			firstPublishYear: formData.get("firstPublishYear"),
		});

		if (!result.success) {
			setErrorMessage(result.error.issues[0]?.message ?? "Revise os dados.");
			return;
		}

		onSave({
			title: result.data.title,
			authors: result.data.authors
				.split(",")
				.map((author) => author.trim())
				.filter(Boolean),
			coverUrl: result.data.coverUrl || null,
			firstPublishYear:
				result.data.firstPublishYear === ""
					? null
					: result.data.firstPublishYear,
		});
	};

	return (
		<div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
			<button
				aria-label="Fechar edição"
				className="absolute inset-0 bg-black/55 backdrop-blur-sm"
				onClick={onClose}
				type="button"
			/>

			<section
				aria-labelledby="book-edit-title"
				aria-modal="true"
				className="app-panel relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-surface shadow-2xl"
				role="dialog"
			>
				<header className="flex items-start justify-between gap-4 border-border border-b px-6 py-5 sm:px-8">
					<div>
						<h2 className="font-bold text-2xl text-text" id="book-edit-title">
							Editar informações
						</h2>
						<p className="mt-1 truncate text-sm text-muted">
							Arquivo original: {book.fileName}
						</p>
					</div>
					<button
						aria-label="Fechar"
						className="app-button grid size-10 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-strong"
						onClick={onClose}
						type="button"
					>
						<span aria-hidden="true" className="text-2xl leading-none">
							×
						</span>
					</button>
				</header>

				<form
					className="grid gap-6 px-6 py-6 sm:grid-cols-[10rem_1fr] sm:px-8"
					onSubmit={handleSubmit}
				>
					<div>
						<div className="aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-accent to-accent-strong shadow-md">
							{coverPreview ? (
								<img
									alt="Prévia da capa"
									className="size-full object-cover"
									src={coverPreview}
								/>
							) : (
								<div className="grid size-full place-items-center p-4 text-center font-serif text-accent-contrast">
									{book.title}
								</div>
							)}
						</div>
					</div>

					<div className="space-y-4">
						<label className="block">
							<span className="font-semibold text-sm text-text">Título</span>
							<input
								className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
								defaultValue={book.title}
								name="title"
								type="text"
							/>
						</label>

						<label className="block">
							<span className="font-semibold text-sm text-text">Autores</span>
							<input
								className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
								defaultValue={book.metadata?.authors.join(", ") ?? ""}
								name="authors"
								placeholder="Separe os autores por vírgulas"
								type="text"
							/>
						</label>

						<label className="block">
							<span className="font-semibold text-sm text-text">
								Ano de publicação
							</span>
							<input
								className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
								defaultValue={book.metadata?.firstPublishYear ?? ""}
								max={currentYear + 1}
								min="0"
								name="firstPublishYear"
								type="number"
							/>
						</label>

						<label className="block">
							<span className="font-semibold text-sm text-text">
								URL da capa
							</span>
							<input
								className="mt-1.5 h-11 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
								defaultValue={book.metadata?.coverUrl ?? ""}
								name="coverUrl"
								onChange={(event) => setCoverPreview(event.currentTarget.value)}
								placeholder="https://exemplo.com/capa.jpg"
								type="url"
							/>
						</label>

						{errorMessage && (
							<p className="text-danger text-sm" role="alert">
								{errorMessage}
							</p>
						)}

						<div className="flex justify-end gap-3 pt-2">
							<button
								className="app-button rounded-xl px-4 py-2.5 font-semibold text-sm text-muted hover:bg-surface-strong"
								onClick={onClose}
								type="button"
							>
								Cancelar
							</button>
							<button
								className="app-primary rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-contrast text-sm hover:bg-accent-strong"
								type="submit"
							>
								Salvar alterações
							</button>
						</div>
					</div>
				</form>
			</section>
		</div>
	);
}
