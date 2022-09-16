import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, of, throwError } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { UserAuthService, UserService } from 'src/api';

import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Captcha, CaptchaOptions, CaptchaValue } from '@components/captcha';

import { MOBILE_REGEXP } from '@constant/regex';

@Component({
  selector: 'app-change-mobile-update',
  templateUrl: 'update.component.html',
  styleUrls: ['update.component.less']
})
export class ChangeMobileUpdateComponent {

  // 手机号
  @Input() mobile: string;

  // 用户ID
  @Input() userId: string;

  // 旧手机号验证码
  @Input() oldVerificationCode: string;

  @Output() confirm = new EventEmitter<null>();

  mobileFocus = false;

  updateForm: FormGroup;

  verificationCodeFocus = false;

  sending = false;

  countdown = 0;

  codeText = '获取验证码';

  constructor(
    private notifier: NzMessageService,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private captchaService: Captcha,
    private userService: UserService,
    private userAuthService: UserAuthService
  ) {

    this.updateForm = this.formBuilder.group({
      account: [null, Validators.required],
      verificationCode: [null, Validators.required]
    });
  }

  code() {
    this.updateForm.controls.account.markAsDirty();
    this.updateForm.controls.account.updateValueAndValidity();
    if (this.updateForm.controls.account.invalid) {
      return;
    }

    this.sending = true;
    const options: CaptchaOptions = {
      title: '请完成安全验证',
      credential: this.updateForm.get('account').value,
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
  }

  /**
   * 发送验证码
   */
  getVerificationAction(captcha: CaptchaValue) {

    this.userService.available(this.updateForm.get('account').value).pipe(
      filter(({ data: available }) => {
        if (!available) {
          this.notifier.error('账号已注册');
        }
        return available;
      }),
      switchMap(() => this.userAuthService
        .sendVerification({
          captcha,
          key: this.updateForm.get('account').value,
          keyType: 'MOBILE',
          purpose: 'BIND_MOBILE'
        }))
    ).subscribe(
      () => {
        this.notifier.create('success', '已发送短信验证码');
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

  hasMobile() {
    return this.updateForm.value.account && MOBILE_REGEXP.test(this.updateForm.value.account);
  }

  /**
   * 第二步提交
   */
  submit() {
    if (!this.updateForm.valid) {
      return;
    }

    this.userService
      .validate('MOBILE', this.updateForm.value.account, 'BIND_MOBILE', this.updateForm.value.verificationCode)
      .pipe(
        switchMap(() => this.userService.mobiles(this.userId, {
          mobile: this.updateForm.value.account,
          smsVerificationCode: this.updateForm.value.verificationCode
        })),
        switchMap(response => {
          if (this.oldVerificationCode) {
            if (response.success) {
              return this.userService.deleteMobile(this.userId, {
                mobile: this.mobile,
                smsVerificationCode: this.oldVerificationCode
              });
            } else {
              return throwError({
                error: {
                  message: '修改手机失败'
                }
              });
            }
          } else {
            return of(response);
          }
        })
      ).subscribe(
      (response) => {
        if (response.success) {
          this.confirm.next();
        }
      },
      error => {
        this.notifier.create('error', error.message || error.error.message);
      }
    );
  }
}
