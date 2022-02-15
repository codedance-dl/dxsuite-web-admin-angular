import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';

import { User } from '@api/models';
import { ClearIdentity, SetIdentity, VerifyToken } from './auth.actions';
import { clearToken } from '@api';

export interface AuthStateModel {

  // 用来识别是否已验证 token 的有效期，这在初始化 APP 时直接访问需要验证的路由时有用。
  vertifed: boolean;

  // 身份
  identity: User | null;
}

const initialState = (): AuthStateModel => ({
  vertifed: false,
  identity: null
});

@State<AuthStateModel>({
  name: 'auth',
  defaults: initialState()
})
@Injectable()
export class AuthState implements NgxsOnInit {

  @Selector()
  static getIdentity(state: AuthStateModel) {
    return state.identity;
  }

  @Selector()
  static getPrivilege(state: AuthStateModel) {
    return (state.identity || {}).authorities;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.identity;
  }

  @Selector()
  static isVertifed(state: AuthStateModel) {
    return state.vertifed;
  }

  @Selector()
  static isEnforcePwdChange(state: AuthStateModel) {
    const { initial, expired } = state.identity.passwordStatus;
    return initial || expired;
  }

  @Action(SetIdentity)
  setIdentity(context: StateContext<AuthStateModel>, { user }: SetIdentity) {
    context.patchState({ vertifed: true, identity: user });
  }

  @Action(ClearIdentity)
  clearIdentity(context: StateContext<AuthStateModel>) {
    clearToken();
    context.patchState({ identity: null });
  }

  ngxsOnInit(context: StateContext<AuthStateModel>) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      context.dispatch(new VerifyToken());
    } else {
      context.dispatch(new SetIdentity(null));
    }
  }
}
