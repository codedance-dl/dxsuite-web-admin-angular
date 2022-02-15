/* eslint-disable @typescript-eslint/naming-convention */
import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CronService } from '@api';
import {
  DataServiceMetadata,
  ScheduledJobExecutions,
  ScheduledJobExecutionsQuery
} from '@api/models';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

import { ScheduledJobExecutionsAction } from './scheduled-jobs-executions.actions';

export interface ScheduledJobExecutionsStateModel {
  scheduledJobExecutions: ScheduledJobExecutions[];
  loaded: boolean;
  query?: ScheduledJobExecutionsQuery;
  meta?: DataServiceMetadata;
}

const initialState = () => ({
  loaded: false,
  scheduledJobExecutions: [],
});

@State<ScheduledJobExecutionsStateModel>({
  name: 'ScheduledJobExecutions',
  defaults: initialState()
})
@Injectable()
export class ScheduledJobExecutionsState {
  constructor(private store: Store, private cronService: CronService) {}

  @Selector()
  static isLoaded(state: ScheduledJobExecutionsStateModel) {
    return state.loaded;
  }

  @Selector()
  static getScheduledJobExecutions(state: ScheduledJobExecutionsStateModel) {
    return state.scheduledJobExecutions;
  }

  @Selector()
  static getMetadata(state: ScheduledJobExecutionsStateModel) {
    return state.meta;
  }

  @Selector()
  static isEmpty(state: ScheduledJobExecutionsStateModel) {
    return state.loaded && state.scheduledJobExecutions.length === 0;
  }

  @Action(ScheduledJobExecutionsAction.GetScheduledJobExecutions, { cancelUncompleted: true })
  GetScheduledJobExecutions(context: StateContext<ScheduledJobExecutionsStateModel>,
                            { queryParams }: ScheduledJobExecutionsAction.GetScheduledJobExecutions) {
    return this.cronService.getScheduledJobExecutions(queryParams).pipe(
      tap(({ data, meta }) => {
        const state = context.getState();
        context.setState({
          ...state,
          scheduledJobExecutions: data,
          query: queryParams,
          meta,
          loaded: true
        });
      })
    );
  }
}
