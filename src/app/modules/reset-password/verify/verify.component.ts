import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { UserAuthService } from 'src/api/user-auth.service';
import { UserService } from 'src/api/user.service';

import { transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CaptchaOptions, CaptchaValue, Captcha } from '@components/captcha';
import { fadeInY } from '@libs/animate/core';

import { ACCOUNT_REGEXP, MOBILE_REGEXP } from '@constant/regex';

@Component({
  selector: 'app-reset-password-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.less'],
  animations: [
    trigger('fade', [
      transition('void => *', fadeInY({ a: 0, b: 0 }, 0.2))
    ])
  ]
})
export class ResetVerifyComponent {

  @Output() confirm = new EventEmitter<unknown>();



  form: FormGroup;

  countdown = 0;

  codeText = '获取验证码';

  sending = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private captchaService: Captcha,
    private userService: UserService,
    private userAuthService: UserAuthService,
    private message: NzMessageService
  ) {
    this.form = this.formBuilder.group({
      account: [null, [Validators.required, Validators.pattern(ACCOUNT_REGEXP)]],
      verificationCode: [null, Validators.required]
    });
  }

  setMessage() {
    const account = this.form.get('account');
    if (!account.valid) {
      this.form.get('account').setErrors({ required: true });
      return;
    }
    this.sending = true;
    let captchaValueData;

    const options: CaptchaOptions = {
      title: '请完成安全验证',
      credential: account.value,
      hasBackdrop: true
    };

    this.captchaService.checkAndOpen(this.elementRef, options).pipe(
      switchMap(captchaRef => captchaRef.afterClosed()),
      switchMap((captchaValue) => {
        if (captchaValue) {
          captchaValueData = captchaValue;
          return this.userService.available(this.form.value.account);
        } else {
          return of(null);
        }
      })
    ).subscribe(
      (available) => {

        this.sending = false;

        if (!available) {
          return;
        }

        if (available.data) {
          this.message.error('账号未注册');
          return;
        }

        this.getVerificationAction(captchaValueData);
      },
      (error) => {
        this.message.error(this.form.value.account ? error.message : '账号信息不存在');
        this.sending = false;
      });
  }

  // /**
  //  * 发送短信验证码
  //  */
  // code() {
  //   const account = this.form.get('account');
  //   if (!account.valid) {
  //     this.form.get('account').setErrors({ required: true });
  //     return;
  //   }
  //   this.sending = true;
  //   this.userService.available(encodeURIComponent(account.value)).subscribe(
  //     (res) => {
  //
  //       const options: CaptchaOptions = {
  //         title: '请完成安全验证',
  //         credential: account.value,
  //         hasBackdrop: true
  //       };
  //
  //       this.captchaService
  //         .checkAndOpen(this.elementRef, options)
  //         .subscribe(captchaRef => {
  //           if (captchaRef) {
  //             captchaRef.afterClosed().subscribe(value => {
  //               console.log('res.data: ', res.data);
  //               if (!res.data) {
  //                 this.message.create('error', '账号未注册');
  //                 this.sending = false;
  //               } else {
  //                 if (value) {
  //                   this.getVerificationAction(value);
  //                 } else {
  //                   this.sending = false;
  //                 }
  //               }
  //
  //             });
  //           }
  //         });
  //     },
  //     error => {
  //       this.sending = false;
  //       this.message.create('error', error.message  || error.error.message);
  //     }
  //   );
  // }

  countdownTime(countdowns: number) {
    this.countdown = countdowns;
    this.sending = false;
    this.codeText = '重新获取';
    interval(1000)
      .pipe(take(countdowns))
      // eslint-disable-next-line no-extra-parens
      .subscribe((count: number) => (this.countdown = countdowns - count - 1));
  }

  /**
   * 下一步
   */
  next() {
    if (!this.form.valid) {
      return;
    }
    this.userService
      .validate(MOBILE_REGEXP.test(this.form.value.account) ? 'MOBILE' : 'EMAIL', this.form.value.account, 'RESET_PASSWORD', this.form.value.verificationCode)
      .subscribe(
        () => {
          this.confirm.next({
            account: this.form.value.account,
            verificationCode: this.form.value.verificationCode
          });
        },
        (error) => {
          this.message.create('error', error.error.message);
        }
      );
  }

  /**
   * 发送验证码
   */
  private getVerificationAction(captcha: CaptchaValue) {
    const account = this.form.get('account');
    const data = {
      captcha,
      key: account.value,
      purpose: 'RESET_PASSWORD'
    };
    this.userAuthService.sendVerification(data).subscribe(
      () => {
        this.message.create('success', '已发送' + (MOBILE_REGEXP.test(account.value) ? '短信' : '邮件') + '验证码');
        this.countdownTime(60);
      },
      (error) => {
        this.countdownTime(5);
        this.message.create('error', error.message  || error.error.message);
      }
    );
  }
}
