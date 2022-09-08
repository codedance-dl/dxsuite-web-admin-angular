import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ParametersService, UserService } from 'src/api';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@api/models';
import { equalTo, unequalTo } from '@components/forms';
import { Select, Store } from '@ngxs/store';
import { AuthState, ClearIdentity } from '@store/auth';
import { environment } from '@environments/environment';

const { eyeInvisible, eye, pw, text } = environment;

@Component({
  selector: 'app-user-password',
  templateUrl: 'password.component.html',
  styleUrls: ['password.component.less'],
})
export class UserPasswordComponent implements OnInit, OnDestroy {

  @Select(AuthState.getIdentity) getIdentity$: Observable<User | null>;
  form: FormGroup;
  disabled = false;
  userId: string;

  // 是否显示密码有效时长
  showPasswordTTL: boolean;

  // 密码有效时长（分钟）
  passwordTTLValue: number;

  oldPasswordType = pw;
  newPasswordType = pw;
  passwordConfirmType = pw;
  passwordTypeMap = {
    password: eyeInvisible,
    text: eye
  };

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

  private readonly destroy = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private store: Store,
    private userService: UserService,
    private parametersService: ParametersService
  ) {
    const oldPassword = new FormControl('', [Validators.required]);
    const newPassword = new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/),
      unequalTo(oldPassword, '当前密码')
    ]);

    this.form = this.formBuilder.group({
      oldPassword,
      newPassword,
      passwordConfirm: ['', [Validators.required, equalTo(newPassword, '新密码')]]
    });

    this.getIdentity$.pipe(takeUntil(this.destroy)).subscribe((user: User) => {
      this.userId = (user || {}).id;
    });

  }

  ngOnInit() {
    // 获取密码有效期
    this.getPasswordTTl();

    this.form.get('newPassword').valueChanges.subscribe(() => {
      if (this.form.get('newPassword').value) {
        this.evaluatePassword();
      } else {
        this.stats = {
          upperCaseCharCount: 0,
          lowerCaseCharCount: 0,
          numberCount: 0,
          symbolCount: 0,
          strengthLevel: 0
        };
      }
    });
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  evaluatePassword() {
    if (this.form.get('newPassword').value) {
      this.userService.evaluatePassword(this.form.get('newPassword').value).subscribe(result => {
        this.stats = { ...result.data };
      });
    }
  }

  getStrengthLength() {
    const strength = this.strengthLevels.find(
      (levelItem) => levelItem.level === this.stats.strengthLevel
    );
    if (strength.level === 0 && !this.form.get('oldPassword').value) {
      return { ...strength, text: '', percent: 0 };
    } else {
      return strength;
    }
  }

  /**
   * 更改密码显示方式（密文/明文）
   * @param value
   */
  changePasswordType(value: string) {
    this[value] = this[value] === pw ? text : pw;
  }

  passwordIsValid() {
    return this.stats.symbolCount
      + this.stats.numberCount
      + this.stats.upperCaseCharCount
      + this.stats.lowerCaseCharCount
      >= 8
      && this.stats.upperCaseCharCount > 0
      && this.stats.lowerCaseCharCount > 0;
  }

  onSubmit() {
    // eslint-disable-next-line
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (!this.form.valid) {
      return;
    }

    const body = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword
    };

    if (this.passwordIsValid()) {
      this.disabled = true;
      this.userService.updatePassword(this.userId, body)
        .subscribe((res: {
          success: boolean;
          error?: {
            code: string;
            message: string;
          };
          included: unknown;
        }) => {
          if (res.success) {
            this.disabled = false;
            this.message.create('success', '密码修改成功，请重新登录');
            this.store.dispatch(new ClearIdentity());
          } else {
            this.disabled = false;
            this.message.create('error', res.error.message || res.error.code);
          }
        }, error => {
          this.disabled = false;
          this.message.create('error', error.error.message);
        });
    } else {
      this.message.create('error', '密码不符合格式');
    }
  }
}
