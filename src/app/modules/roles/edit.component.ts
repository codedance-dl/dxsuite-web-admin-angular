import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '@api/models';
import { Store } from '@ngxs/store';

import { RolesActions } from './roles.actions';

@Component({
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item autoErrorTip>
        <nz-form-label nzRequired nzFor="name">角色名称</nz-form-label>
        <nz-form-control>
          <input nz-input formControlName="name" id="name" placeholder="角色名称" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item autoErrorTip>
        <nz-form-label nzRequired nzFor="name">描述</nz-form-label>
        <nz-form-control>
          <textarea nz-input formControlName="description" placeholder="描述角色的定位以及作用" rows=5></textarea>
        </nz-form-control>
      </nz-form-item>
      <button nz-button nzType="primary" [nzLoading]="loading">提交</button>
    </form>
  `
})

export class RolesEditComponent implements OnInit, OnDestroy {

  @Input() data: Role = {};

  loading = false;

  form: FormGroup;

  private destroy = new Subject();
  constructor(
    private message: NzMessageService,
    private formBuilder: FormBuilder,
    private store: Store,
    private modal: NzModalRef
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.data.name, [Validators.required]],
      description: [this.data.description, [Validators.required]],
    });
  }

  onSubmit() {
    // eslint-disable-next-line
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      return;
    }
    this.store
      .dispatch(new RolesActions.UpdateOne(this.data.id, { ...this.form.value }, this.data.revision))
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.loading = false;
          this.message.create('success', '编辑角色成功');
          this.modal.destroy(true);
        },
        error => {
          this.loading = false;
          this.message.create('error', error.error.message || error.error.code);
        }
      );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
