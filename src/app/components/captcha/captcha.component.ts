import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserAuthService } from 'src/api/user-auth.service';

import { AnimationEvent, transition, trigger } from '@angular/animations';
import { fadeInY, fadeOutY } from '@libs/animate/core';
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataServiceError, DataServiceResult } from '@api/models';
import { IInitalCaptcha } from './captcha';
import { NzMessageService } from 'ng-zorro-antd/message';

export interface CaptchaOptions {
  title: string;
  credential?: string;
  hasBackdrop?: boolean;
}

export interface CaptchaValue {
  text: string;
  encryptedData: string;
}

export const INITIAL_CAPTCHA = new InjectionToken('initial-captcha');

@Component({
  selector: 'app-captcha',
  templateUrl: 'captcha.component.html',
  styleUrls: ['captcha.component.less', 'overlay.less'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [
      transition('void => *', fadeInY({ a: '-10%', b: 0 }, .2)),
      transition('* => exit', fadeOutY({ a: 0, b: '-10%' }, .2))
    ])
  ],
  host: {
    class: 'captcha-overlay',
    '[@fade]': 'state',
    '(@fade.start)': 'onAnimationStart($event)',
    '(@fade.done)': 'onAnimationDone($event)',
  }
})
export class CaptchaComponent implements OnInit {

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, id-blacklist, id-match
  _options: CaptchaOptions;

  set options(value: CaptchaOptions) {
    this._options = value;
  }

  // eslint-disable-next-line
  get options() { return this._options; }

  state: 'void' | 'enter' | 'exit' = 'enter';

  formGroup: FormGroup = this.formBuilder.group({
    text: ['', Validators.required],
    encryptedData: ['']
  });

  captchaData: string;

  animationStateChanged = new EventEmitter<AnimationEvent>();

  captchaValue = new EventEmitter<CaptchaValue>();

  captchaVerifyError = new EventEmitter<DataServiceError>();

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private message: NzMessageService,
    @Optional() @Inject(INITIAL_CAPTCHA) private initialCaptcha: IInitalCaptcha
  ) { }

  ngOnInit() {
    /** 当有初始化验证码数据时不请求 */
    if (this.initialCaptcha) {
      this._setCaptchaData(this.initialCaptcha);
    } else {
      this.refreshCaptcha();
    }
  }

  onAnimationDone(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  onAnimationStart(event: AnimationEvent) {
    this.animationStateChanged.emit(event);
  }

  exit() {
    this.state = 'exit';
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.loading = true;
      this.userAuthService.validateCaptcha(this.formGroup.value).subscribe((result: DataServiceResult) => {
        this.loading = false;
        if (result.success) {
          this.captchaValue.next(this.formGroup.value);
        } else {
          this.message.create('error', result.error.message);
          this.captchaVerifyError.emit(result.error);
          this.refreshCaptcha();
        }
      }, error => {
        this.loading = false;
        if ( error.error.code === 'error.captcha.incorrect' ) {
          this.message.create('error', '图形验证码输入不正确，请重新输入');
        } else {
          this.message.create('error', error.error.message);
        }
        this.captchaVerifyError.emit(error);
        this.refreshCaptcha();
      });
    }
  }

  refreshCaptcha() {
    this.userAuthService.getCaptcha()
      .pipe(
        map(result => result.data),
        catchError(() => of(null))
      )
      .subscribe(captcha => this._setCaptchaData(captcha));
  }

  private _setCaptchaData(data?: { encryptedData: string; imageData: string }) {
    if (data) {
      this.formGroup.get('encryptedData').setValue(data.encryptedData);
      this.captchaData = data.imageData;
    } else {
      this.captchaData = null;
      this.formGroup.get('encryptedData').setValue('');
    }
  }
}
