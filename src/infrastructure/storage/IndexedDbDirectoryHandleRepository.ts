import type { DirectoryHandleRepository } from "../../application/library/DirectoryHandleRepository";

interface StoredDirectoryHandle {
	id: string;
	handle: FileSystemDirectoryHandle;
}

const DATABASE_NAME = "estante-local";
const DATABASE_VERSION = 1;
const STORE_NAME = "directory-handles";

export class IndexedDbDirectoryHandleRepository
	implements DirectoryHandleRepository
{
	public async find(
		folderId: string,
	): Promise<FileSystemDirectoryHandle | null> {
		const database = await this.openDatabase();
		const transaction = database.transaction(STORE_NAME, "readonly");
		const request = transaction
			.objectStore(STORE_NAME)
			.get(folderId) as IDBRequest<StoredDirectoryHandle | undefined>;
		const storedHandle = await this.resolveRequest(request);

		database.close();
		return storedHandle?.handle ?? null;
	}

	public async remove(folderId: string): Promise<void> {
		const database = await this.openDatabase();
		const transaction = database.transaction(STORE_NAME, "readwrite");

		transaction.objectStore(STORE_NAME).delete(folderId);
		await this.resolveTransaction(transaction);
		database.close();
	}

	public async save(
		folderId: string,
		handle: FileSystemDirectoryHandle,
	): Promise<void> {
		const database = await this.openDatabase();
		const transaction = database.transaction(STORE_NAME, "readwrite");

		transaction.objectStore(STORE_NAME).put({ id: folderId, handle });
		await this.resolveTransaction(transaction);
		database.close();
	}

	private openDatabase(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

			request.onupgradeneeded = () => {
				if (!request.result.objectStoreNames.contains(STORE_NAME)) {
					request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
				}
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	private resolveRequest<T>(request: IDBRequest<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	private resolveTransaction(transaction: IDBTransaction): Promise<void> {
		return new Promise((resolve, reject) => {
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
			transaction.onabort = () => reject(transaction.error);
		});
	}
}
