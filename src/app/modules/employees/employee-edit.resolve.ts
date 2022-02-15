import { take, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';

import { EmployeesActions } from './employees.actions';
import { RolesModel } from '../roles/data/roles.model';

@Injectable({ providedIn: 'root' })
export class EmployeeEditResolve implements Resolve<RolesModel> {
  constructor(private store: Store) { }
  resolve(route: ActivatedRouteSnapshot) {
    const employeeId = route.paramMap.get('employeeId');
    return this.store.dispatch(new EmployeesActions.GetOne(employeeId)).pipe(
      switchMap(() => this.store.dispatch(new EmployeesActions.GetRoles())),
      take(1)
    );
  }
}
