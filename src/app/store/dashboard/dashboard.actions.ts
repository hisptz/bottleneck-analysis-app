import {Action} from '@ngrx/store';
import {Dashboard} from './dashboard.state';
import {CurrentUserState} from '../current-user/current-user.state';

export enum DashboardActions {
  LOAD = '[Dashboard] Load dashboards',
  LOAD_SUCCESS = '[Dashboard] Load dashboards success',
  SET_CURRENT = '[Dashboard] Set current dashboard',
  CHANGE_CURRENT_PAGE = '[Dashboard] Change current dashboard page',
  CREATE = '[Dashboard] Create new dashboard',
  CREATE_SUCCESS = '[Dashboard] Dashboard create success',
  RENAME = '[Dashboard] Rename dashboard',
  RENAME_SUCCESS = '[Dashboard] Dashboard rename success',
}

export class LoadAction implements Action {
  readonly type = DashboardActions.LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = DashboardActions.LOAD_SUCCESS;
  constructor(public payload: {dashboards: Dashboard[], url: string, currentUser: CurrentUserState}) {}
}

export class SetCurrentAction implements Action {
  readonly type = DashboardActions.SET_CURRENT;
  constructor(public payload: string) {}
}

export class ChangeCurrentPageAction implements Action {
  readonly type = DashboardActions.CHANGE_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class CreateAction implements Action {
  readonly type = DashboardActions.CREATE;
  constructor(public payload: string) {}
}

export class CreateSuccessAction implements Action {
  readonly type = DashboardActions.CREATE_SUCCESS;
  constructor(public payload: Dashboard) {}
}

export class RenameAction implements Action {
  readonly type = DashboardActions.RENAME;
  constructor(public payload: {id: string, name: string}) {}
}

export class RenameSuccessAction implements Action {
  readonly type = DashboardActions.RENAME_SUCCESS;
  constructor(public payload: Dashboard) {}
}

export type DashboardAction = LoadAction | LoadSuccessAction
  | SetCurrentAction | ChangeCurrentPageAction | CreateAction | CreateSuccessAction
  | RenameAction | RenameSuccessAction;
