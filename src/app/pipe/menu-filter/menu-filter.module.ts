import { NgModule } from '@angular/core';

import { MenuFilterPipe } from './menu-filter.pipe';

@NgModule({
  declarations: [
    MenuFilterPipe
  ],
  exports: [
    MenuFilterPipe
  ],
})
export class MenuFilterPipeModule { }
