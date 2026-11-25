import type { LocalLibrary } from "../../domain/library/LocalLibrary";

export interface LibraryRepository {
	find(): LocalLibrary | null;
	save(library: LocalLibrary): void;
}
