import { Subject } from 'rxjs';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '@store/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-mobile',
  templateUrl: 'change-mobile.component.html',
  styleUrls: ['change-mobile.component.less']
})
export class ChangeMobileComponent implements OnDestroy {

  userId: string;

  // 登录认证信息
  credentials = [];

  // 手机号
  mobile: string;

  loading = false;

  steps = ['验证身份', '修改手机', '修改成功'];

  stepIndex = 1;

  verifyForm: FormGroup;

  sending = false;

  countdown = 0;

  codeText = '获取验证码';

  // 旧手机号接受的验证码（通过第一步回传）
  oldVerificationCode: string;

  private readonly destroy = new Subject();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private formBuilder: FormBuilder
  ) {

    this.verifyForm = this.formBuilder.group({
      verificationCode: [null, Validators.required]
    });

    this.userId = this.store.selectSnapshot(AuthState.getIdentity).id;
    this.credentials = this.route.snapshot.data.credentials.data.filter(item => item.type === 'MOBILE');

    if (this.credentials.length > 0) {
      this.mobile = this.credentials[0].credential;
    } else {
      this.steps = ['绑定手机', '绑定成功'];
    }
  }

  firstStep(event?: string) {
    this.oldVerificationCode = event;
    this.stepIndex++;
  }

  secondStep() {
    this.stepIndex++;
  }

  /**
   * 跳转官网首页
   */
  toHomePage() {
    window.open('https://dxsuite.cn', '_blank');
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
