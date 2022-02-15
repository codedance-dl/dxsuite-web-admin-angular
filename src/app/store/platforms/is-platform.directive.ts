

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngxs/store';

import { PlatformState } from './platforms.state';

@Directive({ selector: '[mzIsPlatform]' })
export class ClorderIsPlatformDirective {

  constructor(
    private templateRef: TemplateRef<Element>,
    private viewContainer: ViewContainerRef,
    private store: Store) { }

  @Input()
  set isPlatform(platform: string) {
    if (this.store.selectOnce(PlatformState.isPlatform(platform))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
