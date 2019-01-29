import { Action } from '@ngrx/store';
import { SharingFilter, SharingItem } from '../../models';

export enum SharingFilterActionTypes {
  LoadSharingFilterItem = '[SharingFilter] Load sharing filter item',
  LoadSharingFilterItemFail = '[SharingFilter] load sharing filter item fail',
  AddSharingFilterItem = '[SharingFilter] Add sharing filter item',
  UpsertSharingFilterItem = '[SharingFilter] Upsert sharing filter item',
  SaveSharingFilterItem = '[SharingFilter] Save sharing filter item',
  SaveSharingFilterItemSuccess = '[SharingFilter] Save sharing filter item success',
  SaveSharingFilterItemFail = '[SharingFilter] Save sharing filter item fail'
}

export class LoadSharingFilterItemAction implements Action {
  readonly type = SharingFilterActionTypes.LoadSharingFilterItem;
  constructor(public id: string, public itemType: string) {}
}

export class AddSharingFilterItemAction implements Action {
  readonly type = SharingFilterActionTypes.AddSharingFilterItem;
  constructor(
    public sharingFilterItem: SharingFilter,
    public sharingItems: SharingItem[]
  ) {}
}

export class LoadSharingFilterItemFailAction implements Action {
  readonly type = SharingFilterActionTypes.LoadSharingFilterItemFail;
  constructor(public id: string, public error: any) {}
}

export class SaveSharingFilterItemAction implements Action {
  readonly type = SharingFilterActionTypes.SaveSharingFilterItem;
  constructor(public sharingFilterId: string, public sharingType: string) {}
}

export class SaveSharingFilterItemSuccessAction implements Action {
  readonly type = SharingFilterActionTypes.SaveSharingFilterItemSuccess;
  constructor(public sharingFilterId: string) {}
}

export class SaveSharingFilterItemFailAction implements Action {
  readonly type = SharingFilterActionTypes.SaveSharingFilterItemFail;
  constructor(public sharingFilterId: string, error: any) {}
}

export type SharingFilterActions =
  | LoadSharingFilterItemAction
  | LoadSharingFilterItemFailAction
  | AddSharingFilterItemAction
  | SaveSharingFilterItemAction
  | SaveSharingFilterItemSuccessAction
  | SaveSharingFilterItemFailAction;
