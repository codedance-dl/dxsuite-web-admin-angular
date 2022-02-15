import { filter, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { OperationsLogsModel } from '../data/operations-logs.model';
import { OperationsLogsActions } from '../state/operations-logs.actions';

@Injectable()
export class OperationsLogsResolve implements Resolve<OperationsLogsModel> {

  constructor(private store: Store) { }

  resolve(route: ActivatedRouteSnapshot) {
    const userAuditId = route.params.auditId;
    return this.store.dispatch(new OperationsLogsActions.GetOne(userAuditId)).pipe(
      filter(res => !!res),
      take(1)
    );
  }
}
