import {Action} from '@ngrx/store';
import {Dashboard, DashboardMenuItem} from './dashboard.state';
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
  DELETE = '[Dashboard] Delete dashboard',
  DELETE_SUCCESS = '[Dashboard] Dashboard delete success',
  COMMIT_DELETE = '[Dashboard] Permanently remove dashboard from the list',
  CHANGE_PAGE_ITEMS = '[Dashboard] Change number of item per dashboard pages in the menu',
  HIDE_MENU_NOTIFICATION_ICON = '[Dashboard] Hide menu notification icons'
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

export class DeleteAction implements Action {
  readonly type = DashboardActions.DELETE;
  constructor(public payload: string) {}
}

export class DeleteSuccessAction implements Action {
  readonly type = DashboardActions.DELETE_SUCCESS;
  constructor(public payload: any) {}
}

export class CommitDeleteAction  implements Action {
  readonly type =   DashboardActions.COMMIT_DELETE;
  constructor(public payload: string) {}
}

export class ChangePageItemsAction implements Action {
  readonly type = DashboardActions.CHANGE_PAGE_ITEMS;
  constructor(public payload: number) {}
}

export class HideMenuNotificationIconAction implements Action {
  readonly type = DashboardActions.HIDE_MENU_NOTIFICATION_ICON;
  constructor(public payload: DashboardMenuItem) {}
}

export type DashboardAction = LoadAction | LoadSuccessAction
  | SetCurrentAction | ChangeCurrentPageAction | CreateAction | CreateSuccessAction
  | RenameAction | RenameSuccessAction | DeleteAction | DeleteSuccessAction | CommitDeleteAction
  | ChangePageItemsAction | HideMenuNotificationIconAction;
