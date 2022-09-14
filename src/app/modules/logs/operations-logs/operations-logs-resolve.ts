import { filter, take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { OperationsLogsActions } from '../state/operations-logs.actions';
import { LogsModel } from '@constant/common';

@Injectable()
export class OperationsLogsResolve implements Resolve<LogsModel> {

  constructor(private store: Store) { }

  resolve(route: ActivatedRouteSnapshot) {
    const userAuditId = route.params.auditId;
    return this.store.dispatch(new OperationsLogsActions.GetOne(userAuditId)).pipe(
      filter(res => !!res),
      take(1)
    );
  }
}
