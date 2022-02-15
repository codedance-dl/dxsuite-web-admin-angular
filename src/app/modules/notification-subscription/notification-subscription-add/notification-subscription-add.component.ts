import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationTemplateService, TagsService } from '@api';
import { environment } from '@environments/environment';
import { Store } from '@ngxs/store';

import { CHANNEL_SWITCH_TYPE_MAP, SubscriptionGroupType, TemplateType } from '../notifation-model';
import { NotificationSubscriptions } from '../notification-subscription.actions';
import { subscriptionGroupRequiredValidator } from '../notification-template.directive';

@Component({
  selector: 'app-notification-subscription-add',
  templateUrl: './notification-subscription-add.component.html',
  styleUrls: ['./notification-subscription-add.component.less']
})
export class NotificationSubscriptionAddComponent implements OnInit {

  @Input() get category() {
    return this._category;
  }
  set category(value: string) {
    if (value) {
      this._category = value;
      this.form.get('category').setValue(value);
      this.initial();
    }
  }

  @Output() confirm = new EventEmitter<null>();
  form: FormGroup;
  submitError = false;
  loading = false;

  channelSwitchMap = Object.assign({}, CHANNEL_SWITCH_TYPE_MAP);
  channelSwitches = Object.keys(CHANNEL_SWITCH_TYPE_MAP);
  templateType = Object.assign({}, TemplateType);

  groupName = new FormControl('');
  groupType = Object.assign({}, SubscriptionGroupType);

  subscriptionGroupList = [];

  notificationTemplates = {
    sms: [],
    mail: [],
    message: []
  };

  private _category = '';

  constructor(
    private fb: FormBuilder,
    private tagsService: TagsService,
    private notificationTemplateService: NotificationTemplateService,
    private store: Store,
    private messageService: NzMessageService,
    private modal: NzModalService,
    private drawerRef: NzDrawerRef<string>
  ) {
    this.form = this.fb.group(
      {
        groupId: ['', [Validators.required]],
        name: ['', [Validators.required]],
        purpose: ['', [Validators.required]],
        category: ['', [Validators.required]],
        smsChannel: this.configForm(),
        messageChannel: this.configForm(),
        mailChannel: this.configForm(),
        description: ['']
      },
      { validators: subscriptionGroupRequiredValidator }
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
        config: new FormControl('onlyEnabled'),
        notificationTemplateId: new FormControl('')
      }
      // notificationTemplateRequiredValidator
    );

  initial() {
    this.tagsService.search(environment.orgId, { type: this.groupType[this.category] }).subscribe(res => {
      this.subscriptionGroupList = res.data;
    });
  }

  onSubmit() {
    for (const i in this.form.controls) {
      if (Object.prototype.hasOwnProperty.call(this.form.controls, i)) {
        this.form.controls[i].markAsDirty();
        this.form.controls[i].updateValueAndValidity();
      }
    }
    if (!this.form.valid) {
      this.submitError = true;
      return;
    }
    this.submitError = false;
    this.loading = true;

    const body: {
      name: string;
      businessGroup?: string;
      category: string;
      purpose: string;
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
      name: this.form.value.name,
      businessGroup: this.form.value.groupId,
      category: this.form.value.category,
      purpose: this.form.value.purpose,
      description: this.form.value.description,
      smsTemplateId: this.form.value.smsChannel.notificationTemplateId || '',
      smsDisabled: this.channelSwitchMap[this.form.value.smsChannel.config].disabled,
      smsEditable: this.channelSwitchMap[this.form.value.smsChannel.config].editable,
      msgTemplateId: this.form.value.messageChannel.notificationTemplateId || '',
      msgDisabled: this.channelSwitchMap[this.form.value.messageChannel.config].disabled,
      msgEditable: this.channelSwitchMap[this.form.value.messageChannel.config].editable,
      mailTemplateId: this.form.value.mailChannel.notificationTemplateId || '',
      mailDisabled: this.channelSwitchMap[this.form.value.mailChannel.config].disabled,
      mailEditable: this.channelSwitchMap[this.form.value.mailChannel.config].editable
    };

    for (const key in body) {
      if (body[key] === '') {
        delete body[key];
      }
    }

    this.store.dispatch(new NotificationSubscriptions.Create(body, this.getGroupName())).subscribe(
      () => {
        this.loading = false;
        this.form = this.fb.group(
          {
            groupId: ['', [Validators.required]],
            name: ['', [Validators.required]],
            key: ['', [Validators.required]],
            category: [this.category, [Validators.required]],
            mailChannel: this.configForm(),
            smsChannel: this.configForm(),
            messageChannel: this.configForm(),
            description: null
          },
          { validators: subscriptionGroupRequiredValidator }
        );
        this.messageService.success('创建成功');
        this.drawerRef.close(true);
      },
      (error) => {
        this.loading = false;
        this.messageService.error(error.error.code === 'error.no-privilege' ? '当前用户没有编辑权限' : error.error.message);
      }
    );
  }
  getGroupName() {
    const group = this.subscriptionGroupList.find((item) => item.id === this.form.value.groupId);
    return group && group.text;
  }

  createGroup(input: HTMLInputElement) {
    if (input.value) {
      this.tagsService
        .create(environment.orgId, this.groupType[this.category], {
          text: input.value
        })
        .subscribe(({ data }) => {
          this.form.get('groupId').setValue(data.id);
          input.value = null;
          this.subscriptionGroupList.push(data);
          this.messageService.success(`创建分组成功`);
        });
    }
  }

  showDeleteConfirm(e: Event, group): void {
    this.modal.confirm({
      nzTitle: `确定要删除：${group.text} 吗？`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteGroup(group),
      nzCancelText: '取消'
    });
  }

  deleteGroup(group: { id: string; text: string; revision: number }) {
    this.tagsService
      .delete(environment.orgId, this.groupType[this.category], group.id, group.revision)
      .subscribe(() => {
        this.form.get('groupId').setValue(null);
        this.initial();
        this.messageService.success(`删除 ${group.text} 成功`);
      },
        (error) => {
          this.loading = false;
          this.messageService.error(`删除失败 ${error.error.code === 'error.no-privilege' ? '当前用户没有编辑权限' : error.error.message}`);
        });
  }

  setChannelConfig(form, value) {
    form.patchValue(this.channelSwitchMap[value]);
  }

  getNotificationTemplateStatus(form) {
    const templateForm = this.form.get(form);
    return templateForm.errors && templateForm.errors.requiredTemplate && (templateForm.touched || templateForm.dirty || this.submitError);
  }



}


