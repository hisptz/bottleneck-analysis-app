import { Action } from '@ngrx/store';
import { SharingItem } from '../../models';

export enum SharingItemActionTypes {
  AddSharingItems = '[SharingItem] Add sharing items',
  UpsertSharingItem = '[SharingItem] Upsert sharing item',
  RemoveSharingItem = '[SharingItem] Remove sharing item'
}

export class AddSharingItemsAction implements Action {
  readonly type = SharingItemActionTypes.AddSharingItems;
  constructor(public sharingItems: any[]) {}
}

export class UpsertSharingItemAction implements Action {
  readonly type = SharingItemActionTypes.UpsertSharingItem;
  constructor(
    public sharingItem: SharingItem,
    public sharingFilterId: string,
    public sharingType: string
  ) {}
}

export class RemoveSharingItemAction implements Action {
  readonly type = SharingItemActionTypes.RemoveSharingItem;
  constructor(
    public sharingItemId: string,
    public sharingFilterId: string,
    public sharingType: string
  ) {}
}

export type SharingItemActions =
  | AddSharingItemsAction
  | UpsertSharingItemAction
  | RemoveSharingItemAction;
