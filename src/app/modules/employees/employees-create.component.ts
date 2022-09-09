import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeesService, UserService } from '@api';
import { Select, Store } from '@ngxs/store';

import { RolesModel } from '../roles/data/roles.model';
import { CreateEmployeeDataModal, ValidateStatus } from './data/employees.model';
import { EmployeesActions } from './employees.actions';
import { EmployeesState } from './employees.state';

import { ACCOUNT_REGEXP } from '@constant/regex';

@Component({
  selector: 'app-employees-create',
  templateUrl: './employees-create.component.html',
  styleUrls: ['./employees-commons.component.less']
})
export class EmployeesCreateComponent implements OnDestroy {
  @Select(EmployeesState.getRoles) roles$: Observable<RolesModel[]>;

  tenantId = environment.orgId;

  loading = false;

  form: FormGroup;

  confirmModal?: NzModalRef; // 确认是否添加成员modal

  private destroy = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private employeesService: EmployeesService,
    private userService: UserService,
    private store: Store,
    private notifier: NzMessageService,
    private router: Router,
    private modal: NzModalService
  ) {
    this.store.dispatch(new EmployeesActions.GetRoles());
    this.form = this.formBuilder.group({
      account: [null, [Validators.required,
      Validators.pattern(ACCOUNT_REGEXP)]],
      roleIDs: [[], [Validators.required]],
      name: [null, [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  createMember() {
    for (const key of Object.keys(this.form.controls)) {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    }
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    const body: CreateEmployeeDataModal = { ...this.form.value, userCredential: this.form.value.account };
    this.userService.available(body.account).subscribe(({ data }) => {

      if (/^1[0-9]{10,10}$/.test(this.form.value.account)) {
        body.mobile = this.form.value.account;
      } else {
        body.email = this.form.value.account;
      }
      delete body.account;
      if (!data) {
        this.showConfirm(body);
      } else {
        this.createEmployee(body);
      }
    });
  }

  // 添加成员
  createEmployee(body: CreateEmployeeDataModal) {
    this.employeesService.createEmployee(this.tenantId, body).subscribe(() => {
      this.loading = false;
      this.notifier.success('添加成功');
      this.router.navigate(['/organization-permissions/employees']);
    },(error) => {
      this.loading = false;
      this.notifier.error(error.error.message || error.error.code);
    });
  }

  select(id: string) {

    const roleIDs = [...this.form.value.roleIDs];
    const index = roleIDs.indexOf(id);

    if (index !== -1) {
      roleIDs.splice(index, 1);
    } else {
      roleIDs.push(id);
    }

    this.form.patchValue({ roleIDs });
  }

  getValidateStatus(controlName): ValidateStatus {
    const control = this.form.controls[controlName];
    if (control.dirty) {
      if (control.valid && control.value && control.value.length > 0) {
        return 'success';
      } else {
        return 'error';
      }
    }
    return 'success';
  }

  showConfirm(body: CreateEmployeeDataModal) {
    this.confirmModal = this.modal.confirm({
      nzCentered: true,
      nzWidth: '500px',
      nzTitle: '已存在用户账号',
      nzContent: `已存在用户账号：${this.form.value.account}，添加的成员将使用用户原有密码。确定要添加成员吗?`,
      nzOnOk: () => this.createEmployee(body),
      nzOnCancel: () =>{
        this.loading = false;
        this.confirmModal.close();
      }
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
