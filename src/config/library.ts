import { DirectoryReader } from "../application/library/DirectoryReader";
import { LibraryManager } from "../application/library/LibraryManager";
import { LibrarySession } from "../application/library/LibrarySession";
import { BookMetadataMatcher } from "../application/metadata/BookMetadataMatcher";
import { BookMetadataService } from "../application/metadata/BookMetadataService";
import { BookTitleNormalizer } from "../application/metadata/BookTitleNormalizer";
import { BrowserDirectoryPicker } from "../infrastructure/browser/BrowserDirectoryPicker";
import { OpenLibraryMetadataProvider } from "../infrastructure/http/OpenLibraryMetadataProvider";
import { IndexedDbDirectoryHandleRepository } from "../infrastructure/storage/IndexedDbDirectoryHandleRepository";
import { LocalStorageLibraryRepository } from "../infrastructure/storage/LocalStorageLibraryRepository";

export const librarySession = new LibrarySession(
	new LocalStorageLibraryRepository(),
);

const titleNormalizer = new BookTitleNormalizer();
const metadataService = new BookMetadataService(
	new OpenLibraryMetadataProvider(),
	titleNormalizer,
	new BookMetadataMatcher(titleNormalizer),
);

export const libraryManager = new LibraryManager(
	librarySession,
	new DirectoryReader(),
	new IndexedDbDirectoryHandleRepository(),
	new BrowserDirectoryPicker(),
	metadataService,
);
