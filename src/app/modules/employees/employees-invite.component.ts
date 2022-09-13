import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeesService } from '@api';
import { Select, Store } from '@ngxs/store';

import { RolesModel } from '../roles/data/roles.model';
import { ValidateStatus } from './data/employees.model';
import { EmployeesActions } from './employees.actions';
import { EmployeesState } from './employees.state';
import { ACCOUNT_REGEXP, MOBILE_REGEXP } from '@constant/regex';

@Component({
  selector: 'app-employees-invite',
  templateUrl: './employees-invite.component.html',
  styleUrls: ['./employees-commons.component.less']
})
export class EmployeesInviteComponent implements OnDestroy {
  @Select(EmployeesState.getRoles) roles$: Observable<RolesModel[]>;

  tenantId = environment.orgId;

  loading = false;

  form: FormGroup;

  confirmModal?: NzModalRef;

  private destroy = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private employeesService: EmployeesService,
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
    });
  }

  editMember() {
    for (const key of Object.keys(this.form.controls)) {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    }
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    const body = { ...this.form.value, userCredential: this.form.value.account };

    if (MOBILE_REGEXP.test(this.form.value.account)) {
      body.mobile = this.form.value.account;
    } else {
      body.email = this.form.value.account;
    }

    delete body.account;

    this.employeesService.inviteEmployee(this.tenantId, body).subscribe(() => {
      this.loading = false;
      this.notifier.success('邀请成功');
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



  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
