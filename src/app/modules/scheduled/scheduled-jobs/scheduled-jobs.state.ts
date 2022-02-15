import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CronService } from '@api';
import { DataServiceMetadata, ScheduledJobSchedules, ScheduledJobsQuery } from '@api/models';
import { ScheduledJobsAction } from '@app/modules/scheduled/scheduled-jobs/scheduled-jobs.actions';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

export interface ScheduledJobSchedulesStateModel {
  scheduledJobSchedules: ScheduledJobSchedules[];
  loaded: boolean;
  query?: ScheduledJobsQuery;
  meta?: DataServiceMetadata;
}

const initialState = () => ({
  loaded: false,
  scheduledJobSchedules: []
});

@State<ScheduledJobSchedulesStateModel>({
  name: 'ScheduledJobSchedules',
  defaults: initialState()
})

@Injectable()
export class ScheduledJobsState {
  constructor(private store: Store, private cronService: CronService) {
  }

  @Selector()
  static isLoaded(state: ScheduledJobSchedulesStateModel) {
    return state.loaded;
  }

  @Selector()
  static getScheduledJobs(state: ScheduledJobSchedulesStateModel) {
    return state.scheduledJobSchedules;
  }

  @Selector()
  static getMetadata(state: ScheduledJobSchedulesStateModel) {
    return state.meta;
  }

  @Selector()
  static isEmpty(state: ScheduledJobSchedulesStateModel) {
    return state.loaded && state.scheduledJobSchedules.length === 0;
  }

  @Action(ScheduledJobsAction.GetScheduledJobSchedules, { cancelUncompleted: true })
  GetScheduledJobs(context: StateContext<ScheduledJobSchedulesStateModel>,
                   { queryParams }: ScheduledJobsAction.GetScheduledJobSchedules) {
    return this.cronService.getScheduledJobSchedules(queryParams).pipe(
      tap(({ data, meta }) => {
        const now = new Date();
        data.forEach(item => {
          if (item.finished) {
            item.status = 'finished';// 已结束
          } else {
            if (new Date(item.scheduleStartTime).getTime() <= now.getTime()) {
              item.status = 'processing';// 已开始
            } else {
              item.status = 'pending';// 未开始
            }
          }
        });
        const state = context.getState();
        context.setState({
          ...state,
          scheduledJobSchedules: data,
          query: queryParams,
          meta,
          loaded: true
        });
      })
    );
  }
}
