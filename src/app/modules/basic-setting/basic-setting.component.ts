import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ParametersService } from '@api/parameters.service';

import { SetExpirationTimeModalComponent } from './set-expiration-time-modal/set-expiration-time-modal.component';

export interface ParametersModel {
  name: string;
  description?: string;
  appId?: string;
  tenant?: string;
  value: string;
  revision?: string;
}
@Component({
  selector: 'app-basic-setting',
  templateUrl: './basic-setting.component.html',
  styleUrls: ['./basic-setting.component.less']
})
export class BasicSettingComponent implements OnInit {

  loading = false;

  form: FormGroup;

  userPasswordTTLDescription = '超过过期时间后，用户再次登录时，用户需要强制密码。功能开启后注册或修改过密码的用户会受影响。';

  parametersMap: { [key: string]: ParametersModel } = {
    userPasswordTTL: {
      name: 'userPasswordTTL',
      value: ''
    }
  };

  switchControl: FormControl;

  constructor(
    private parametersService: ParametersService,
    private modal: NzModalService,
    private nzMessageService: NzMessageService,
    private fb: FormBuilder
  ) {
    // 初始化form
    this.form = this.fb.group({
      switchControl: []
    });

    // 监听开关数据变化
    this.form.get('switchControl').valueChanges.subscribe(res => {
      if (res) {
        // 关闭
        this.parametersService.setParameter('userPasswordTTL', {
          description: this.parametersMap.userPasswordTTL.description || this.userPasswordTTLDescription,
          value: (180 * 24 * 60 * 60).toFixed().toString()
        }, this.parametersMap.userPasswordTTL.revision || '').subscribe(() => {
          this.loading = false;
          this.nzMessageService.success('开启成功');
          this.init();
        }, error => { this.nzMessageService.error(error.error.message || error.error.code); this.loading = false; });
      } else {
        // 开启
        this.parametersMap.userPasswordTTL.value = '';
        this.parametersService.deleteParameter('userPasswordTTL', this.parametersMap.userPasswordTTL.revision || '').subscribe(() => {
          this.loading = false;
          this.nzMessageService.success('关闭成功');
          this.init();
        }, error => { this.nzMessageService.error(error.error.message || error.error.code); this.loading = false; });
      }
    });
   }

  ngOnInit() {
    this.init();
  }

  init() {

    this.loading = true;

    this.parametersService.getAllParameters().subscribe(({ data }) => {
      for (const key in this.parametersMap) {
        if (this.parametersMap.hasOwnProperty(key)) {
          const temp = data.find(item => item.name === key);
          this.parametersMap[key] = temp ? temp : this.parametersMap[key];
          if (key === 'userPasswordTTL') {
            const value = this.parametersMap[key].value;
            this.parametersMap[key].value = value ? (Number(value) / 60 / 60 / 24).toFixed().toString() : value;
          }
        }
      }
      this.form.patchValue({
        switchControl: !!this.parametersMap.userPasswordTTL.value
      }, { emitEvent: false});

      this.loading = false;
    }, () => this.loading = false);
  }


  setUserPasswordTTL(value: string) {
    this.modal.create({
      nzTitle: '修改密码过期时间',
      nzContent: SetExpirationTimeModalComponent,
      nzFooter: null,
      nzWidth: 400,
      nzComponentParams: {
        data: {
          value
        }
      }
    }).afterClose.subscribe((res: { value: string | null }) => {
      if (!res?.value) {
        return;
      }
      this.loading = true;
      this.parametersService.setParameter('userPasswordTTL', {
        description: this.parametersMap.userPasswordTTL.description || this.userPasswordTTLDescription,
        value: (Number(res.value) * 24 * 60 * 60).toFixed().toString()
      }, this.parametersMap.userPasswordTTL.revision || '').subscribe(() => {
        this.loading = false;
        this.nzMessageService.success('设置成功');
        this.init();
      }, error => { this.nzMessageService.error(error.error.message || error.error.code); this.loading = false; });
    });
  }
}
