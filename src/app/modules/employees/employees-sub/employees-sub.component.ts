import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { RolesModel } from '../../roles/data/roles.model';
import { CreateEmployeeDataModal, ValidateStatus } from '../data/employees.model';
import { EmployeesActions } from '../employees.actions';
import { EmployeesState } from '../employees.state';

import { ACCOUNT_REGEXP, MOBILE_REGEXP } from '@constant/regex';
import { EmployeesSubService } from './employees-sub.service';

@Component({
  selector: 'app-employees-sub',
  templateUrl: './employees-sub.component.html',
  styleUrls: ['./employees-sub.component.less']
})
export class EmployeesSubComponent implements OnInit, OnDestroy {
  @Select(EmployeesState.getRoles) roles$: Observable<RolesModel[]>;

  tenantId = environment.orgId;

  action: '添加' | '邀请' = '添加';

  loading = false;

  form: FormGroup;

  confirmModal?: NzModalRef; // 确认是否添加成员modal

  private destroy = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private notifier: NzMessageService,
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private employeesSubService: EmployeesSubService
  ) {
    this.store.dispatch(new EmployeesActions.GetRoles());
  }

  ngOnInit() {
    this.action = this.route.snapshot.data.action;
    this.setFormValidate();
  }

  setFormValidate() {
     const commmonValidator = {
       account: [null, [Validators.required, Validators.pattern(ACCOUNT_REGEXP)]],
       roleIDs: [[], [Validators.required]],
       name: [null, [Validators.required]],
     }
    if (this.action === '添加') {
      this.form = this.formBuilder.group({...commmonValidator, password: ['', [Validators.required]]});
    } else {
      this.form = this.formBuilder.group(commmonValidator);
    }
  }
  operateMember() {
    for (const key of Object.keys(this.form.controls)) {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    }
    if (!this.form.valid) {
      return;
    }
    this.loading = true;

    const formValue = this.form.value;
    const body: CreateEmployeeDataModal = { ...formValue, userCredential: formValue.account };
    if (this.action === '添加') {
      this.addMember(body);
    } else {
      this.inviteMember(body);
    }
  }

  setParamsBody(body: CreateEmployeeDataModal): CreateEmployeeDataModal {
    const account = body.userCredential;
    const key = MOBILE_REGEXP.test(account) ? 'mobile' : 'email';
    body[key] = account;
    return body;
  }

  addMember(body: CreateEmployeeDataModal) {
    body = this.setParamsBody(body);
    this.employeesSubService.user.available(body.userCredential).subscribe(({ data }) => {
      if (!data) {
        this.showConfirm(body);
      } else {
        this.createEmployee(body);
      }
    });
  }

  // 邀请成员
  inviteMember(body: CreateEmployeeDataModal) {
    body = this.setParamsBody(body);
    this.handleEmployee(body, 'inviteEmployee');
  }

  // 添加成员
  createEmployee(body: CreateEmployeeDataModal) {
    this.handleEmployee(body, 'createEmployee');
  }

  handleEmployee(body: CreateEmployeeDataModal, api: string) {
    this.employeesSubService.employees[api](this.tenantId, body).subscribe(
      () => {
        this.loading = false;
        this.notifier.success(`${this.action}成功`);
        this.router.navigate(['/organization-permissions/employees']);
      },
      (error) => {
        this.loading = false;
        this.notifier.error(error.error.message || error.error.code);
      }
    );
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
      nzOnCancel: () => {
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
