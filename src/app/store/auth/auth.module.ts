import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AuthState } from '@app/store/auth/auth.state';

@NgModule({
  imports: [NgxsModule.forFeature([AuthState])]
})
export class AuthStateModule { }
