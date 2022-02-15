import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import {
  GUARD_HANDLER,
  GuardHandler,
  NoopGuardHandler
} from './guard-handler';
import { WithPrivilegeDirective } from './with-privilege.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [WithPrivilegeDirective],
  exports: [WithPrivilegeDirective]
})
export class SecurityModule {
  public static forRoot<T>(handler?: Type<GuardHandler<T>>): ModuleWithProviders<SecurityModule> {
    return {
      ngModule: SecurityModule,
      providers: [
        { provide: GUARD_HANDLER, useClass: handler || NoopGuardHandler }
      ]
    };
  }
}
