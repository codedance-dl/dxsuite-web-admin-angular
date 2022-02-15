import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NotificationSubscriptionService, NotificationTemplateService } from '@api';
import { Store } from '@ngxs/store';

import { CHANNEL_SWITCH_TYPE_MAP, TemplateType } from '../notifation-model';
import { NotificationSubscriptions } from '../notification-subscription.actions';
import { subscriptionGroupRequiredValidator } from '../notification-template.directive';

@Component({
  selector: 'app-notification-subscription-edit',
  templateUrl: './notification-subscription-edit.component.html',
  styleUrls: ['./notification-subscription-edit.component.less']
})
export class NotificationSubscriptionEditComponent implements OnInit {

  @Input()
  set templateId(value: string) {
    if (!value) {
      return;
    }
    this._templateId = value;
    this.notificationSubscriptionService.detail(value).subscribe((result) => {
      if (result && result.success) {
        this.initial(result.data);
      }
    });
  }
  get templateId(): string {
    return this._templateId;
  }

  loading = false;
  submitError = false;
  form: FormGroup;

  channelSwitchMap = Object.assign({}, CHANNEL_SWITCH_TYPE_MAP);
  channelSwitches = Object.keys(CHANNEL_SWITCH_TYPE_MAP);
  templateType = Object.assign({}, TemplateType);

  subscriptionGroupList = [];

  notificationTemplates = {
    sms: [],
    mail: [],
    message: []
  };

  revision: number;

  private _templateId: string;
  private initValue: {
    name?: string;
    businessGroup?: {
      id?: string;
    };
    category?: string;
    purpose?: string;
    description?: string;
  };
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private notificationSubscriptionService: NotificationSubscriptionService,
    private notificationTemplateService: NotificationTemplateService,
    private messageService: NzMessageService,
    private drawerRef: NzDrawerRef<string>
  ) {
    this.form = this.fb.group(
      {
        smsChannel: this.configForm(),
        messageChannel: this.configForm(),
        mailChannel: this.configForm()
      }
    );
  }

  ngOnInit() {
    this.notificationTemplateService
      .getAll({
        pageNo: 1,
        pageSize: 100
      })
      .subscribe((res) => {
        this.notificationTemplates.sms = res.data.filter((item) => item.tagList.includes('MOBILE'));
        this.notificationTemplates.message = res.data.filter((item) => item.tagList.includes('MESSAGE'));
        this.notificationTemplates.mail = res.data.filter((item) => item.tagList.includes('EMAIL'));
      });
  }

  configForm = () =>
    new FormGroup(
      {
        config: new FormControl(this.setConfig(false, false)),
        notificationTemplateId: new FormControl('')
      }
    );
  setConfig(disable: boolean, enabled: boolean) {
    let config = '';
    for (const key in this.channelSwitchMap) {
      if (this.channelSwitchMap[key].disabled === disable && this.channelSwitchMap[key].editable === enabled) {
        config = key;
      }
    }
    return config;
  }

  initial(values) {

    this.initValue = values;

    this.form.reset();

    const initValue: {
      smsChannel?: {
        notificationTemplateId: string;
        config: string;
      };
      messageChannel?: {
        notificationTemplateId: string;
        config: string;
      };
      mailChannel?: {
        notificationTemplateId: string;
        config: string;
      };
    } = {};

    initValue.smsChannel = {
      notificationTemplateId: (values.smsTemplate || {}).id || '',
      config: this.setConfig(values.smsDisabled, values.smsEditable)
    };

    initValue.messageChannel = {
      notificationTemplateId: (values.msgTemplate || {}).id || '',
      config: this.setConfig(values.msgDisabled, values.msgEditable)
    };

    initValue.mailChannel = {
      notificationTemplateId: (values.mailTemplate || {}).id || '',
      config: this.setConfig(values.mailDisabled, values.mailEditable)
    };

    this.form.patchValue(initValue);

    this.revision = values.revision;
  }
  onSubmit() {
    if (!this.form.valid) {
      this.submitError = true;
      return;
    }

    this.submitError = false;
    this.loading = true;

    const body: {
      name?: string;
      businessGroup?: string;
      category?: string;
      purpose?: string;
      description?: string;
      smsTemplateId?: string;
      smsDisabled?: boolean;
      smsEditable?: boolean;
      msgTemplateId?: string;
      msgDisabled?: boolean;
      msgEditable?: boolean;
      mailTemplateId?: string;
      mailDisabled?: boolean;
      mailEditable?: boolean;
    } = {
      name: this.initValue.name,
      businessGroup: this.initValue.businessGroup.id,
      category: this.initValue.category,
      purpose: this.initValue.purpose,
      description: this.initValue.description,
      smsTemplateId: this.form.value.smsChannel.notificationTemplateId || '',
      smsDisabled: this.channelSwitchMap[this.form.value.smsChannel.config].disabled,
      smsEditable: this.channelSwitchMap[this.form.value.smsChannel.config].editable,
      msgTemplateId: this.form.value.messageChannel.notificationTemplateId || '',
      msgDisabled: this.channelSwitchMap[this.form.value.messageChannel.config].disabled,
      msgEditable: this.channelSwitchMap[this.form.value.messageChannel.config].editable,
      mailTemplateId: this.form.value.mailChannel.notificationTemplateId,
      mailDisabled: this.channelSwitchMap[this.form.value.mailChannel.config].disabled,
      mailEditable: this.channelSwitchMap[this.form.value.mailChannel.config].editable
    };

    for (const key in body) {
      if (body[key] === '') {
        delete body[key];
      }
    }

    this.store.dispatch(new NotificationSubscriptions.Update(this.templateId, body, this.revision)).subscribe(
      () => {
        this.messageService.success('修改成功');
        this.drawerRef.close(true);
      },
      (error) => {
        this.resetForm();
        this.messageService.error(error.error.code === 'error.no-privilege' ? '当前用户没有编辑权限' : error.error.message);
      }
    );
  }

  getNotificationTemplateStatus(form) {
    const templateForm = this.form.get(form);
    return templateForm.errors && templateForm.errors.requiredTemplate && (templateForm.touched || templateForm.dirty || this.submitError);
  }

  resetForm() {
    this.loading = false;
    this.form = this.fb.group(
      {
        smsChannel: this.configForm(),
        messageChannel: this.configForm(),
        mailChannel: this.configForm()
      },
      { validators: subscriptionGroupRequiredValidator }
    );
  }
}
