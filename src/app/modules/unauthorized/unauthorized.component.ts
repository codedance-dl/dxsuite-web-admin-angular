import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '@api/models';
import { AuthState, ClearIdentity } from '@store/auth';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-unauthorized',
  templateUrl: 'unauthorized.component.html',
  styleUrls: ['unauthorized.component.less']
})
export class UnauthorizedComponent implements OnInit {

  @Select(AuthState.getIdentity) user$: Observable<User>;
  user: User;

  target: string;

  // 画面是否显示
  isShow = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      response => {
        this.target = response.origin_target;
        this.router.navigate([this.target ? this.target : '/'], { replaceUrl: true }).then(res => {
          if (!res) {
            this.message.error('无权访问，请联系管理员为你设置权限');
            this.isShow = true;
          }
        });
      }
    );
  }

  /**
   * 返回系统
   */
  back() {
    this.router.navigate(['/', 'dashboard'], { replaceUrl: true });
  }

  /**
   * 点击重试
   */
  retry() {
    location.reload();
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
    window.open('https://dxsuite.cn', '_blank');
  }
}
