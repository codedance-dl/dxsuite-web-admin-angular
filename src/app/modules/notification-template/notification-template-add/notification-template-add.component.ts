import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';

import { NotificationTemplateActions } from '../notification-template.actions';
import { NzMessageService } from 'ng-zorro-antd/message';

const defaultContentType = 'text/plain';
const defaultLanguageCode = 'zh-CN';

@Component({
  selector: 'notification-template-add',
  templateUrl: './notification-template-add.component.html',
  styleUrls: ['./notification-template-add.component.less']
})
export class NotificationTemplateAddComponent implements OnDestroy {

  form: FormGroup;

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
    // private modal: NtModal
  ) {
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

        this.form.contains('contents') && this.form.removeControl('contents');

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
        new NotificationTemplateActions.CreateOne({
          ...this.form.value,
          tagList: [this.form.value.type].concat(this.form.value.tagList.split(','))
        })
      )
      .subscribe(
        () => {
          this.location.back();
          this.nzMessageService.success('创建成功');
        },
        (error) => {
          this.nzMessageService.error(error.error.code === 'error.no-privilege' ? '当前用户没有编辑权限' : error.error.message);
        }
      );
  }

  addTemplate() {
    this.contents.push(this.createFormGroup(this.form.value.type));
  }


  afterClose(index: number) {
    this.contents.removeAt(index);
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
}
