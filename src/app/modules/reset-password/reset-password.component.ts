import { transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { fadeInY } from '@libs/animate/core';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
  animations: [
    trigger('fade', [
      transition('void => *', fadeInY({ a: 0, b: 0 }, 0.2))
    ])
  ]
})
export class ResetPasswordComponent {

  current = 0;

  // 旧手机号接受的验证码（通过第一步回传）
  oldVerificationCode: string;

  // 登录账号
  account: string;

  // 短信验证码
  verificationCode: string;

  /**
   * 第一步
   */
  firstStep(event) {
    this.current = 1;
    this.account = event.account;
    this.verificationCode = event.verificationCode;
  }

  /**
   * 第二步
   */
  secondStep() {
    this.current = 2;
  }

  /**
   * 跳转官网首页
   */
  toHomePage() {
    window.open('https://dxsuite.cn', '_blank');
  }
}
