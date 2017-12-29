import {Action} from '@ngrx/store';
import {CurrentUserState} from './current-user.state';

export enum CurrentUserActions {
  LOAD = '[Current User] Load current user',
  LOAD_SUCCESS = '[Current User] Load current user success'
}

export class LoadAction implements Action {
  readonly type = CurrentUserActions.LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = CurrentUserActions.LOAD_SUCCESS;

  constructor(public payload: CurrentUserState) {
  }
}

export type CurrentUserAction = LoadAction | LoadSuccessAction;
