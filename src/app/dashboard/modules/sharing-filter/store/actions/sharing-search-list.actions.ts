import { Action } from '@ngrx/store';
import { SharingSearchList } from '../../models/sharing-search-list.model';

export enum SharingSearchListActionTypes {
  LoadSharingSearchList = '[SharingSearchList] Load sharing search list',
  AddSharingSearchList = '[SharingSearchList] Add sharing search list',
  LoadSharingSearchListFail = '[SharingSearchList] Load sharing search list fail',
  InitiateLoadingSharingList = '[SharingSearchList] Initiate Loading sharing list',
}

export class LoadSharingSearchListAction implements Action {
  readonly type = SharingSearchListActionTypes.LoadSharingSearchList;
}

export class AddSharingSearchListAction implements Action {
  readonly type = SharingSearchListActionTypes.AddSharingSearchList;
  constructor(public sharingSearchList: SharingSearchList[]) {}
}

export class LoadSharingSearchListFailAction implements Action {
  readonly type = SharingSearchListActionTypes.LoadSharingSearchListFail;
  constructor(public error: any) {}
}

export class InitiateLoadingSharingListAction implements Action {
  readonly type = SharingSearchListActionTypes.InitiateLoadingSharingList;
}

export type SharingSearchListActions =
  | LoadSharingSearchListAction
  | AddSharingSearchListAction
  | LoadSharingSearchListFailAction
  | InitiateLoadingSharingListAction;
