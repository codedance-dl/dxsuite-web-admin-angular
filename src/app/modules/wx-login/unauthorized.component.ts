import { Component } from '@angular/core';

@Component({
  selector: 'mz-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./wx-login.component.less']
})
export class UnauthorizedComponent {

  /**
   * 跳转官网首页
   */
  toHomePage() {
    window.open('https://dxsuite.cn', '_blank');
  }
}
