import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, of, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { UserAuthService } from 'src/api/user-auth.service';
import { UserService } from 'src/api/user.service';
import { CaptchaOptions, Captcha } from 'src/app/components/captcha';
import { fadeIn, fadeOut } from 'src/libs/animate/core/animate';

import { transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

const MOBILE_REGEXP = /(^1[3456789]\d{9}$)/;
const ACCOUNT_REGEXP = /^(1[0-9]{10,10})|([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+)$/;

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.less'],
  animations: [
    trigger('fade', [
      transition('* => void', fadeOut(0.3)),
      transition('void => *', fadeIn(0.3)),
    ]),
  ],
})
export class RegisterComponent implements OnDestroy, AfterViewInit {

  @ViewChild('registerBox', { static: true }) registerBox: ElementRef;
  @ViewChild('mobile', { static: false }) mobile: ElementRef;
  @ViewChild('password', { static: false }) password: ElementRef;
  @ViewChild('smsVerificationCode', { static: false })
  smsVerificationCode: ElementRef;

  form: FormGroup;

  loadingCaptcha= false;

  loading = false;

  passwordType: 'password' | 'text' = 'password';
  passwordTypeMap = {
    password: 'eye-invisible',
    text: 'eye'
  };

  countdown = 0;
  codeText = '获取验证码';

  stats = {
    upperCaseCharCount: 0,
    lowerCaseCharCount: 0,
    numberCount: 0,
    symbolCount: 0,
    strengthLevel: 0,
  };

  strengthLevels = [
    { text: '低', level: 0, class: 'error', color: '#ff0001', percent: 30 },
    { text: '低', level: 1, class: 'error', color: '#ff0001', percent: 30 },
    { text: '中', level: 2, class: 'warning', color: '#ff7e05', percent: 70 },
    { text: '高', level: 3, class: 'success', color: '#52c41a', percent: 100 },
    { text: '高', level: 4, class: 'success', color: '#52c41a', percent: 100 }
  ];

  private destroy = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private captcha: Captcha,
    private notifier: NzMessageService,
    private userAuthService: UserAuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      account: ['', [Validators.required, Validators.pattern(ACCOUNT_REGEXP)]],
      verificationCode: [
        '',
        [Validators.required],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/),
        ],
      ],
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
    this.destroy = null;
  }

  evaluatePassword() {
    if (this.form.get('password').value) {
      this.userService
        .evaluatePassword(this.form.get('password').value)
        .pipe(takeUntil(this.destroy))
        .subscribe(
          (result) => {
            this.stats = { ...result.data };
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  ngAfterViewInit() {
    this.form.get('password').valueChanges.subscribe(() => {
      if (this.form.get('password').value) {
        this.evaluatePassword();
      } else {
        this.stats = {
          upperCaseCharCount: 0,
          lowerCaseCharCount: 0,
          numberCount: 0,
          symbolCount: 0,
          strengthLevel: 0,
        };
      }
    });
  }

  getStrengthLength() {
    const strength = this.strengthLevels.find(
      (levelItem) => levelItem.level === this.stats.strengthLevel
    );
    if (strength.level === 0 && !this.form.get('password').value) {
      return { ...strength, text: '', percent: 0 };
    } else {
      return strength;
    }
  }

  submit() {
    for (const key of Object.keys(this.form.controls)) {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    }

    if (this.form.valid) {
      this.loading = true;
      const body: {
        password: string;
        name: string;
        mobile?: string;
        email?: string;
        smsVerificationCode?: string;
        emailVerificationCode?: string;
        username?: string;
      } = {
        password: this.form.value.password,
        name: this.form.value.account
      };

      if (MOBILE_REGEXP.test(this.form.value.account)) {
        body.mobile = this.form.value.account;
        body.smsVerificationCode = this.form.value.verificationCode;
      } else {
        body.email = this.form.value.account;
        body.emailVerificationCode = this.form.value.verificationCode;
      }

      this.userService.register(body).subscribe(
        (data) => {
          this.loading = false;
          this.notifier.success('注册成功');
          this.router.navigate(['/', 'dashboard']);
        },
        (error) => {
          this.loading = false;
          this.notifier.error(`注册失败，${error && error.error && error.error.message}`);
        });
    }
  }

  changePasswordType() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }

  /**
   * 1、获取图形验证码
   * 2、验证账号是否已注册
   * @param data
   */
  showCaptcha(data) {
    this.loadingCaptcha = true;
    const options: CaptchaOptions = {
      title: '请完成安全验证',
      credential: data.account,
      hasBackdrop: true,
    };

    let captchaValueData;

    this.userAuthService.getCaptcha({ credential: options.credential }).pipe(
      // eslint-disable-next-line no-extra-parens
      map(({ data: captchaData }) => this.captcha.open(this.registerBox, options, captchaData)),
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

        this.loadingCaptcha = false;

        if (!available) {
          return;
        }

        if (!available.data) {
          this.notifier.error('账号已注册');
          return;
        }

        this.getVerificationAction(this.form.value, captchaValueData);
      },
      (error) => {
        this.notifier.error(this.form.value.account ? error.message : '账号信息不存在');
        this.loadingCaptcha = false;
      });
  }

  /**
   * 获取短信/邮箱验证码
   */
  setMessage() {
    this.form.controls.account.markAsDirty();
    this.form.controls.account.updateValueAndValidity();
    if (this.form.controls.account.invalid) {
      return;
    }
    this.showCaptcha(this.form.value);
  }

  // 发送验证码
  getVerificationAction(data: {
    account: string;
    password: string;
    verificationCode: string;
  }, captcha: {
    encryptedData: string;
    text: string;
  }) {
    this.userAuthService.sendVerification({
      captcha,
      key: data.account,
      keyType: MOBILE_REGEXP.test(data.account) ? 'MOBILE' : 'EMAIL',
      purpose: 'USER_SIGN_UP',
    }).pipe(takeUntil(this.destroy))
      .subscribe(
        (res) => {
          const countdown = Math.ceil((res.data - new Date().getTime())/1000);
          this.notifier.success(`已发送${MOBILE_REGEXP.test(data.account) ? '短信' : '邮箱'}验证码`);
          this.countdownTime(countdown);
        },
        (error) => {
          this.notifier.error(error.error.message || error.error.code);
          const countdown = Math.ceil((error.data - new Date().getTime())/1000);
          this.countdownTime(countdown);
        }
      );
  }

  countdownTime(countdowns: number) {
    this.countdown = countdowns;
    this.loading = false;
    this.codeText = '重新获取';
    interval(1000)
      .pipe(take(countdowns))
      .subscribe((count: number) => this.countdown = countdowns - count - 1);
  }

  /**
   * 跳转官网首页
   */
  toHomePage() {
    window.open('https://dxsuite.cn', '_blank');
  }
}
