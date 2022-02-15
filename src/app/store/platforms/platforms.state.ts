import { Injectable } from '@angular/core';
import { Action, createSelector, State, StateContext } from '@ngxs/store';

import { SetPlatforms } from './platforms.actions';

export interface PlatformStateModel {
  platforms: string[];
}

const initialState = (): string[] => [];

@State<string[]>({
  name: 'platforms',
  defaults: initialState()
})
@Injectable()
export class PlatformState {

  static isPlatform(platform: string) {
    return createSelector([PlatformState], (state: string[]) => state.includes(platform));
  }

  @Action(SetPlatforms)
  setPlatforms(context: StateContext<string[]>, { platforms }: SetPlatforms) {
    context.setState(platforms);
  }
}
