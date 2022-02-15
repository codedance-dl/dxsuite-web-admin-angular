import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from '@api';
import { EmployeesState } from '@app/modules/employees/employees.state';
import { RolesModel } from '@app/modules/roles/data/roles.model';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'app-employees-edit',
  templateUrl: './employees-edit.component.html',
  styleUrls: ['./employees-commons.component.less']
})
export class EmployeesEditComponent implements OnInit, OnDestroy {
  @Select(EmployeesState.getRoles) roles$: Observable<RolesModel[]>;

  employeeId = this.route.snapshot.params.employeeId;

  tenantId = environment.orgId;

  loading = false;

  form: FormGroup;

  // 原始角色IDs
  originalRoleIds: string[];

  userId = '';

  revision: number;

  private destroy = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private store: Store,
    private notifier: NzMessageService,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      account: [{ value: null, disabled: true }, [Validators.required]],
      roleIDs: [[], [Validators.required]],
      name: [{ value: null, disabled: true }, [Validators.required]]
    });
  }

  ngOnInit() {
    this.getEmployee();
  }

  /**
   * 获取成员详情
   */
  getEmployee() {
    this.loading = true;
    this.store.select(EmployeesState.getOneById(this.employeeId)).pipe(
      takeUntil(this.destroy)
    ).subscribe((data) => {
      this.originalRoleIds = data.roles.map(item => item.id);
      this.userId = data.user.id;
      this.revision = data.revision;
      this.form.patchValue({
        account: data.mobile || data.email,
        name: data.name,
        roleIDs: this.originalRoleIds
      });
      this.loading = false;
    });
  }

  editMember() {
    if (!this.form.valid) {
      return;
    }

    this.loading = true;

    // 新角色IDs
    const currentRoleIds = this.form.value.roleIDs;
    const totalIds = new Set([...this.originalRoleIds, ...currentRoleIds]);
    // 应删除的旧角色IDs
    const deleteIds = Array.from(totalIds).filter(item => !currentRoleIds.includes(item));
    // 应添加的新角色IDs
    const addIds = Array.from(totalIds).filter(item => !this.originalRoleIds.includes(item));

    // 执行任务
    const task = [of(null)];

    // 2、查询待删除的角色组成员IDs，删除旧角色
    deleteIds.forEach(roleId => {
      task.push(this.roleService.member(this.tenantId, roleId, { employeeId: this.employeeId }).pipe(
        switchMap(response => this.roleService.deleteMember(this.tenantId, roleId, response.data[0].id, response.data[0].revision))
      ));
    });

    addIds.forEach(roleId => {
      task.push(
        this.roleService.addMember(this.tenantId, roleId, {
          employeeId: this.employeeId
        })
      );
    });

    forkJoin(task).subscribe(
      (response) => {
        // 3、成功后，将当前roleID重新赋值给原始角色IDs
        this.originalRoleIds = currentRoleIds;
        this.loading = false;
        this.notifier.success('编辑成员成功');
        history.back();
      },
      (error) => {
        this.loading = false;
        this.getEmployee();
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
