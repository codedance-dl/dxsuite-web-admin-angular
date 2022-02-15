import { NzMessageService } from 'ng-zorro-antd/message';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMailConfiguration, MailConfigurationService } from '@api';

@Component({
  selector: 'app-email-send-configuration',
  templateUrl: './email-send-configuration.component.html',
  styleUrls: ['./email-send-configuration.component.less']
})
export class EmailSendConfigurationComponent implements OnInit {
  loading = false;

  form: FormGroup;

  updateAccessKey = false;

  protocols = ['smtp', 'imap', 'pop3'];

  configuration: Partial<IMailConfiguration>;

  constructor(
    private message: NzMessageService,
    private mailConfigurationService: MailConfigurationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      connectionTimeout: ['', [Validators.required, Validators.min(1)]],
      host: ['', [Validators.required]],
      password: ['', [Validators.required]],
      port: ['', [Validators.required, Validators.min(1), Validators.max(65535)]],
      protocol: ['', [Validators.required]],
      readTimeout: ['', [Validators.required, Validators.min(1)]],
      senderName: ['', [Validators.required]],
      startTlsEnabled: [true, [Validators.required]],
      startTlsRequired: [true, [Validators.required]],
      username: ['', [Validators.required]],
      writeTimeout: ['', [Validators.required, Validators.min(1)]]
    });
   }

  ngOnInit() {
    this.init();
  }

  init() {
    this.mailConfigurationService.getConfig().subscribe(
      ({ data }) => {
        this.loading = false;
        this.configuration = data[0] || {};
        if (!this.configuration.id) {
          this.setUpdateAccessKeySates(true);
          return;
        }
        this.form.patchValue({
          name: this.configuration.name,
          host: this.configuration.host,
          port: this.configuration.port,
          protocol: this.configuration.protocol,
          senderName: this.configuration.senderName,
          readTimeout: this.configuration.readTimeout,
          writeTimeout: this.configuration.writeTimeout,
          connectionTimeout: this.configuration.connectionTimeout,
          startTlsEnabled: this.configuration.startTlsEnabled,
          startTlsRequired: this.configuration.startTlsRequired,
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

  switchToggle(event, code){
    this.form.patchValue({
      [code]: event.checked
    });
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

    const form: Partial<IMailConfiguration> = {
      name: this.form.value.name,
      host: this.form.value.host,
      port: this.form.value.port,
      protocol: this.form.value.protocol,
      senderName: this.form.value.senderName,
      readTimeout: this.form.value.readTimeout,
      writeTimeout: this.form.value.writeTimeout,
      connectionTimeout: this.form.value.connectionTimeout,
      startTlsEnabled: this.form.value.startTlsEnabled,
      startTlsRequired: this.form.value.startTlsRequired
    };

    if (this.updateAccessKey) {
      form.password = this.form.value.password;
      form.username = this.form.value.username;
    }

    if (this.configuration) {
      this.mailConfigurationService.update(this.configuration.id, this.configuration.revision, form).subscribe(
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
      this.mailConfigurationService
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
