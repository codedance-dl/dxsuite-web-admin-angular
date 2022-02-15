import * as FileSaver from 'file-saver';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FilesService } from '@api/files.service';
import { FileEntry } from '@api/models/files';
import { Store } from '@ngxs/store';

import { DocumentsState, DocumentsViewMode } from './state/documents.state';

@Component({
  selector: 'app-file-entry',
  templateUrl: 'file-entry.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'file-entry',
    '[class.selected]': 'checked',
    '(click)': 'onClick($event)'
  },
  styleUrls: ['file-entry.less']
})
export class FileEntryComponent implements OnDestroy {

  @Input() entry: FileEntry;

  @Input() checked: boolean;

  @Output() checkChange = new EventEmitter();

  viewMode: string;

  private destroy = new Subject();

  constructor(
    private store: Store,
    private filesService: FilesService,
    private message: NzMessageService
  ) {
    this.store.select(DocumentsState.selectViewMode)
      .pipe(takeUntil(this.destroy)).subscribe(mode => {
      this.viewMode = mode;
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  onClick(event: Event) {
    // 仅在卡片模式中处理点击事件
    if (this.viewMode === DocumentsViewMode.Card) {
      event.stopPropagation();
      this.checkChange.emit(!this.checked);
    }
  }

  download(entry: FileEntry) {
    this.filesService.download(entry.id).subscribe((response: Blob) => {
      FileSaver.saveAs(response, `${entry.name}`);
    }, error => {
      this.message.create('error', error?.error?.message || error?.error?.code);
    });
  }

}
