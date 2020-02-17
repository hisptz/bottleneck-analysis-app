import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import * as fromModels from '../../models';
import { DashboardSettings } from '../../dashboard/models/dashboard-settings.model';
import { User } from '@iapps/ngx-dhis2-http-client';

export enum DeterminantActionTypes {
  LoadDeterminantsInitiated = '[Determinant] Load Data Groups initiated',
  LoadDeterminants = '[Determinant] Load Determinants',
  LoadDeterminantsFail = '[Determinant] Load Determinants fail',
  AddDeterminant = '[Determinant] Add Determinant',
  UpsertDeterminant = '[Determinant] Upsert Determinant',
  AddDeterminants = '[Determinant] Add Determinants',
  UpsertDeterminants = '[Determinant] Upsert Determinants',
  UpdateDeterminant = '[Determinant] Update Determinant',
  UpdateDeterminants = '[Determinant] Update Determinants',
  DeleteDeterminant = '[Determinant] Delete Determinant',
  DeleteDeterminants = '[Determinant] Delete Determinants',
  ClearDeterminants = '[Determinant] Clear Determinants',
}

export class LoadDeterminantsInitiated implements Action {
  readonly type = DeterminantActionTypes.LoadDeterminantsInitiated;
}

export class LoadDeterminants implements Action {
  readonly type = DeterminantActionTypes.LoadDeterminants;
  constructor(
    public dashboardSettings: DashboardSettings,
    public currentUser: User,
    public systemInfo: fromModels.SystemInfo
  ) {}
}

export class AddDeterminant implements Action {
  readonly type = DeterminantActionTypes.AddDeterminant;

  constructor(public payload: { determinant: fromModels.Determinant }) {}
}

export class UpsertDeterminant implements Action {
  readonly type = DeterminantActionTypes.UpsertDeterminant;

  constructor(public payload: { determinant: fromModels.Determinant }) {}
}

export class AddDeterminants implements Action {
  readonly type = DeterminantActionTypes.AddDeterminants;

  constructor(
    public determinants: fromModels.Determinant[],
    public dashboardSettings: DashboardSettings,
    public currentUser: User,
    public systemInfo: fromModels.SystemInfo
  ) {}
}

export class UpsertDeterminants implements Action {
  readonly type = DeterminantActionTypes.UpsertDeterminants;

  constructor(public payload: { determinants: fromModels.Determinant[] }) {}
}

export class UpdateDeterminant implements Action {
  readonly type = DeterminantActionTypes.UpdateDeterminant;

  constructor(
    public payload: { determinant: Update<fromModels.Determinant> }
  ) {}
}

export class UpdateDeterminants implements Action {
  readonly type = DeterminantActionTypes.UpdateDeterminants;

  constructor(
    public payload: { determinants: Update<fromModels.Determinant>[] }
  ) {}
}

export class DeleteDeterminant implements Action {
  readonly type = DeterminantActionTypes.DeleteDeterminant;

  constructor(public payload: { id: string }) {}
}

export class DeleteDeterminants implements Action {
  readonly type = DeterminantActionTypes.DeleteDeterminants;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearDeterminants implements Action {
  readonly type = DeterminantActionTypes.ClearDeterminants;
}

export class LoadDeterminantsFail implements Action {
  readonly type = DeterminantActionTypes.LoadDeterminantsFail;
  constructor(public error: any) {}
}

export type DeterminantActions =
  | LoadDeterminants
  | LoadDeterminantsInitiated
  | LoadDeterminantsFail
  | AddDeterminant
  | UpsertDeterminant
  | AddDeterminants
  | UpsertDeterminants
  | UpdateDeterminant
  | UpdateDeterminants
  | DeleteDeterminant
  | DeleteDeterminants
  | ClearDeterminants;
