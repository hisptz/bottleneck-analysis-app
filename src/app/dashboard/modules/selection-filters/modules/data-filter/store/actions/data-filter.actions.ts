import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { DataFilter } from '../../models/data-filter.model';

export enum DataFilterActionTypes {
  LoadDataFilters = '[DataFilter] Load DataFilters',
  AddDataFilter = '[DataFilter] Add DataFilter',
  UpsertDataFilter = '[DataFilter] Upsert DataFilter',
  AddDataFilters = '[DataFilter] Add DataFilters',
  UpsertDataFilters = '[DataFilter] Upsert DataFilters',
  UpdateDataFilter = '[DataFilter] Update DataFilter',
  UpdateDataFilters = '[DataFilter] Update DataFilters',
  DeleteDataFilter = '[DataFilter] Delete DataFilter',
  DeleteDataFilters = '[DataFilter] Delete DataFilters',
  ClearDataFilters = '[DataFilter] Clear DataFilters',
  UpdateActiveDataFilterSelections = '[DataFilter] Update active data filter selections',
  SetCurrentDataFilterGroup = '[DataFilter] Set current data filter group'
}

export class LoadDataFilters implements Action {
  readonly type = DataFilterActionTypes.LoadDataFilters;
}

export class AddDataFilter implements Action {
  readonly type = DataFilterActionTypes.AddDataFilter;

  constructor(public payload: { dataFilter: DataFilter }) {}
}

export class UpsertDataFilter implements Action {
  readonly type = DataFilterActionTypes.UpsertDataFilter;

  constructor(public payload: { dataFilter: DataFilter }) {}
}

export class AddDataFilters implements Action {
  readonly type = DataFilterActionTypes.AddDataFilters;

  constructor(public payload: { dataFilters: DataFilter[] }) {}
}

export class UpsertDataFilters implements Action {
  readonly type = DataFilterActionTypes.UpsertDataFilters;

  constructor(public payload: { dataFilters: DataFilter[] }) {}
}

export class UpdateDataFilter implements Action {
  readonly type = DataFilterActionTypes.UpdateDataFilter;

  constructor(public payload: { dataFilter: Update<DataFilter> }) {}
}

export class UpdateDataFilters implements Action {
  readonly type = DataFilterActionTypes.UpdateDataFilters;

  constructor(public payload: { dataFilters: Update<DataFilter>[] }) {}
}

export class DeleteDataFilter implements Action {
  readonly type = DataFilterActionTypes.DeleteDataFilter;

  constructor(public payload: { id: string }) {}
}

export class DeleteDataFilters implements Action {
  readonly type = DataFilterActionTypes.DeleteDataFilters;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearDataFilters implements Action {
  readonly type = DataFilterActionTypes.ClearDataFilters;
}

export class UpdateActiveDataFilterSelections implements Action {
  readonly type = DataFilterActionTypes.UpdateActiveDataFilterSelections;
  constructor(public dataFilterSelections: any[]) {}
}

export class SetCurrentDataFilterGroup implements Action {
  readonly type = DataFilterActionTypes.SetCurrentDataFilterGroup;
  constructor(public dataFilterGroupId: string) {}
}

export type DataFilterActions =
  | LoadDataFilters
  | AddDataFilter
  | UpsertDataFilter
  | AddDataFilters
  | UpsertDataFilters
  | UpdateDataFilter
  | UpdateDataFilters
  | DeleteDataFilter
  | DeleteDataFilters
  | ClearDataFilters
  | UpdateActiveDataFilterSelections
  | SetCurrentDataFilterGroup;
