import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterSettingComponent } from './parameter-setting.component';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  imports: [
    CommonModule,
    NzMenuModule,
    NzIconModule,
    RouterModule.forChild([
      {
        path: '',
        component: ParameterSettingComponent,
        children: [
          {
            path: '',
            redirectTo: 'basic-setting',
            pathMatch: 'full'
          },
          {
            path: 'basic-setting',
            loadChildren: () =>
              import('../basic-setting/basic-setting.module').then(mod => mod.BasicSettingModule)
          },
          {
            path: 'sm-send-configuration',
            loadChildren: () =>
              import('../send-configuration/send-configuration.module').then(mod => mod.SendConfigurationModule)
          },
          {
            path: 'email-send-configuration',
            loadChildren: () =>
              import('../email-send-configuration/email-send-configuration.module').then(mod => mod.EmailSendConfigurationModule)
          }
        ]
      }
    ])
  ],
  declarations: [ParameterSettingComponent]
})
export class ParameterSettingModule { }
