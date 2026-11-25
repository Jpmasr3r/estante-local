export interface DirectoryHandleRepository {
	find(folderId: string): Promise<FileSystemDirectoryHandle | null>;
	remove(folderId: string): Promise<void>;
	save(folderId: string, handle: FileSystemDirectoryHandle): Promise<void>;
}
