import { BehaviorSubject, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FilesService } from '@api/files.service';
import { User } from '@api/models';
import { FileEntry } from '@api/models/files';
import { AuthState } from '@app/store';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';

@Injectable()
export class TreePickerDatabase {
  orgId = environment.orgId;

  user: User;

  _dataChange = new BehaviorSubject<FileEntry[]>([]);

  sortQuery = {
    sortBy: ['isDirectory:desc', 'uploadedAt:desc']
  };

  // 数据源首次初始化变量
  private _initialized = false;

  private _cacheFileMap = new Map<string, FileEntry[]>();

  get dataChange() {
    return this._dataChange.pipe(filter(() => this._initialized));
  }

  constructor(
    private filesService: FilesService,
    private store: Store
  ) {
    this.user = this.store.selectSnapshot(AuthState.getIdentity);
    this.getRoot();
  }

  getRoot() {
    if (this.user?.rootDirectory) {
      this.filesService.getFilesByOwnerAndDirectory(this.orgId, this.user?.id, this.user?.rootDirectory, { isDirectory: true, ...this.sortQuery }).subscribe(({ data }) => {
        this._initialized = true;
        this._dataChange.next(data);
      });
    } else {
      this.filesService.getRootDirectoryByOwner(this.orgId, this.user?.id, { isDirectory: true, ...this.sortQuery }).subscribe(({ data }) => {
        this._initialized = true;
        this._dataChange.next(data);
      });
    }
  }

  getChildren(fileId: string, forceRequest = false) {
    const cacheFiles = this._cacheFileMap.get(fileId);
    if (cacheFiles && !forceRequest) {
      return of(cacheFiles);
    } else {
      return this.filesService.getFilesByOwnerAndDirectory(this.orgId, this.user?.id, fileId, { isDirectory: true }).pipe(
        switchMap(({ data }) => {
          this._cacheFileMap.set(fileId, data);
          return of(data);
        })
      );
    }
  }

}