import { tap } from 'rxjs/operators';
import { RoleService } from 'src/api';
import { AuthState } from 'src/app/store/auth';

import { Injectable } from '@angular/core';
import {
  Action,
  createSelector,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store
} from '@ngxs/store';
import { patch, removeItem, updateItem } from '@ngxs/store/operators';

import { BaseQuery } from '@api/models';
import { environment } from '@environments/environment';
import { RolesColumns as displayedColumnSetting } from './data/optional-columns';
import { RolesModel } from './data/roles.model';
import { RolesActions } from './roles.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface RolesStateModel {
  items: RolesModel[];
  displayedColumns: string[];
  authorities: { [key: string]: string[] };
  loaded: boolean;
  detail?: RolesModel;
  query?: BaseQuery;
  meta?: DataServiceMetadata;
}

const initialState = () => ({
  loaded: false,
  items: [],
  authorities: {},
  displayedColumns: displayedColumnSetting.map(column => column.name)
});

@State<RolesStateModel>({
  name: 'roles',
  defaults: initialState()
})
@Injectable()
export class RolesState implements NgxsOnInit {

  constructor(private store: Store, private roleService: RoleService) { }

  static getPrivilegesById(roleId: string) {
    return createSelector([RolesState], (state: RolesStateModel) => state.authorities[roleId] || []);
  }

  static getOneById(roleId: string) {
    return createSelector([RolesState.getItems], (roles: RolesModel[]) => roles.find(item => item.id === roleId));
  }

  // 获取角色详情
  static getRoles(roleId: string) {
    return createSelector([RolesState], (state: RolesStateModel) => state.detail);
  }

  @Selector()
  static getDisplayedColumns(state: RolesStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: RolesStateModel) {
    return state.items;
  }

  @Selector()
  static getDetails(state: RolesStateModel) {
    return state.detail;
  }

  @Selector()
  static getMetadata(state: RolesStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: RolesStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: RolesStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(RolesActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<RolesStateModel>, { queryParams }: RolesActions.GetAll) {
    const orgId = environment.orgId;
    return this.roleService
      .getAll(orgId, queryParams)
      .pipe(tap((result) => {
        const user = this.store.selectSnapshot(AuthState.getIdentity);
        if (user.type !== 'SUPER') {
          result.data.forEach((item) => {
            if (user.roles.find(role => role.id === item.id)) {
              item.currentRole = '当前角色';
            }
          });
        }
        return context.patchState({ items: result.data, meta: result.meta, loaded: true });
      }));
  }

  @Action(RolesActions.GetOne)
  getOne(context: StateContext<RolesStateModel>, { roleId }: RolesActions.GetOne) {
    const orgId = environment.orgId;
    return this.roleService.detail(orgId, roleId).pipe(
      tap(res => {
        const state = context.getState();
        const authoritiesList = res.data.authorities.map((privilege) => privilege);
        const authorities = { ...state.authorities };
        authorities[roleId] = authoritiesList;
        context.patchState({ authorities, detail: res.data });
      })
    );
  }

  @Action(RolesActions.AddOne)
  addOne(context: StateContext<RolesStateModel>, { data }: RolesActions.AddOne) {
    const orgId = environment.orgId;
    return this.roleService.create(orgId, data);
  }

  @Action(RolesActions.RemoveOne)
  removeOne(context: StateContext<RolesStateModel>, { roleId, revision }: RolesActions.RemoveOne) {
    const orgId = environment.orgId;
    return this.roleService.delete(orgId, roleId, revision).pipe(
      tap(() => {
        const items = removeItem<RolesModel>((item) => item.id === roleId);
        context.setState(patch({ items }));
      })
    );
  }

  @Action(RolesActions.UpdateOne)
  updateOne(context: StateContext<RolesStateModel>, { roleId, data, revision }: RolesActions.UpdateOne) {
    const orgId = environment.orgId;
    return this.roleService.update(orgId, roleId, data, revision).pipe(
      tap(() => {
        const state = context.getState();
        const current = state.items.find((role) => role.id === roleId);
        const items = updateItem<RolesModel>((item) => item.id === roleId, { ...current, ...data, revision});
        context.setState(patch({ items }));
      })
    );
  }

  @Action(RolesActions.AssignPrivileges)
  assignPrivileges(context: StateContext<RolesStateModel>, { roleId, authorities, revision }: RolesActions.AssignPrivileges) {
    const orgId = environment.orgId;
    return this.roleService.setPrivileges(orgId, roleId, revision, { authorities }).pipe(
      tap((response) => {
        const state = context.getState();
        const rolePrivileges = { ...state.authorities };
        rolePrivileges[roleId] = authorities;
        context.patchState({ authorities: rolePrivileges, detail: response.data });
      })
    );
  }

  @Action(RolesActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<RolesStateModel>, { displayedColumns }: RolesActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem('rolesColumns', JSON.stringify(displayedColumns));
  }

  ngxsOnInit(context: StateContext<RolesStateModel>) {
    const columnString = localStorage.getItem('rolesColumns');
    try {
      const columns = columnString ? JSON.parse(columnString) : displayedColumnSetting.map(column => column.name);
      context.patchState({ displayedColumns: columns });
    } catch (e) {
      console.error(e);
    }
  }
}
