import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { fadeInY } from '@libs/animate/core';
import { equalTo } from '@components/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '@api/user.service';

const MOBILE_REGEXP = /(^1[3456789]\d{9}$)/;

@Component({
  selector: 'app-reset-password-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.less'],
  animations: [
    trigger('fade', [
      transition('void => *', fadeInY({ a: 0, b: 0 }, .2))
    ])
  ]
})
export class ResetUpdateComponent implements AfterViewInit {

  @Input() account: string;

  @Input() verificationCode: string;

  @Output() confirm = new EventEmitter<null>();

  form: FormGroup;

  loading: boolean;

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
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private userService: UserService
  ) {
    const password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/)]);
    this.form = this.formBuilder.group({
      password,
      confirmPassword: ['', [Validators.required, equalTo(password, '新密码')]]
    });
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
          result => {
            this.stats = { ...result.data };
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  /**
   * 重置密码
   */
  reset() {
    if (!this.form.valid) {
      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.message.create('error', '密码两次输入不一致 ');
      return;
    }

    const body: {
      password: string;
      smsVerificationCode?: string;
      emailVerificationCode?: string;
    } = {
      password: this.form.value.password,
    };

    if ( MOBILE_REGEXP.test(this.account) ) {
      body.smsVerificationCode = this.verificationCode;
    } else {
      body.emailVerificationCode = this.verificationCode;
    }

    this.loading = true;
    this.userService.reset(this.account, body)
      .pipe(takeUntil(this.destroy))
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.confirm.next();
        } else {
          this.message.create('error', res.error.message || '重置失败');
        }
      }, error => {
        this.loading = false;
        this.message.create('error', error.error.message || '重置失败');
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

}
