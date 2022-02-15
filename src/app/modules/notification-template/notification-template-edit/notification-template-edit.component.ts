import { NzMessageService } from 'ng-zorro-antd/message';
/* eslint-disable @typescript-eslint/naming-convention */
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';

import { NotificationTemplateModel } from '../data/notification-template.model';
import { NotificationTemplateActions } from '../notification-template.actions';
import { NotificationTemplateState } from '../notification-template.state';

const defaultContentType = 'text/plain';
const defaultLanguageCode = 'zh-CN';

@Component({
  selector: 'notification-template-edit',
  templateUrl: './notification-template-edit.component.html',
  styleUrls: ['./notification-template-edit.component.less']
})
export class NotificationTemplateEditComponent implements OnDestroy {

  form: FormGroup;

  templateId: string;

  template: NotificationTemplateModel & { type?: string };

  messageFormArray: FormArray = new FormArray([
    this.createFormGroup('MESSAGE')
  ]);

  mobileFormArray: FormArray = new FormArray([
    this.createFormGroup('MOBILE')
  ]);

  emailFormArray: FormArray = new FormArray([
    this.createFormGroup('EMAIL')
  ]);


  get contents() {
    return this.form.get('contents') as FormArray;
  }

  private readonly _destroy = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private nzMessageService: NzMessageService,
    private location: Location,
    // private modal: NtModal,
    private route: ActivatedRoute
  ) {
    this.templateId = this.route.snapshot.params.templateId as string;

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(16)]],
      type: ['MOBILE', [Validators.required]],
      tagList: ['', [Validators.required]],
      contents: this.mobileFormArray,
      description: ['', [Validators.maxLength(500)]]
    });

    this.form
      .get('type')
      .valueChanges.pipe(takeUntil(this._destroy))
      .subscribe((res) => {
        if (res === 'MESSAGE') {
          this.form.setControl('contents', this.messageFormArray);
          return;
        }
        if (res === 'EMAIL') {
          this.form.setControl('contents', this.emailFormArray);
          return;
        }
        this.form.setControl('contents', this.mobileFormArray);
      });

    this.store
      .select(NotificationTemplateState.getOneById(this.route.snapshot.params.templateId))
      .pipe(
        filter((res) => !!res),
        takeUntil(this._destroy)
      )
      .subscribe((res) => {

        this.template = { ...res };

        const type = this.setType((this.template || {}).tagList || []);
        const tagList = [...(this.template || {}).tagList || []];
        const index = tagList.indexOf(type);
        if (type === 'MESSAGE') {
          this.form.setControl('contents', this.messageFormArray);
        } else if (type === 'EMAIL') {
          this.form.setControl('contents', this.emailFormArray);
        } else {
          this.form.setControl('contents', this.mobileFormArray);
        }

        for (let idx = 0; idx < this.template.contents.length - 1; idx ++ ) {
          this.contents.push(this.createFormGroup(type));
        }

        tagList.splice(index, 1);

        this.form.patchValue({
          ... this.template,
          type,
          tagList: tagList.join(',')
        });
      });
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  onSubmit() {

    if (!this.form.valid) {
      return;
    }

    this.store
      .dispatch(
        new NotificationTemplateActions.UpdateOne(this.templateId, this.template.revision, {
          ...this.form.value,
          tagList: [this.form.value.type].concat(this.form.value.tagList.split(','))
        })
      )
      .subscribe(
        () => {
          this.location.back();
          this.nzMessageService.success('编辑成功');
        },
        (error) => {
          this.nzMessageService.error(error.error.code === 'error.no-privilege' ? '当前用户没有编辑权限' : error.error.message);
        }
      );
  }


  titleFormat(type: string) {

    const typeMap = {
      MOBILE: '短信',
      MESSAGE: '站内信',
      EMAIL: '邮件'
    };

    return typeMap[type];
  }

  setType(tagList: string[]) {
    if (tagList.includes('MESSAGE')) {
      return 'MESSAGE';
    }
    if (tagList.includes('EMAIL')) {
      return 'EMAIL';
    }
    return 'MOBILE';
  }

  createFormGroup(type) {
    if (type === 'MESSAGE') {
      return new FormGroup({
        content: new FormControl('', [Validators.required, Validators.maxLength(32768)]),
        subject: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        contentType: new FormControl(defaultContentType),
        languageCode: new FormControl(defaultLanguageCode)
      });
    }
    if (type === 'EMAIL') {
      return new FormGroup({
        content: new FormControl('', [Validators.required, Validators.maxLength(32768)]),
        subject: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        contentType: new FormControl(defaultContentType),
        languageCode: new FormControl(defaultLanguageCode)
      });
    }
    return new FormGroup({
      content: new FormControl('', [Validators.required, Validators.maxLength(32768)]),
      contentType: new FormControl(defaultContentType),
      languageCode: new FormControl(defaultLanguageCode)
    });
  }

  addTemplate() {
    this.contents.push(this.createFormGroup(this.form.value.type));
  }

  afterClose(index: number) {
    this.contents.removeAt(index);
  }

}
