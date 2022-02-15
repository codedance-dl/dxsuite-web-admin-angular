import { Subject } from 'rxjs';

import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy } from '@angular/core';

import { FileFlatNode } from './models';
import { TreePickerDataSource } from './data-source.service';
import { TreePickerDatabase } from './database.service';
import { FileEntry } from '@api/models/files';
import { User } from '@api/models';
import { Store } from '@ngxs/store';
import { AuthState } from '@app/store';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'document-tree-picker',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less'],
  providers: [TreePickerDatabase]
})
export class TreePickerComponent implements OnDestroy {

  dataSource: TreePickerDataSource;
  treeControl: FlatTreeControl<FileFlatNode>;

  fileId: string;

  loading = true;
  expanded = false;

  files: FileEntry[];

  user: User;
  private _destroy = new Subject();

  constructor(
    private store: Store,
    private database: TreePickerDatabase,
    private modal: NzModalRef
  ) {
    this.treeControl = new FlatTreeControl(this._getLevel, this._isExpandable);
    this.dataSource = new TreePickerDataSource(this.treeControl, this.database);

    this.user = this.store.selectSnapshot(AuthState.getIdentity);

    this.database.dataChange.subscribe(result => {
      this.loading = false;
      this.expanded = true;
      this.dataSource.data = result.map((fileItem) => new FileFlatNode(fileItem, true, 0));
    });
  }

  select(fileId) {
    if (!this.files.find(file => file.id === fileId)) {
      this.fileId = fileId;
    }
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  enable = (_: number, _node: FileFlatNode) => _node.expandable && !this.files.find(file => file.id === _node.id);

  disable = (_: number, _node: FileFlatNode) => _node.expandable && this.files.find(file => file.id === _node.id);

  confirmIsDisabled() {
    return !this.fileId || this.files.find(file => file.parentId === this.fileId || this.fileId === file.path);
  }

  confirm() {
    this.modal.close(this.fileId);
  }

  private _getLevel = (node: FileFlatNode) => node.level;
  private _isExpandable = (node: FileFlatNode) => node.expandable;

}
