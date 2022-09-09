import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { UserAuthService } from 'src/api/user-auth.service';
import { UserService } from 'src/api/user.service';
import { ClearIdentity, SetIdentity } from 'src/app/store/auth';

import { Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { clearToken } from '@api';
import { Captcha, CaptchaOptions } from '@components/captcha';
import { Store } from '@ngxs/store';

import { ACCOUNT_REGEXP, MOBILE_REGEXP } from '@constant/regex';
import { goHome } from '@constant/function';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnDestroy {

  @ViewChild('loginBox', { static: true }) loginBox: ElementRef;

  passwordVisible = true;

  loginForm: FormGroup;

  smsLoginForm: FormGroup;

  loading = false;

  countdown = 0;

  codeText = '获取验证码';

  tabIndex = 0;

  private destroy = new Subject();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private captcha: Captcha,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private store: Store
  ) {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.smsLoginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(ACCOUNT_REGEXP)]],
      smsVerificationCode: [
        '',
        [Validators.required]
      ]
    });
  }

  ngOnInit() {
    clearToken();
  }

  selectChange(event) {
    this.tabIndex = event.index;
  }

  /**
   * 验证是否合法输入手机号
   */
  hasMobile() {
    return (
      this.smsLoginForm.value.username &&
      MOBILE_REGEXP.test(this.smsLoginForm.value.username)
    );
  }

  /**
   * 短信验证码登录
   */
  smsSubmit() {
    if (!this.smsLoginForm.valid) {
      for (const i in this.smsLoginForm.controls) {
        if (Reflect.hasOwnProperty.call(this.smsLoginForm.controls, i)) {
          this.smsLoginForm.controls[i].markAsDirty();
          this.smsLoginForm.controls[i].updateValueAndValidity();
        }
      }
      return;
    }

    const body: {
      smsVerificationCode?: string;
      emailVerificationCode?: string;
      username?: string;
    } = {
      username: this.smsLoginForm.value.username,
    };
    if (MOBILE_REGEXP.test(this.smsLoginForm.value.username)) {
      body.smsVerificationCode = this.smsLoginForm.value.smsVerificationCode;
    } else {
      body.emailVerificationCode = this.smsLoginForm.value.smsVerificationCode;
    }

    this.dispatchLoginAction(body);
  }

  setMessage() {
    if (!this.smsLoginForm.value.username) {
      return;
    }
    this.showCaptcha(this.smsLoginForm.value);
  }

  /**
   * 登录
   */
  submitForm() {
    if (!this.loginForm.valid) {
      for (const i in this.loginForm.controls) {
        if (Reflect.hasOwnProperty.call(this.smsLoginForm.controls, i)) {
          this.loginForm.controls[i].markAsDirty();
          this.loginForm.controls[i].updateValueAndValidity();
        }
      }
      return;
    }

    this.loading = true;
    this.userAuthService
      .captchaRequired({
        credential: this.loginForm.value.username
      })
      .subscribe(
        result => {
          if (result.data) {
            this.showCaptcha(this.loginForm.value);
          } else {
            this.dispatchLoginAction(this.loginForm.value);
          }
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  /**
   * 提交表单
   */
  submit() {
    if ( this.tabIndex === 0 ) {
      this.submitForm();
    } else if ( this.tabIndex === 1 ) {
      this.smsSubmit();
    }
  }

  /**
   * 弹出图形验证码验证框
   */
  showCaptcha(data) {
    const options: CaptchaOptions = {
      title: '请完成安全验证',
      credential: data.username,
      hasBackdrop: true
    };
    this.captcha
      .checkAndOpen(this.loginBox, options)
      .pipe(tap(() => this.loading = false))
      .subscribe(captchaRef => {
        if (captchaRef) {
          captchaRef.afterClosed().subscribe(captchaValue => {
            if (captchaValue) {
              if (this.tabIndex === 0) {
                this.dispatchLoginAction(data, captchaValue);
              } else if (this.tabIndex === 1) {
                this.getVerificationAction(data, captchaValue);
              }
            }
          });
        } else {
          this.dispatchLoginAction(data);
        }
      });
  }

  /**
   * 发送验证码
   */
  getVerificationAction(data, captcha) {
    this.userService.available(data.username).pipe(
      filter(({ data: available }) => {
        if (available) {
          this.message.error('账号未注册');
        }
        return !available;
      }),
      switchMap(() => this.userAuthService
        .sendVerification({
          captcha,
          key: data.username,
          keyType: MOBILE_REGEXP.test(data.username) ? 'MOBILE' : 'EMAIL',
          purpose: 'USER_SIGN_IN'
        }))
    ).subscribe(
      () => {
        this.message.success(`已发送${MOBILE_REGEXP.test(data.username) ? '短信' : '邮箱'}验证码`);
        this.countdownTime(60);
      },
      error => {
        this.message.create('error', error.error.message || error.error.code);
        this.loading = false;
        this.codeText = '重新获取';
      }
    );
  }

  /**
   * 获取图形验证码倒计时
   */
  countdownTime(countdowns: number) {
    this.countdown = countdowns;
    this.loading = false;
    this.codeText = '重新获取';
    interval(1000)
      .pipe(take(countdowns))
      .subscribe((count: number) => this.countdown = countdowns - count - 1);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  /**
   * 跳转官网首页
   */
  toHomePage() {
    goHome();
  }

  /**
   * 账号密码登录
   */
  private dispatchLoginAction(payload, captcha?) {
    this.userAuthService
      .signIn({ ...payload, captcha })
      .pipe(
        switchMap(() => this.userAuthService.getUser()),
        takeUntil(this.destroy)
      )
      .subscribe(
        result => {
          if (result) {
            this.store.dispatch(new SetIdentity(result));
            this.router.navigate(['/'], { replaceUrl: true }).then();
            this.message.create('success', '登录成功');
          } else {
            this.store.dispatch(new ClearIdentity());
          }
          this.loading = false;
        },
        error => {
          this.message.create('error', `登录失败，${error.error && error.error.message}`);
          this.store.dispatch(new ClearIdentity());
          this.loading = false;
        }
      );
  }

}
