import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoErrorTipModule } from '@components/auto-error-tip/auto-error-tip.module';

import { NewFolderComponent } from './new-folder.component';

@NgModule({
  imports: [
    CommonModule,
    NzButtonModule,
    NzModalModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    AutoErrorTipModule
  ],
  declarations: [NewFolderComponent],
  entryComponents: [NewFolderComponent]
})
export class NewFolderModule { }
