import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UserAuthService } from '@api';
import { DataServiceResult } from '@api/models';
import { Store } from '@ngxs/store';
import { AuthState } from '@store/auth';

@Injectable()
export class SecurityResolve implements Resolve<DataServiceResult> {

  constructor(
    private store: Store,
    private service: UserAuthService
  ) { }

  resolve() {
    const userId = this.store.selectSnapshot(AuthState.getIdentity).id;
    return this.service.getCredentials(userId);
  }
}
