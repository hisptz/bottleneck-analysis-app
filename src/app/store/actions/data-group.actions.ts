import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import * as fromModels from '../../models';
import { DashboardSettings } from '../../dashboard/models/dashboard-settings.model';
import { User } from '@iapps/ngx-dhis2-http-client';

export enum DataGroupActionTypes {
  LoadDataGroupsInitiated = '[DataGroup] Load Data Groups initiated',
  LoadDataGroups = '[DataGroup] Load DataGroups',
  LoadDataGroupsFail = '[DataGroup] Load DataGroups fail',
  AddDataGroup = '[DataGroup] Add DataGroup',
  UpsertDataGroup = '[DataGroup] Upsert DataGroup',
  AddDataGroups = '[DataGroup] Add DataGroups',
  UpsertDataGroups = '[DataGroup] Upsert DataGroups',
  UpdateDataGroup = '[DataGroup] Update DataGroup',
  UpdateDataGroups = '[DataGroup] Update DataGroups',
  DeleteDataGroup = '[DataGroup] Delete DataGroup',
  DeleteDataGroups = '[DataGroup] Delete DataGroups',
  ClearDataGroups = '[DataGroup] Clear DataGroups',
}

export class LoadDataGroupsInitiated implements Action {
  readonly type = DataGroupActionTypes.LoadDataGroupsInitiated;
}

export class LoadDataGroups implements Action {
  readonly type = DataGroupActionTypes.LoadDataGroups;
  constructor(
    public dashboardSettings: DashboardSettings,
    public currentUser: User,
    public systemInfo: fromModels.SystemInfo
  ) {}
}

export class AddDataGroup implements Action {
  readonly type = DataGroupActionTypes.AddDataGroup;

  constructor(public payload: { dataGroup: fromModels.Determinant }) {}
}

export class UpsertDataGroup implements Action {
  readonly type = DataGroupActionTypes.UpsertDataGroup;

  constructor(public payload: { dataGroup: fromModels.Determinant }) {}
}

export class AddDataGroups implements Action {
  readonly type = DataGroupActionTypes.AddDataGroups;

  constructor(
    public dataGroups: fromModels.Determinant[],
    public dashboardSettings: DashboardSettings,
    public currentUser: User,
    public systemInfo: fromModels.SystemInfo
  ) {}
}

export class UpsertDataGroups implements Action {
  readonly type = DataGroupActionTypes.UpsertDataGroups;

  constructor(public payload: { dataGroups: fromModels.Determinant[] }) {}
}

export class UpdateDataGroup implements Action {
  readonly type = DataGroupActionTypes.UpdateDataGroup;

  constructor(public payload: { dataGroup: Update<fromModels.Determinant> }) {}
}

export class UpdateDataGroups implements Action {
  readonly type = DataGroupActionTypes.UpdateDataGroups;

  constructor(
    public payload: { dataGroups: Update<fromModels.Determinant>[] }
  ) {}
}

export class DeleteDataGroup implements Action {
  readonly type = DataGroupActionTypes.DeleteDataGroup;

  constructor(public payload: { id: string }) {}
}

export class DeleteDataGroups implements Action {
  readonly type = DataGroupActionTypes.DeleteDataGroups;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearDataGroups implements Action {
  readonly type = DataGroupActionTypes.ClearDataGroups;
}

export class LoadDataGroupsFail implements Action {
  readonly type = DataGroupActionTypes.LoadDataGroupsFail;
  constructor(public error: any) {}
}

export type DataGroupActions =
  | LoadDataGroups
  | LoadDataGroupsInitiated
  | LoadDataGroupsFail
  | AddDataGroup
  | UpsertDataGroup
  | AddDataGroups
  | UpsertDataGroups
  | UpdateDataGroup
  | UpdateDataGroups
  | DeleteDataGroup
  | DeleteDataGroups
  | ClearDataGroups;
