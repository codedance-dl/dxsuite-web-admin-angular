import { NgModule } from '@angular/core';

import { FileIconPipe } from './file-icon.pipe';
import { FileSizePipe } from './file-size.pipe';
import { FileSelectDirective } from './file-select.directive';

@NgModule({
  declarations: [
    FileIconPipe,
    FileSizePipe,
    FileSelectDirective
  ],
  exports: [
    FileIconPipe,
    FileSizePipe,
    FileSelectDirective
  ],
})
export class FileUntilPipeModule {}
