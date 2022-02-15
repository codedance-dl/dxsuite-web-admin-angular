import { NzMessageService } from 'ng-zorro-antd/message';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserAuthService, UserService } from 'src/api';

import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CaptchaOptions, CaptchaValue, Captcha } from '@components/captcha';

@Component({
  selector: 'app-change-email-verify',
  templateUrl: 'verify.component.html',
  styleUrls: ['verify.component.less']
})
export class ChangeEmailVerifyComponent {

  // 手机号
  @Input() email: string;

  @Output() confirm = new EventEmitter<null>();

  verifyForm: FormGroup;

  verificationCodeFocus = false;

  sending = false;

  countdown = 0;

  codeText = '获取验证码';

  constructor(
    private notifier: NzMessageService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private captchaService: Captcha,
    private userService: UserService,
    private userAuthService: UserAuthService
  ) {

    this.verifyForm = this.formBuilder.group({
      verificationCode: [null, Validators.required]
    });
  }

  code() {
    this.sending = true;
    this.userService.available(this.email).subscribe(
      (res) => {
        if (!res.data) {
          const options: CaptchaOptions = {
            title: '请完成安全验证',
            credential: this.email,
            hasBackdrop: true
          };
          this.captchaService
            .open(this.elementRef, options)
            .afterClosed()
            .subscribe((value) => {
              if (value) {
                this.getVerificationAction(value);
              } else {
                this.sending = false;
              }
            });
        } else {
          this.notifier.create('error', '账号未注册');
          this.sending = false;
        }
      },
      (error) => {
        this.sending = false;
        this.notifier.create('error', error.error.message);
      }
    );
  }

  /**
   * 发送验证码
   */
  getVerificationAction(captcha: CaptchaValue) {
    const data = {
      captcha,
      key: this.email,
      keyType: 'EMAIL',
      purpose: 'UNBIND_EMAIL'
    };
    this.userAuthService.sendVerification(data).subscribe(
      () => {
        this.notifier.create('success', '已发送邮箱验证码');
        this.countdownTime(60);
      },
      (error) => {
        this.countdownTime(5);
        this.notifier.create('error', error.error.message);
      }
    );
  }

  countdownTime(countdowns: number) {
    this.countdown = countdowns;
    this.sending = false;
    this.codeText = '重新获取';
    interval(1000)
      .pipe(take(countdowns))
      .subscribe((count: number) => this.countdown = countdowns - count - 1);
  }

  /**
   * 第一步提交
   */
  submit() {
    if (!this.verifyForm.valid) {
      return;
    }
    this.userService
      .validate('EMAIL', this.email, 'UNBIND_EMAIL', this.verifyForm.value.verificationCode)
      .subscribe(
        () => {
          this.confirm.next(this.verifyForm.value.verificationCode);
        },
        (error) => {
          this.notifier.create('error', error.error.message);
        }
      );
  }
}
