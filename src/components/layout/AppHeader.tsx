import { env } from "../../config/env";

export function AppHeader() {
	return (
		<header className="border-amber-950/10 border-b bg-[#fdfbf7]/90 px-5 backdrop-blur sm:px-8">
			<div className="mx-auto flex min-h-18 w-full max-w-6xl items-center justify-between gap-6">
				<a
					className="flex items-center gap-3 text-amber-950 no-underline"
					href="/"
					aria-label="Página inicial do Estante Local"
				>
					<span className="grid size-10 place-items-center rounded-xl bg-amber-900 text-amber-50 shadow-sm">
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
								d="M4.5 5.25A2.25 2.25 0 0 1 6.75 3h3A2.25 2.25 0 0 1 12 5.25V21a2.25 2.25 0 0 0-2.25-2.25h-3A2.25 2.25 0 0 0 4.5 21V5.25Zm15 0A2.25 2.25 0 0 0 17.25 3h-3A2.25 2.25 0 0 0 12 5.25V21a2.25 2.25 0 0 1 2.25-2.25h3A2.25 2.25 0 0 1 19.5 21V5.25Z"
							/>
						</svg>
					</span>
					<span className="font-bold text-lg tracking-tight sm:text-xl">
						{env.VITE_APP_NAME}
					</span>
				</a>

				<span className="hidden items-center gap-2 text-sm text-stone-600 sm:flex">
					<svg
						aria-hidden="true"
						className="size-4 text-emerald-700"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					Processamento 100% local
				</span>
			</div>
		</header>
	);
}
