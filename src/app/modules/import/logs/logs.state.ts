import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ImportLogsModel, ImportLogsQuery } from '@api/models';
import { TasksService } from '@api/tasks.service';
import {
  Action,
  createSelector,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store
} from '@ngxs/store';

import { environment } from '../../../../environments/environment';
import {
  LogsColumns as displayedColumnSetting,
  LogsDisplayedColumnName
} from './data/optional-columns';
import { LogsActions } from './logs.actions';

export interface DataServiceMetadata {
  count: number;
  pageNo: number;
  pageSize: number;
}

export interface LogsStateModel {
  loaded: boolean;
  items: ImportLogsModel[];
  displayedColumns: string[];
  query?: ImportLogsQuery;
  meta?: DataServiceMetadata;
}

const initialState = (): LogsStateModel => ({
  items: [],
  loaded: false,
  displayedColumns: displayedColumnSetting.filter(column => column.enable).map(column => column.name)
});

@State<LogsStateModel>({
  name: 'logsList',
  defaults: initialState()
})
@Injectable()
export class LogsState implements NgxsOnInit {

  constructor(
    private store: Store,
    private service: TasksService,
    // private notifier: NtNoti fier
  ) {
  }

  static getOneById(logsId: string) {
    return createSelector([LogsState.getItems], (items: ImportLogsModel[]) => items.find(item => item.id === logsId));
  }

  @Selector()
  static getDisplayedColumns(state: LogsStateModel) {
    return state.displayedColumns;
  }

  @Selector()
  static getItems(state: LogsStateModel) {
    return state.items;
  }

  @Selector()
  static getMetadata(state: LogsStateModel) {
    return state.meta;
  }

  @Selector()
  static isLoaded(state: LogsStateModel) {
    return state.loaded;
  }

  @Selector()
  static isEmpty(state: LogsStateModel) {
    return state.loaded && state.items.length === 0;
  }

  @Action(LogsActions.GetAll, { cancelUncompleted: true })
  getAll(context: StateContext<LogsStateModel>, { query }: LogsActions.GetAll) {
    const orgId = environment.orgId;
    query.code = 'IMPORT_ASSET';
    return this.service.getAll(orgId, query).pipe(tap(res => {
      context.patchState({ items: res.data, meta: res.meta, loaded: true });
    }));
  }

  @Action(LogsActions.UpdateDisplayedColumns)
  updateDisplayedColumns(context: StateContext<LogsStateModel>, { displayedColumns }: LogsActions.UpdateDisplayedColumns) {
    context.patchState({ displayedColumns });
    localStorage.setItem(LogsDisplayedColumnName, JSON.stringify(displayedColumns));
  }

  @Action(LogsActions.UpdateImportProcess)
  updateImportPurchaseOrderProcess(state: StateContext<LogsStateModel>,
                                   { taskId, payload }: LogsActions.UpdateImportProcess) {
    const items = state.getState().items.concat([]);
    const targetTaskIndex = items.findIndex(item => item.id === taskId);
    if (targetTaskIndex > -1) {
      const targetTask = {
        ...items[targetTaskIndex],
        totalCount: payload.totalCount,
        processedCount: payload.processedCount,
        failedCount: payload.failedCount
      };
      if (targetTask.totalCount > 0
        && targetTask.totalCount === targetTask.processedCount) {
        setTimeout(() => {
          console.log('success', '资产导入完成');
        });
        return this.store.dispatch(new LogsActions.GetAll({
          pageNo: 1,
          pageSize: 20,
          sortBy: ['createdAt:desc']
        }));
      } else if (targetTask.status === 'RUNNING') {
        items.splice(targetTaskIndex, 1, targetTask);
        state.patchState({ items });
      }
    }
  }

  ngxsOnInit(context: StateContext<LogsStateModel>) {
    const columnString = localStorage.getItem(LogsDisplayedColumnName);
    try {
      const columns = JSON.parse(columnString);
      const cols = context.getState().displayedColumns;
      if (Array.isArray(columns) && columns.every(column => cols.includes(column))) {
        context.patchState({ displayedColumns: columns });
      } else {
        localStorage.removeItem(LogsDisplayedColumnName);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

