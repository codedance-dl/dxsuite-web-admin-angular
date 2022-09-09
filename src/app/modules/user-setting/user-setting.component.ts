import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@api/models';
import { Select, Store } from '@ngxs/store';
import { AuthState, ClearIdentity } from '@store/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { goHome } from '@constant/function';

@Component({
  templateUrl: 'user-setting.component.html',
  styleUrls: ['user-setting.component.less']
})
export class UserSettingComponent {

  @Select(AuthState.getIdentity) user$: Observable<User>;
  user: User;
  constructor(
    private store: Store,
    private router: Router,
    private modal: NzModalService,
    private message: NzMessageService
  ) {
  }

  /**
   * 返回系统
   */
  back() {
    this.router.navigate(['/', 'dashboard'], { replaceUrl: true });
  }

  /**
   * 退出登录
   */
  signout() {
    this.modal.confirm({
      nzTitle: '确定要退出系统吗？',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.store.dispatch(new ClearIdentity());
        this.message.success('退出成功');
      },
      nzCancelText: '取消',
    });
  }

  /**
   * 跳转官网首页
   */
  toHomePage() {
    goHome();
  }
}
