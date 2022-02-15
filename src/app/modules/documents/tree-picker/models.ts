import { FileEntry } from '@api/models/files';

export interface FilePath {
  title: string;
  id: string;
}

export class FileFlatNode {
  public id: string;
  public name: string;
  public isDirectory: boolean;
  public isRoot?: boolean;
  public loading = false;
  constructor(
    public original: FileEntry,
    public expandable: boolean,
    public level: number
  ) {
    this.id = original.id;
    this.name = original.name;
    this.isDirectory = original.isDirectory;
  }
}
