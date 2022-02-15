import { NzMessageService } from 'ng-zorro-antd/message';
import { tap } from 'rxjs/operators';
import { EmployeesService, RoleService } from 'src/api';

import { Injectable } from '@angular/core';
import { EmployeeQuery, Role } from '@api/models';
import { Action, createSelector, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';

import { environment } from '../../../environments/environment';
import { EmployeesModel } from './data/employees.model';
import { EmployeesColumns as displayedColumnSetting } from './data/optional-columns';
import { EmployeesActions } from './employees.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface EmployeesStateModel {
  loaded: boolean;
  items: EmployeesModel[];
  displayedColumns: string[];
  query?: Partial<EmployeeQuery>;
  meta?: DataServiceMetadata;
  roles: Role[];
}

const initialState = (): EmployeesStateModel => ({
  items: [],
  roles: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.map((column) => column.name)
});

@State<EmployeesStateModel>({
  name: 'employeesList',
  defaults: initialState()
})
@Injectable()
export class EmployeesState implements NgxsOnInit {
  tenantId = environment.orgId;
  constructor(
    private service: EmployeesService,
    private roleService: RoleService,
    private message: NzMessageService) { }

  static getOneById(customerId: string) {
    return createSelector([EmployeesState.getItems], (customers: EmployeesModel[]) => customers.find((item) => item.id === customerId));
  }

  @Selector()
  static getRoles(state: EmployeesStateModel) {
    return state.roles;
  }

  @Selector()
  static getDisplayedColumns(state: EmployeesStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: EmployeesStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: EmployeesStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: EmployeesStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: EmployeesStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(EmployeesActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<EmployeesStateModel>, { query }: EmployeesActions.GetAll) {
    return this.service.search(this.tenantId, query).pipe(
      tap(res => {
        res.data.forEach((employee) => {
          employee.roleName = employee.roles.map((role) => role.name).join(', ');
        });
        context.patchState({ items: res.data, meta: res.meta, loaded: true });
      })
    );
  }

  @Action(EmployeesActions.GetRoles, { cancelUncompleted: true })
  getRoles(context: StateContext<EmployeesStateModel>, { query }: EmployeesActions.GetRoles) {
    return this.roleService.getAll(this.tenantId, query).pipe(
      tap(res => {
        context.patchState({ roles: res.data });
      })
    );
  }

  @Action(EmployeesActions.GetOne)
  getOne(context: StateContext<EmployeesStateModel>, { employeeId }: EmployeesActions.GetOne) {
    return this.service.detail(this.tenantId, employeeId).pipe(
      tap(res => {

        (res.data || {}).roleName = (res.data || {}).roles.map((role) => role.name).join(', ');
        const state = context.getState();
        const itemState = state.items.find((item) => item.id === res.data.id, res.data);

        const updatedItems = itemState
          ? updateItem<EmployeesModel>((item) => item.id === res.data.id, res.data)
          : insertItem<EmployeesModel>(res.data);

        context.setState(patch({ items: updatedItems }));
      })
    );
  }

  @Action(EmployeesActions.DeleteOne)
  deleteOne(context: StateContext<EmployeesStateModel>, { userId, revision }: EmployeesActions.DeleteOne) {
    const orgId = environment.orgId;
    return this.service.removeEmployees(orgId, userId, revision).pipe(
      tap(() => {
        const state = context.getState();
        const updateData = removeItem<EmployeesModel>(state.items.findIndex((item) => item.id === userId));
        context.setState(patch({ items: updateData }));
      })
    );
  }

  @Action(EmployeesActions.ResetPassword)
  restPassword(context: StateContext<EmployeesStateModel>, { employeeId, password } : EmployeesActions.ResetPassword) {
    const orgId = environment.orgId;
    return this.service.resetPassword(orgId, employeeId, password);
  }

  @Action(EmployeesActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<EmployeesStateModel>, { displayedColumns }: EmployeesActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem('employeesColumns', JSON.stringify(displayedColumns));
  }

  @Action(EmployeesActions.HandledError)
  handledError(context: StateContext<EmployeesStateModel>, { error }: EmployeesActions.HandledError) {
   this.message.error(error.message || error.code);
  }

  ngxsOnInit(context: StateContext<EmployeesStateModel>) {
    const columnString = localStorage.getItem('employeesColumns');
    try {
      const columns = columnString ? JSON.parse(columnString) : displayedColumnSetting.map((column) => column.name);
      context.patchState({ displayedColumns: columns });
    } catch (e) {
      console.error(e);
    }
  }
}
