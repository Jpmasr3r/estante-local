import { DirectoryReader } from "../application/library/DirectoryReader";
import { LibraryManager } from "../application/library/LibraryManager";
import { LibrarySession } from "../application/library/LibrarySession";
import { BrowserDirectoryPicker } from "../infrastructure/browser/BrowserDirectoryPicker";
import { IndexedDbDirectoryHandleRepository } from "../infrastructure/storage/IndexedDbDirectoryHandleRepository";
import { LocalStorageLibraryRepository } from "../infrastructure/storage/LocalStorageLibraryRepository";

export const librarySession = new LibrarySession(
	new LocalStorageLibraryRepository(),
);

export const libraryManager = new LibraryManager(
	librarySession,
	new DirectoryReader(),
	new IndexedDbDirectoryHandleRepository(),
	new BrowserDirectoryPicker(),
);
