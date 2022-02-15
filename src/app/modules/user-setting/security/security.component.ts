import { NzMessageService } from 'ng-zorro-antd/message';
import * as qs from 'qs';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService, UserService } from '@api';
import { User } from '@api/models';
import { environment } from '@environments/environment';
import { Select, Store } from '@ngxs/store';
import { AuthState, SetIdentity } from '@store/auth';

@Component({
  selector: 'app-security',
  templateUrl: 'security.component.html',
  styleUrls: ['security.component.less']
})
export class SecurityComponent implements OnInit, OnDestroy {

  @Select(AuthState.getIdentity) getIdentity$: Observable<User | null>;

  user: User;

  code: string;

  // 是否绑定了手机号
  hasMobile: boolean;

  // 是否绑定了邮箱
  hasEmail: boolean;

  // 是否绑定了微信
  hasWechat: boolean;

  // 已绑定的手机信息
  mobileList = [];

  // 已绑定的邮箱信息
  emailList = [];

  // 已绑定的微信信息
  wechatList = [];

  // 登录认证信息
  credentials = [];

  href: string;

  loading: boolean;

  private readonly destroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private router: Router,
    private message: NzMessageService,
  ) {
    this.user = this.store.selectSnapshot(AuthState.getIdentity);
    this.code = this.route.snapshot.queryParams.code || '';
  }

  ngOnInit() {
    this.getUser();
    this.getCredentials();

    if (this.code) {
      this.bindWx();
    }

  }

  getCredentials() {
    this.userAuthService.getCredentials(this.user.id).subscribe(res => {
      this.credentials = res.data;
      if (this.credentials.some(credential => credential.type === 'MOBILE')) {
        this.hasMobile = true;
        this.mobileList = this.credentials.filter(credential => credential.type === 'MOBILE');
      }

      if (this.credentials.some(credential => credential.type === 'EMAIL')) {
        this.hasEmail = true;
        this.emailList = this.credentials.filter(credential => credential.type === 'EMAIL');
      }

      if (this.credentials.some(credential => credential.type === 'WECHAT')) {
        this.hasWechat = true;
        this.getUser();
        this.wechatList = this.credentials.filter(credential => credential.type === 'WECHAT');
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  // 获取微信二维码
  getWxHref() {
    const query = {
      appid: environment.appId,
      redirect_uri: encodeURI(`${environment.website}#/user-settings/security`),
      response_type: 'code',
      scope: 'snsapi_login'
    };

    return 'https://open.weixin.qq.com/connect/qrconnect?' + qs.stringify(query, { arrayFormat: 'repeat' });
  }

  bindWx() {
    this.userAuthService.wechatCertificate(this.user.id, this.code).subscribe(res => {
      const data = {
        name: this.user.name,
        nickName: res.data.nickName
      };
      this.user.nickName = res.data.nickName;
      // 更新用户信息 修改/增加微信nickName
      this.userService.modifyOneUser(this.user.id, this.user.revision, data).pipe(
        switchMap(() => this.userAuthService.getUser()),
        map(result => ({ ...this.store.selectSnapshot(AuthState.getIdentity), ...result }))
      ).subscribe((result) => {
        if (result) {

          this.store.dispatch(new SetIdentity(result));
          this.message.create('success', '微信绑定成功');
          this.router.navigate(['/user-settings/security'], {
            relativeTo: this.route,
            replaceUrl: true,
          }).then(() => {
            this.getCredentials();
          });
        }
      });
    }, error => {
      this.message.create('error', '微信绑定失败' + error?.error.message);
      this.router.navigate(['/user-settings/security'], {
        relativeTo: this.route,
        replaceUrl: true
      }).then();
    });
  }

  getUser() {
    this.userAuthService.getUser().subscribe(res => {
      this.user = res;
    });
  }
}
