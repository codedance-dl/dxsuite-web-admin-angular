import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';

import { TreePickerDatabase } from './database.service';
import { FileFlatNode } from './models';

@Injectable()
export class TreePickerDataSource extends DataSource<FileFlatNode> {
  dataChange = new BehaviorSubject<FileFlatNode[]>([]);

  // 纪录折叠的数据列表，这是为了再次展开时保持原来
  private removedNodesMap = new Map<string, FileFlatNode[]>();

  get data(): FileFlatNode[] { return this.dataChange.value; }
  set data(value: FileFlatNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  private _destroy = new Subject();

  constructor(
    private treeControl: FlatTreeControl<FileFlatNode>,
    private database: TreePickerDatabase
  ) { super(); }

  connect(collectionViewer: CollectionViewer): Observable<FileFlatNode[]> {
    this.treeControl.expansionModel.changed.subscribe((change: SelectionChange<FileFlatNode>) => {
      if (change.added || change.removed) {
        this.handleTreeControl(change);
      }
    });
    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect() {
    this.removedNodesMap.clear();
    this._destroy.next();
    this._destroy.complete();
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<FileFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: FileFlatNode, expand: boolean) {
    const index = this.data.indexOf(node);
    if (index < 0 || node.loading) { // If no children, or cannot find the node, no op
      return;
    }

    const callBack = (fileFlatNodes: FileFlatNode[]) => {
      node.loading = false;
      const targetIndex = this.data.indexOf(node);
      if (this.treeControl.isExpanded(node)) {
        this.data.splice(targetIndex + 1, 0, ...fileFlatNodes);
      }
      this.dataChange.next(this.data);
    };

    if (expand) {
      node.loading = true;
      let fileFlatNodes = this.removedNodesMap.get(node.id);
      if (!fileFlatNodes) {
        this.database.getChildren(node.id).subscribe(files => {
          fileFlatNodes = files
            .filter(file => file.isDirectory)
            .map(file => new FileFlatNode(file, true, node.level + 1));
          this.removedNodesMap.set(node.id, fileFlatNodes);
          callBack(fileFlatNodes);
        });
      } else {
        callBack(fileFlatNodes);
      }
    } else {
      let count = 0;
      for (let i = index + 1; i < this.data.length
        && this.data[i].level > node.level; i++) { count++; }
      this.removedNodesMap.set(node.id, this.data.splice(index + 1, count));
      this.dataChange.next(this.data);
    }
  }
}
