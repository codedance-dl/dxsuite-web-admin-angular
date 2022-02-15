import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoErrorTipDirective } from './auto-error-tip.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AutoErrorTipDirective],
  exports: [AutoErrorTipDirective]
})
export class AutoErrorTipModule { }
