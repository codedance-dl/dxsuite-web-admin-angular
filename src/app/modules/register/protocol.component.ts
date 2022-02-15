import { Component } from '@angular/core';

@Component({
  templateUrl: 'protocol.component.html',
  styleUrls: ['protocol.component.less'],
})
export class ProtocolComponent {

  /**
   * 跳转官网首页
   */
  toHomePage() {
    window.open('https://dxsuite.cn', '_blank');
  }
}
