import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProtocolComponent } from './protocol.component';

const routes: Routes = [
  { path: '', component: ProtocolComponent, data: { title: '服务协议' } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProtocolComponent]
})
export class ProtocolModule {}
