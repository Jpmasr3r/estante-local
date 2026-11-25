export type Theme = "light" | "dark";

const STORAGE_KEY = "estante-local:theme";

export class ThemeManager {
	public initialize(): Theme {
		let storedTheme: string | null = null;

		try {
			storedTheme = localStorage.getItem(STORAGE_KEY);
		} catch {
			// A preferência do sistema continua disponível sem armazenamento local.
		}
		const theme = this.isTheme(storedTheme)
			? storedTheme
			: matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";

		this.apply(theme);
		return theme;
	}

	public toggle(currentTheme: Theme): Theme {
		const theme = currentTheme === "light" ? "dark" : "light";

		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// A troca continua válida durante a sessão atual.
		}
		this.apply(theme);
		return theme;
	}

	private apply(theme: Theme): void {
		document.documentElement.dataset.theme = theme;
	}

	private isTheme(value: string | null): value is Theme {
		return value === "light" || value === "dark";
	}
}

export const themeManager = new ThemeManager();
