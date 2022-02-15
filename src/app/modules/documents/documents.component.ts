import * as FileSaver from 'file-saver';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, OnDestroy, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '@api';
import { FileEntry, User } from '@api/models';
import { UploadService } from '@components/upload-monitor/upload.service';
import { environment } from '@environments/environment';
import { Select, Store } from '@ngxs/store';
import { AuthState } from '@store/auth';

import { NewFolderComponent } from './new-folder.component';
import { DocumentActions } from './state/documents.actions';
import { DocumentsState, DocumentsViewMode } from './state/documents.state';
import { TreePickerComponent } from './tree-picker/tree.component';

@Component({
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentsComponent implements OnInit, OnDestroy {

  @Select(DocumentsState.isLoaded) loaded$: Observable<boolean>;

  @Select(DocumentsState.selectDirectoryBreadcrumbs) breadcrumbs$: Observable<FileEntry[]>;

  @Select(DocumentsState.selectViewMode) viewMode$: Observable<DocumentsViewMode>;

  viewMode: DocumentsViewMode;

  entries$: Observable<FileEntry[]>;

  isEmpty$: Observable<boolean>;

  loading = false;

  selection: string[] = [];

  orgId = environment.orgId;

  limitSize = 10;

  directoryId: string;

  user: User;

  private initialQuery = {
    sortBy: ['isDirectory:desc', 'uploadedAt:desc']
  };

  private destroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private filesService: FilesService,
    private message: NzMessageService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private uploadService: UploadService
  ) {
    this.store
      .select(DocumentsState.selectViewMode)
      .pipe(takeUntil(this.destroy))
      .subscribe(viewMode => this.viewMode = viewMode);

    this.user = this.store.selectSnapshot(AuthState.getIdentity);
  }

  ngOnInit() {

    this.uploadService.done.pipe(takeUntil(this.destroy)).subscribe(result => {
      if (result) {
        this.store.dispatch(new DocumentActions.InsertFile(this.directoryId, result));
      }
    }, error => {
      console.log(error);
    });

    this.route.queryParams
      .pipe(
        map(params => this.mergeQueryParams(params)),
        tap(() => {
          this.loading = true;
        }),
        tap(params => {
          this.directoryId = params.directory || '';
          this.selection = [];
          this.entries$ = this.store.select(DocumentsState.selectCurrentDirectory(params?.directory));
          this.isEmpty$ = this.store.select(DocumentsState.isEmptyDirectory(params?.directory));
        }),
        switchMap(params => {
          this.store.dispatch(new DocumentActions.GetDirectoryBreadcrumbs(params?.directory));
          this.dispatchGetDirectoryAction(params?.directory, params);
          return of(params);
        }),
        takeUntil(this.destroy)
      )
      .subscribe(
        () => {
          this.loading = false;
        },
        () => this.loading = false
      );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  changeViewMode(mode: string) {
    this.loading = true;
    this.store.dispatch(
      new DocumentActions.ChangeViewMode(mode === 'card'
        ? DocumentsViewMode.Card
        : DocumentsViewMode.List
      )
    );
    this.loading = false;
  }

  /**
   * 新建文件夹
   */
  createDirectory() {

    const modal = this.modal.create({
      nzTitle: '新建文件夹',
      nzWidth: '320px',
      nzContent: NewFolderComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null
    });

    // Return a result when closed
    modal.afterClose.subscribe(value => {
      if (value) {
        this.loading = true;
        const directoryId = this.route.snapshot.queryParams.directory;
        this.store.dispatch(new DocumentActions.CreateDirectory(value.data.name, directoryId));
        this.loading = false;
      }
    });

  }

  getChangeSortClass(change: { column: string; sort: string }): 'asc' | 'desc' | null {
    if (change.sort === `${change.column}:asc`) {
      return 'desc';
    } else if (change.sort === `${change.column}:desc`) {
      return null;
    } else {
      return 'asc';
    }
  }

  onSelected(files: File[]) {
    let url;
    if (this.directoryId) {
      url = `/api/v1/tenants/${this.orgId}/files/${this.directoryId}/files`;
    } else {
      url = `/api/v1/tenants/${this.orgId}/files`;
    }
    this.uploadService.upload(files.map((file) => ({ url, file })));
  }

  /**
   * 前端选择文件错误，如文件超过大小提示错误
   */
  onError() {
    this.message.create('error', `单个文件大小不能超过${this.limitSize}M`);
  }

  selectOne(itemId: string) {
    const index = this.selection.indexOf(itemId);
    if (index > -1) {
      this.selection.splice(index, 1);
    } else {
      this.selection.push(itemId);
    }
  }

  trackSelectedCount() {
    const items = this.getCurrentDirectorySnapshot();
    const count = items.filter(item => this.selection.includes(item.id)).length;
    return count === items.length ? '，已全选' : ``;
  }

  trackItemSelected(itemId: string) {
    return this.selection.indexOf(itemId) > -1;
  }

  trackAllSelected() {
    const items = this.getCurrentDirectorySnapshot();
    return items.length > 0 ? items.every(item => this.selection.indexOf(item.id) > -1) : false;
  }

  trackSomeSelected() {
    const items = this.getCurrentDirectorySnapshot();
    return items.length > 0 && this.selection.length > 0 ? !items.every(item => this.selection.indexOf(item.id) > -1) : false;
  }

  selectAll() {
    const items = this.getCurrentDirectorySnapshot();
    if (this.trackAllSelected()) {
      items.forEach(item => {
        const index = this.selection.indexOf(item.id);
        if (index > -1) {
          this.selection.splice(index, 1);
        }
      });
    } else {
      items.forEach(item => {
        if (!this.selection.includes(item.id)) {
          this.selection.push(item.id);
        }
      });
    }
  }

  deleteAllSelected() {
    this.modal.confirm({
      nzTitle: `确定要删除 ${this.selection.length} 项吗？`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.loading = true;
        this.store.dispatch(new DocumentActions.DeleteFiles(this.directoryId, [...this.selection]))
          .pipe(takeUntil(this.destroy))
          .subscribe(() => {
            this.loading = false;
            this.selection.splice(0, this.selection.length);
          });
      },
      nzCancelText: '取消',
    });
  }

  multiDownload() {
    if (this.selection.length === 1) {
      const items = this.getCurrentDirectorySnapshot();
      const firstFile = items.find(item => this.selection.includes(item.id));

      this.loading = true;
      this.filesService.download(firstFile.id).subscribe((response: Blob) => {
        this.loading = false;
        FileSaver.saveAs(response, `${firstFile.name}`);
      }, error => {
        this.loading = false;
        this.message.create('error', error?.error?.message || error?.error?.code);
      });
    } else {

      this.modal.confirm({
        nzTitle: `确定要下载 ${this.selection.length} 项吗`,
        nzOkText: '确定',
        nzOkType: 'primary',
        nzOnOk: () => {
          const items = this.getCurrentDirectorySnapshot();
          const firstFile = items.find(item => this.selection.includes(item.id));
          let zipName = '【批量下载】';
          if (firstFile && firstFile.name) {
            zipName = zipName + `${(firstFile.name.split('.') || [])[0]}等`;
          }

          this.loading = true;
          this.filesService.downloadMulti(this.selection).subscribe((response: Blob) => {
            this.loading = false;
            FileSaver.saveAs(response, `${zipName}.zip`);
          }, error => {
            this.loading = false;
            this.message.create('error', error?.error?.message || error?.error?.code);
          });
        },
        nzCancelText: '取消',
      });
    }
  }

  isEnableMultiDownload() {
    const items = this.getCurrentDirectorySnapshot();
    const directories = [];
    items.forEach(item => {
      if (this.selection.includes(item.id) && item.isDirectory) {
        directories.push(item);
      }
    });
    return directories.length === 0;
  }

  moveTo() {
    const parentId = this.route.snapshot.queryParams.directory || '';
    const items = this.getCurrentDirectorySnapshot();
    const selectedFiles = items.filter(item => this.selection.includes(item.id));

    const modal = this.modal.create({
      nzTitle: '移动',
      nzWidth: '400px',
      nzContent: TreePickerComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzFooter: null,
      nzComponentParams: {
        files: selectedFiles
      }
    });

    modal.afterClose.subscribe(value => {
      if (value !== undefined) {
        this.loading = true;
        this.store.dispatch(new DocumentActions.MoveFiles(parentId, [...this.selection], value))
          .pipe(takeUntil(this.destroy))
          .subscribe(() => {
            this.loading = false;
            this.selection.splice(0, this.selection.length);
          });
      }
    });
  }

  private getCurrentDirectorySnapshot() {
    const directoryId = this.route.snapshot.queryParams.directory;
    return this.store.selectSnapshot(DocumentsState.selectCurrentDirectory(directoryId)) || [];
  }

  private dispatchGetDirectoryAction(directory?: string, query?: { sortBy: string[] }) {
    return this.store.dispatch(directory
      ? new DocumentActions.GetDirectory(directory, query)
      : new DocumentActions.GetRootDirectory()
    );
  }

  private mergeQueryParams(queryParams) {
    const newQueryParams = { ...this.initialQuery, ...queryParams };
    const pageNo = coerceNumberProperty(queryParams.pageNo, newQueryParams.pageNo);
    const pageSize = coerceNumberProperty(queryParams.pageSize, newQueryParams.pageSize);
    newQueryParams.pageNo = pageNo;
    newQueryParams.pageSize = pageSize;

    return newQueryParams;
  }

}
