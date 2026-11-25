export type DirectorySelection =
	| { kind: "handle"; handle: FileSystemDirectoryHandle }
	| { kind: "files"; files: FileList };

export interface DirectoryPicker {
	select(): Promise<DirectorySelection | null>;
}
