import type {
	DirectoryPicker,
	DirectorySelection,
} from "../../application/library/DirectoryPicker";

export class BrowserDirectoryPicker implements DirectoryPicker {
	public async select(): Promise<DirectorySelection | null> {
		if (typeof showDirectoryPicker === "function") {
			return this.selectWithFileSystemAccess();
		}

		return this.selectWithFileInput();
	}

	private async selectWithFileSystemAccess(): Promise<DirectorySelection | null> {
		try {
			const handle = await showDirectoryPicker({ mode: "read" });

			return { kind: "handle", handle };
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				return null;
			}

			throw error;
		}
	}

	private selectWithFileInput(): Promise<DirectorySelection | null> {
		return new Promise((resolve) => {
			const input = document.createElement("input");

			input.type = "file";
			input.multiple = true;
			input.hidden = true;
			input.setAttribute("webkitdirectory", "");
			input.setAttribute("directory", "");

			const finish = (selection: DirectorySelection | null) => {
				input.remove();
				resolve(selection);
			};

			input.addEventListener(
				"change",
				() => {
					const files = input.files;
					finish(files && files.length > 0 ? { kind: "files", files } : null);
				},
				{ once: true },
			);
			input.addEventListener("cancel", () => finish(null), { once: true });
			document.body.append(input);
			input.click();
		});
	}
}
