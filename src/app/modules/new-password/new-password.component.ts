import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametersService, UserService } from '@api';
import { equalTo, unequalTo } from '@components/forms';
import { passwordIsValid } from '@constant/function';
import { fadeInY } from '@libs/animate/core';
import { Store } from '@ngxs/store';
import { AuthState, ClearIdentity } from '@store/auth';

@Component({
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.less'],
  animations: [trigger('fade', [transition('void => *', fadeInY({ a: 0, b: 0 }, 0.2))])]
})
export class NewPasswordComponent implements OnInit, AfterViewInit {

  user = this.store.selectSnapshot(AuthState.getIdentity);

  // 密码是否过期
  expired: boolean;

  // 密码是否为初始密码
  initial: boolean;

  // 画面描述文言
  description: string;

  // 是否显示密码有效时长
  showPasswordTTL: boolean;

  // 密码有效时长（分钟）
  passwordTTLValue: number;

  oldPasswordType: 'password' | 'text' = 'password';

  newPasswordType: 'password' | 'text' = 'password';

  passwordConfirmType: 'password' | 'text' = 'password';

  passwordTypeMap = {
    password: 'eye-invisible',
    text: 'eye'
  };

  loading = false;
  // 新增
  oldFocus = false;
  newFocus = false;
  confirmFocus = false;

  form: FormGroup;

  stats = {
    upperCaseCharCount: 0,
    lowerCaseCharCount: 0,
    numberCount: 0,
    symbolCount: 0,
    strengthLevel: 0
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
    private router: Router,
    private userService: UserService,
    private parametersService: ParametersService,
    private store: Store,
    private message: NzMessageService
  ) {

    const oldPassword = new FormControl('', [Validators.required]);
    const password = new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/),
      unequalTo(oldPassword, '当前密码')
    ]);
    this.form = this.formBuilder.group({
      oldPassword,
      password,
      confirmPassword: ['', [Validators.required, equalTo(password, '新密码')]]
    });
    this.expired = this.user.passwordStatus.expired;
    this.initial = this.user.passwordStatus.initial;

    // 密码已过期
    if (this.expired) {
      this.description = '密码已过期，请设置新密码\n新密码设置成功后，你将回到登录画面';
    }

    // 密码为初始密码
    if (this.initial) {
      this.description = '初次登录，请设置新密码\n新密码设置成功后，你将回到登录画面';
    }
  }

  ngOnInit() {

    // 获取密码有效期
    this.getPasswordTTl();
  }

  /**
   * 更改密码显示方式（密文/明文）
   * @param value
   */
  changePasswordType(value: string) {
    if (this[value] === 'password') {
      this[value] = 'text';
    } else {
      this[value] = 'password';
    }
  }

  /**
   * 获取密码有效期
   */
  getPasswordTTl() {
    this.parametersService.getParameter('userPasswordTTL').subscribe(
      (response) => {
        if (response.success) {
          this.showPasswordTTL = true;
          this.passwordTTLValue = response.data.value;
        } else {
          this.showPasswordTTL = false;
        }
      },
      () => {
        this.showPasswordTTL = false;
      }
    );
  }

  setNewPassword() {

    if (!this.form.valid) {
      return;
    }

    const body = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.password
    };

    if (passwordIsValid(this.stats)) {
      this.loading = true;
      this.userService.updatePassword(this.user.id, body)
        .subscribe((res: {
          success: boolean;
          error?: {
            code: string;
            message: string;
          };
          included: unknown;
        }) => {
          if (res.success) {
            // 账号过期
            this.message.create('success', '密码修改成功，请重新登录');
            this.store.dispatch(new ClearIdentity());
          } else {
            this.message.create('error', res.error.message || res.error.code);
          }
          this.loading = false;
        }, error => {
          this.loading = false;
          this.message.create('error', error.error.message);
        });
    } else {
      this.message.create('error', '密码不符合格式');
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

  /**
   * 跳转官网首页
   */
  toHomePage() {
    window.open('https://dxsuite.cn', '_blank');
  }

}
