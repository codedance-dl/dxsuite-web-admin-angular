import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '@store/auth';

@Injectable({
  providedIn: 'root'
})
export class EnforcePWDChangeGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate() {
    const isEnforce = this.store.selectSnapshot(AuthState.isEnforcePwdChange);
    if (isEnforce) {
      // 密码为初始密码 || 密码已过期 => 需要进入 /password/new
      return this.router.createUrlTree(['/password/new']);
    } else {
      // 密码不是初始密码 || 密码未过期 => 需要进入 nav
      return true;
    }
  }
}
