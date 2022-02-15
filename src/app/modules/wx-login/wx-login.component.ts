import '@assets/wx-login.js';



import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare var WxLogin: any;
@Component({
  selector: 'mz-wx',
  templateUrl: './wx-login.component.html',
  styleUrls: ['./wx-login.component.less']
})

export class WxLoginComponent implements OnInit, OnDestroy {
  qrCode = null;
  invalidAccount = false;
  loading = false;

  ngOnInit() {
    this.getQRCode();
  }

  getQRCode() {
    this.qrCode = new WxLogin({
      self_redirect: false,
      id: 'code_container',
      appid: environment.appId,
      scope: 'snsapi_login',
      redirect_uri: `${environment.website}%23%2fwx-login`,
      state: '',
      style: '',
      href: ''
    });
  }

  ngOnDestroy() {
    this.qrCode = null;
  }

  /**
   * 跳转官网首页
   */
  toHomePage() {
    window.open('https://dxsuite.cn', '_blank');
  }
}
