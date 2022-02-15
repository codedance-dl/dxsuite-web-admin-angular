import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { GUARD_HANDLER, GuardHandler } from './guard-handler';

@Directive({
  selector: '[withPrivilege]'
})
export class WithPrivilegeDirective {

  constructor(
    private templateRef: TemplateRef<Element>,
    private viewContainer: ViewContainerRef,
    @Inject(GUARD_HANDLER) private codGuardHandler: GuardHandler<unknown>
  ) { }

  @Input() set withPrivilege(condition: string[]) {
    if (this.codGuardHandler.hasPrivilege(condition)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
