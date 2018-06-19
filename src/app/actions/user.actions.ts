import { Action } from '@ngrx/store';
import { User } from '../models/user.model';
import { ErrorMessage } from '../models/error-message.model';

export enum UserActionTypes {
  LoadCurrentUser = '[User] Load current User',
  LoadCurrentUserSuccess = '[User] Load Current User success',
  LoadCurrentUserFail = '[User] Load Current User fail'
}

export class LoadCurrentUser implements Action {
  readonly type = UserActionTypes.LoadCurrentUser;
}

export class LoadCurrentUserSuccess implements Action {
  readonly type = UserActionTypes.LoadCurrentUserSuccess;

  constructor(public payload: {user: User}) {
  }
}

export class LoadCurrentUserFail implements Action {
  readonly type = UserActionTypes.LoadCurrentUserFail;

  constructor(public payload: {error: ErrorMessage}) {
  }
}

export type UserActions =
  | LoadCurrentUser
  | LoadCurrentUserSuccess
  | LoadCurrentUserFail;
