

import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { ClorderIsPlatformDirective } from './is-platform.directive';
import { PlatformState } from './platforms.state';

@NgModule({
  imports: [NgxsModule.forFeature([PlatformState])],
  exports: [ClorderIsPlatformDirective],
  declarations: [ClorderIsPlatformDirective],
})
export class ClorderPlatformsStateModule {
  static forRoot(): ModuleWithProviders<ClorderPlatformsStateModule> {
    return { ngModule: ClorderPlatformsStateModule };
  }
}
