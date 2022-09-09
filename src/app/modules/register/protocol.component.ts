import { Component } from '@angular/core';
import { goHome } from '@constant/function';

@Component({
  templateUrl: 'protocol.component.html',
  styleUrls: ['protocol.component.less'],
})
export class ProtocolComponent {

  /**
   * 跳转官网首页
   */
  toHomePage() {
    goHome();
  }
}
