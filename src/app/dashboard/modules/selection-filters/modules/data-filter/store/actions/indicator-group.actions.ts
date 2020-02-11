import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { IndicatorGroup } from '../../models/indicator-group.model';

export enum IndicatorGroupActionTypes {
  LoadIndicatorGroups = '[IndicatorGroup] Load IndicatorGroups',
  LoadIndicatorGroupsFail = '[IndicatorGroup] Load IndicatorGroups fail',
  LoadIndicatorGroupsInitiated = '[IndicatorGroup] Load IndicatorGroups initiated',
  AddIndicatorGroup = '[IndicatorGroup] Add IndicatorGroup',
  UpsertIndicatorGroup = '[IndicatorGroup] Upsert IndicatorGroup',
  AddIndicatorGroups = '[IndicatorGroup] Add IndicatorGroups',
  UpsertIndicatorGroups = '[IndicatorGroup] Upsert IndicatorGroups',
  UpdateIndicatorGroup = '[IndicatorGroup] Update IndicatorGroup',
  UpdateIndicatorGroups = '[IndicatorGroup] Update IndicatorGroups',
  DeleteIndicatorGroup = '[IndicatorGroup] Delete IndicatorGroup',
  DeleteIndicatorGroups = '[IndicatorGroup] Delete IndicatorGroups',
  ClearIndicatorGroups = '[IndicatorGroup] Clear IndicatorGroups'
}

export class LoadIndicatorGroups implements Action {
  readonly type = IndicatorGroupActionTypes.LoadIndicatorGroups;
}

export class LoadIndicatorGroupsInitiated implements Action {
  readonly type = IndicatorGroupActionTypes.LoadIndicatorGroupsInitiated;
}

export class LoadIndicatorGroupsFail implements Action {
  readonly type = IndicatorGroupActionTypes.LoadIndicatorGroupsFail;
  constructor(public error: any) {}
}

export class AddIndicatorGroup implements Action {
  readonly type = IndicatorGroupActionTypes.AddIndicatorGroup;

  constructor(public payload: { indicatorGroup: IndicatorGroup }) {}
}

export class UpsertIndicatorGroup implements Action {
  readonly type = IndicatorGroupActionTypes.UpsertIndicatorGroup;

  constructor(public payload: { indicatorGroup: IndicatorGroup }) {}
}

export class AddIndicatorGroups implements Action {
  readonly type = IndicatorGroupActionTypes.AddIndicatorGroups;

  constructor(public indicatorGroups: IndicatorGroup[]) {}
}

export class UpsertIndicatorGroups implements Action {
  readonly type = IndicatorGroupActionTypes.UpsertIndicatorGroups;

  constructor(public payload: { indicatorGroups: IndicatorGroup[] }) {}
}

export class UpdateIndicatorGroup implements Action {
  readonly type = IndicatorGroupActionTypes.UpdateIndicatorGroup;

  constructor(public payload: { indicatorGroup: Update<IndicatorGroup> }) {}
}

export class UpdateIndicatorGroups implements Action {
  readonly type = IndicatorGroupActionTypes.UpdateIndicatorGroups;

  constructor(public payload: { indicatorGroups: Update<IndicatorGroup>[] }) {}
}

export class DeleteIndicatorGroup implements Action {
  readonly type = IndicatorGroupActionTypes.DeleteIndicatorGroup;

  constructor(public payload: { id: string }) {}
}

export class DeleteIndicatorGroups implements Action {
  readonly type = IndicatorGroupActionTypes.DeleteIndicatorGroups;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearIndicatorGroups implements Action {
  readonly type = IndicatorGroupActionTypes.ClearIndicatorGroups;
}

export type IndicatorGroupActions =
  | LoadIndicatorGroups
  | LoadIndicatorGroupsInitiated
  | LoadIndicatorGroupsFail
  | AddIndicatorGroup
  | UpsertIndicatorGroup
  | AddIndicatorGroups
  | UpsertIndicatorGroups
  | UpdateIndicatorGroup
  | UpdateIndicatorGroups
  | DeleteIndicatorGroup
  | DeleteIndicatorGroups
  | ClearIndicatorGroups;
