export declare type FileError = FileTypeError | FileSizeError;

export class FileTypeError {
  constructor(
    public file: File,
    public type: string) { }
}

export class FileSizeError {
  constructor(
    public file: File,
    public limitSize: number,
    public limitSizeString?: string) { }
}
