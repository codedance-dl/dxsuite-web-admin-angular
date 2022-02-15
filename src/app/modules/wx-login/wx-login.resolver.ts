import { NzMessageService } from 'ng-zorro-antd/message';
import { switchMap } from 'rxjs/operators';
import { ClearIdentity, SetIdentity } from 'src/app/store';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { UserAuthService } from '@api';
import { Store } from '@ngxs/store';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WxLoginResolve implements Resolve<any> {
  constructor(
    private message: NzMessageService,
    private userAuthService: UserAuthService,
    private store: Store,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const code  = route.queryParams.code;
    if (code) {
      // weixin登录
      this.userAuthService.wechatAuthorization(code).pipe(
        switchMap(() => this.userAuthService.getUser()),
      ).subscribe(res => {
        if (res) {
          this.store.dispatch(new SetIdentity(res));
          this.message.success(`登录成功`);
          this.router.navigate(['/'], { replaceUrl: true }).then();
        } else {
          this.store.dispatch(new ClearIdentity());
        }
      }, error => {
        // 登录失败跳转未绑定的页面并且清空token信息
        this.store.dispatch(new ClearIdentity());
        this.message.error(`登录失败, ${error.error.message}`);
        return this.router.navigate(['/wx-login/unauthorized'], { replaceUrl: true }).then();
      });
    }
  }
}
