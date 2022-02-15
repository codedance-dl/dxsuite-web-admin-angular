import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Employee } from '@api/models';
import { Store } from '@ngxs/store';

import { EmployeesActions } from './employees.actions';

@Component({
  template: `
    <form nz-form nzLayout="vertical" [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item autoErrorTip>
        <nz-form-label nzRequired nzFor="name">重置密码</nz-form-label>
        <nz-form-control nzExtra="重置密码后，成员初次登录时系统会强制要求设置新密码">
          <input nz-input formControlName="password" id="password" />
        </nz-form-control>
      </nz-form-item>

      <button nz-button nzType="primary" [nzLoading]="loading">提交</button>
    </form>
  `
})

export class EmployeeResetPasswordComponent implements OnDestroy {
  @Input() employee: Employee;
  loading = false;

  form = this.formBuilder.group({
    password: [null, [Validators.required]],
  });

  private destroy = new Subject();
  constructor(
    private message: NzMessageService,
    private formBuilder: FormBuilder,
    private store: Store,
    private modal: NzModalRef
  ) {

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
    this.loading = true;
    this.store
      .dispatch(new EmployeesActions.ResetPassword(this.employee.id, this.form.value.password))
      .pipe(takeUntil(this.destroy))
      .subscribe(
        () => {
          this.message.create('success', '重置密码成功');
          this.loading = false;
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
