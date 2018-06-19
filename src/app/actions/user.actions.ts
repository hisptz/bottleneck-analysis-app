import { Action } from '@ngrx/store';
import { User } from '../models/user.model';
import { ErrorMessage } from '../models/error-message.model';

export enum UserActionTypes {
  LoadCurrentUser = '[User] Load current User',
  AddCurrentUser = '[User] Add Current User',
  LoadCurrentUserFail = '[User] Load Current User fail'
}

export class LoadCurrentUser implements Action {
  readonly type = UserActionTypes.LoadCurrentUser;
}

export class AddCurrentUser implements Action {
  readonly type = UserActionTypes.AddCurrentUser;

  constructor(public currentUser: User) {
  }
}

export class LoadCurrentUserFail implements Action {
  readonly type = UserActionTypes.LoadCurrentUserFail;

  constructor(public error: ErrorMessage) {
  }
}

export type UserActions =
  | LoadCurrentUser
  | AddCurrentUser
  | LoadCurrentUserFail;
