import { FileEntry, FilesQuery } from '@api/models/files';

import { DocumentsViewMode } from './documents.state';

export namespace DocumentActions {

  export class GetDirectory {
    static readonly type = '[文档管理] 获取目录';
    constructor(public directoryId: string, public query?: FilesQuery) { }
  }

  export class GetRootDirectory {
    static readonly type = '[文档管理] 获取根目录';
  }

  export class GetDirectoryBreadcrumbs {
    static readonly type = '[文档管理] 获取目录面包屑';
    constructor(public directoryId: string) { }
  }

  export class ChangeViewMode {
    static readonly type = '[文档管理] 切换视图';
    constructor(public viewMode: DocumentsViewMode) { }
  }

  export class ClearCache {
    static readonly type = '[文档管理] 清空缓存';
  }

  export class CreateDirectory {
    static readonly type = '[文档管理] 创建目录';
    constructor(public name: string, public directoryId?: string) { }
  }

  export class DeleteFiles {
    static readonly type = '[文档管理] 批量删除文件';
    constructor(public parentId: string, public fileIds: string[]) { }
  }

  export class InsertFile {
    static readonly type = '[文档管理] 创建文件';
    constructor(public directoryId: string, public file: FileEntry) { }
  }

  export class MoveFiles {
    static readonly type = '[文档管理] 批量移动文件';
    constructor(public parentId: string, public fileIds: string[], public target: string) { }
  }

}
