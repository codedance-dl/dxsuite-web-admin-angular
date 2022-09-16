import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, of, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Captcha, CaptchaOptions } from '@components/captcha';
import { Store } from '@ngxs/store';
import { SetIdentity } from '@store/auth';
import { environment } from '@environments/environment';
import { goHome } from '@constant/function';
import { InviteService } from './invite.service';

import { MOBILE_REGEXP } from '@constant/regex';

const { eyeInvisible, eye, pw, text } = environment;

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.less']
})
export class InviteComponent implements OnInit, AfterViewInit {

  @ViewChild('inviteBox', { static: true }) inviteBox: ElementRef;
  verificationCode: ElementRef;

  invitationId = '';
  invitationCode = '';
  invitationDetails;

  loading = false;
  invitation = null;

  focusMap = {
    account: true,
    verificationCode: false,
    password: false
  };

  passwordType = pw;
  passwordTypeMap = {
    password: eyeInvisible,
    text: eye
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

  form: FormGroup;

  loadingCaptcha = false;
  approved = false;

  private destroy = new Subject();
  constructor(
    private fb: FormBuilder,
    private captcha: Captcha,
    private route: ActivatedRoute,
    private notifier: NzMessageService,
    private router: Router,
    private store: Store,
    private inviteService: InviteService,
  ) {

    this.invitationCode = this.route.snapshot.queryParams.code;
    sessionStorage.setItem('invitationCode', this.invitationCode);
    this.invitationId = this.route.snapshot.queryParams.id;
    sessionStorage.setItem('invitationId', this.invitationId);

    this.form = this.fb.group({
      account: [{ value: null, disabled: true }, [Validators.required]],
      verificationCode: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.inviteService.employee.getInvitation(this.invitationId, this.invitationCode).subscribe(({ data }) => {
      this.invitationDetails = data;
      this.form.patchValue({
        account: data.email || data.mobile
      });
    }, (error) => {
      if (error.error.status === 400) {
        this.approved = true;
      }
    });
  }

  /**
   * 密码强度评估
   */
  evaluatePassword() {
    if (this.form.get('password').value) {
      this.inviteService.user
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

  showCaptcha() {
    this.loadingCaptcha = true;
    const account = this.form.get('account').value;
    const options: CaptchaOptions = {
      title: '请完成安全验证',
      credential: account,
      hasBackdrop: true,
    };

    let captchaValueData;

    this.inviteService.userAuth.getCaptcha({ credential: options.credential }).pipe(
      // eslint-disable-next-line no-extra-parens
      map(({ data: captchaData }) => this.captcha.open(this.inviteBox, options, captchaData)),
      switchMap(captchaRef => captchaRef.afterClosed()),
      switchMap((captchaValue) => {
        if (captchaValue) {
          captchaValueData = captchaValue;
          return this.inviteService.user.available(this.form.get('account').value);
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

        this.getVerificationAction(captchaValueData);
      },
      (error) => {
        this.notifier.error(this.form.value.account ? error.message : '账号信息不存在');
        this.loadingCaptcha = false;
      });
  }

  // 发送验证码
  getVerificationAction(captcha: {
    encryptedData: string;
    text: string;
  }) {
    const account = this.form.get('account').value;
    this.inviteService.userAuth.sendVerification({
      captcha,
      key: account,
      keyType: MOBILE_REGEXP.test(account) ? 'MOBILE' : 'EMAIL',
      purpose: 'USER_SIGN_UP',
    }).pipe(takeUntil(this.destroy))
      .subscribe(
        (res) => {
          const countdown = Math.ceil((res.data - new Date().getTime()) / 1000);
          this.countdownTime(countdown);
        },
        (error) => {
          this.notifier.error(error.error.message || error.error.code);
          this.loading = false;
          const countdown = Math.ceil((error.data - new Date().getTime()) / 1000);
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

  changePasswordType() {
    this.passwordType = this.passwordType === pw ? text : pw;
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
        name: this.invitationDetails.name
      };
      const account = this.form.get('account').value;
      if (MOBILE_REGEXP.test(account)) {
        body.mobile = account;
        body.smsVerificationCode = this.form.value.verificationCode;
      } else {
        body.email = account;
        body.emailVerificationCode = this.form.value.verificationCode;
      }


      this.inviteService.user.register(body)
        .pipe(
          switchMap(() => this.inviteService.userAuth.signIn({
            username: account,
            password: this.form.value.password
          })),
          switchMap(() => this.inviteService.employee.accept(this.invitationDetails.tenant.id, this.invitationId, this.invitationCode)),
          switchMap(() => this.inviteService.userAuth.getUser()),
          switchMap((data) => this.store.dispatch(new SetIdentity(data)))
        )
        .subscribe(
          () => {
            sessionStorage.clear();
            this.loading = false;
            this.notifier.success('注册成功');
            this.router.navigate(['/', 'dashboard']);
          },
          error => {
            this.loading = false;
            this.notifier.error(error.message || error.error.message);
          }
        );
    }
  }

  /**
   * 跳转官网首页
   */
  toHomePage = goHome;
}
