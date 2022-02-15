import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { FileUntilPipeModule } from '@pipe/file-util';

import { DocumentsComponent } from './documents.component';
import { FileEntryComponent } from './file-entry.component';
import { NewFolderModule } from './new-folder.module';
import { DocumentsState } from './state/documents.state';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { TreePickerModule } from './tree-picker/tree.module';

const routes: Routes = [
  { path: '', component: DocumentsComponent }
];

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NzModalModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzToolTipModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzIconModule,
    NzGridModule,
    FileUntilPipeModule,
    NewFolderModule,
    NzSpinModule,
    NzEmptyModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([DocumentsState]),
    NzUploadModule,
    TreePickerModule
  ],
  declarations: [
    DocumentsComponent,
    FileEntryComponent,
  ]
})
export class DocumentsModule {}
