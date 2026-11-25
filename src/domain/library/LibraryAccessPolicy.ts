import type { LibrarySession } from "../../application/library/LibrarySession";
import type { LocalLibrary } from "./LocalLibrary";

export class LibraryAccessPolicy {
	public constructor(private readonly librarySession: LibrarySession) {}

	public getAccessibleLibrary(): LocalLibrary | null {
		const library = this.librarySession.getCurrentLibrary();

		return library && library.folders.length > 0 ? library : null;
	}
}
