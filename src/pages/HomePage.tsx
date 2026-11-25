export function HomePage() {
	return (
		<div className="relative isolate overflow-hidden bg-[#fdfbf7]">
			<div
				aria-hidden="true"
				className="absolute top-24 left-1/2 -z-10 size-130 -translate-x-1/2 rounded-full bg-amber-200/35 blur-3xl"
			/>

			<section
				className="mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24"
				aria-labelledby="hero-title"
			>
				<div className="max-w-2xl">
					<span className="inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/70 px-3 py-1.5 font-semibold text-amber-900 text-sm shadow-sm">
						<span className="size-2 rounded-full bg-emerald-600" />
						Sua biblioteca, no seu dispositivo
					</span>

					<h1
						className="mt-6 text-balance font-bold text-4xl text-stone-900 leading-[1.08] tracking-tight sm:text-6xl"
						id="hero-title"
					>
						Seus livros digitais, finalmente organizados.
					</h1>

					<p className="mt-6 max-w-xl text-lg text-stone-600 leading-relaxed">
						Selecione uma pasta e transforme seus arquivos PDF e EPUB em uma
						biblioteca visual, organizada e fácil de consultar.
					</p>

					<ul className="mt-8 grid gap-3 text-stone-700 sm:grid-cols-2">
						<li className="flex items-center gap-3">
							<span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
								<svg
									aria-hidden="true"
									className="size-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m4.5 12.75 6 6 9-13.5"
									/>
								</svg>
							</span>
							Sem cadastro
						</li>
						<li className="flex items-center gap-3">
							<span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800">
								<svg
									aria-hidden="true"
									className="size-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m4.5 12.75 6 6 9-13.5"
									/>
								</svg>
							</span>
							Arquivos sempre privados
						</li>
					</ul>
				</div>

				<div className="rounded-3xl border border-amber-900/10 bg-white/80 p-4 shadow-[0_24px_70px_-30px_rgba(69,45,20,0.35)] backdrop-blur sm:p-6">
					<div className="rounded-2xl border-2 border-amber-900/20 border-dashed bg-amber-50/60 px-6 py-12 text-center sm:px-10 sm:py-16">
						<span className="mx-auto grid size-16 place-items-center rounded-2xl bg-amber-900 text-amber-50 shadow-lg shadow-amber-950/20">
							<svg
								aria-hidden="true"
								className="size-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="1.7"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 9.75h16.5m-16.5 0V18A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V9.75m-16.5 0V7.5A2.25 2.25 0 0 1 6 5.25h3.129a2.25 2.25 0 0 1 1.591.659l.621.621a2.25 2.25 0 0 0 1.591.659H18a2.25 2.25 0 0 1 2.25 2.25v.311"
								/>
							</svg>
						</span>

						<h2 className="mt-6 font-bold text-2xl text-stone-900">
							Comece pela sua pasta de livros
						</h2>
						<p className="mx-auto mt-3 max-w-sm text-stone-600 leading-relaxed">
							Escolha a pasta onde seus livros digitais estão armazenados.
						</p>

						<button
							className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-900 px-6 py-3.5 font-semibold text-amber-50 shadow-md transition-colors hover:bg-amber-950 focus-visible:outline-2 focus-visible:outline-amber-800 focus-visible:outline-offset-2"
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
									d="M3.75 9.75h16.5m-16.5 0V18A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V9.75m-16.5 0V7.5A2.25 2.25 0 0 1 6 5.25h3.129a2.25 2.25 0 0 1 1.591.659l.621.621a2.25 2.25 0 0 0 1.591.659H18a2.25 2.25 0 0 1 2.25 2.25v.311"
								/>
							</svg>
							Selecionar pasta
						</button>

						<p className="mt-5 font-medium text-stone-500 text-xs uppercase tracking-wider">
							Formatos compatíveis: PDF e EPUB
						</p>
					</div>

					<div className="flex items-start gap-3 px-2 pt-5 text-stone-500 text-sm">
						<svg
							aria-hidden="true"
							className="mt-0.5 size-4 shrink-0 text-emerald-700"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 10.125h10.5A2.625 2.625 0 0 0 19.875 18v-4.875a2.625 2.625 0 0 0-2.625-2.625H6.75a2.625 2.625 0 0 0-2.625 2.625V18a2.625 2.625 0 0 0 2.625 2.625Z"
							/>
						</svg>
						<p>
							Seus arquivos são processados localmente e não são enviados para
							nenhum servidor.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
