import { NzMessageService } from 'ng-zorro-antd/message';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISmsConfiguration, SmsConfigurationService } from '@api';

interface IConfiguration extends Partial<ISmsConfiguration> {
  id?: string;
  revision?: string;
}

@Component({
  selector: 'app-send-configuration',
  templateUrl: './send-configuration.component.html',
  styleUrls: ['./send-configuration.component.less']
})
export class SendConfigurationComponent implements OnInit {
  loading = false;

  form: FormGroup;

  updateAccessKey = false;

  providersList: { code: string; text: string}[] = [{ code: 'ALI_YUN', text: '阿里云-短信服务' }];

  configuration: IConfiguration;

  constructor(
    private message: NzMessageService,
    private smsConfigurationService: SmsConfigurationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      provider: ['ALI_YUN', [Validators.required]],
      signName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['']
    });
   }

  ngOnInit() {
    this.init();
  }

  init() {
    this.smsConfigurationService.getConfig().subscribe(
      ({ data }) => {
        this.loading = false;
        // eslint-disable-next-line no-extra-parens
        if (!data || (data as IConfiguration[]).length === 0) {
          this.setUpdateAccessKeySates(true);
          return;
        }
        this.configuration = data[0];
        this.form.patchValue({
          signName: this.configuration.signName,
          provider: this.configuration.provider,
          username: this.configuration.username,
          password: ''
        });
        this.setUpdateAccessKeySates(false);
      },
      (error) => {
        this.loading = false;
        this.message.create('error', error.error.code === 'error.no-privilege' ? '当前用户没有编辑权限' : error.error.message);
      }
    );
  }

  setUpdateAccessKeySates(states: boolean) {
    this.updateAccessKey = states;
    if (states) {
      this.form.get('password').setValidators([Validators.required]);
      this.form.get('username').enable();
      this.form.get('password').enable();
    } else {
      this.form.get('password').setValidators([]);
      this.form.get('username').disable();
      this.form.get('password').disable();
    }

    this.form.get('password').updateValueAndValidity();
  }

  onSubmit() {
    // eslint-disable-next-line
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    const form: IConfiguration= {
      name: 'Codelet',
      signName: this.form.value.signName,
      provider: this.form.value.provider
    };

    if (this.updateAccessKey) {
      form.password = this.form.value.password;
      form.username = this.form.value.username;
    }

    if (this.configuration) {
      this.smsConfigurationService.update(this.configuration.id, this.configuration.revision, form).subscribe(
        () => {
          this.message.create('success', '编辑成功');
          this.init();
        },
        error => {
          this.loading = false;
          this.message.create('error', `${error.error.message || error.error.code || error.error.type}`);
        }
      );
    } else {
      this.smsConfigurationService
        .create(form)
        .pipe()
        .subscribe(
          () => {
            this.message.create('success', '创建成功');
            this.init();
          },
          error => {
            this.loading = false;
            this.message.create('error', `${error.error.message || error.error.code || error.error.type}`);
          }
        );
    }
  }
}
