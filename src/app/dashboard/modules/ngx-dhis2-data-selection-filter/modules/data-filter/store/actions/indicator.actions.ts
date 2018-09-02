import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Indicator } from '../../models/indicator.model';

export enum IndicatorActionTypes {
  LoadIndicators = '[Indicator] Load Indicators',
  LoadIndicatorsFail = '[Indicator] Load Indicators fail',
  LoadIndicatorsInitiated = '[Indicator] Load Indicators initiate',
  AddIndicator = '[Indicator] Add Indicator',
  UpsertIndicator = '[Indicator] Upsert Indicator',
  AddIndicators = '[Indicator] Add Indicators',
  UpsertIndicators = '[Indicator] Upsert Indicators',
  UpdateIndicator = '[Indicator] Update Indicator',
  UpdateIndicators = '[Indicator] Update Indicators',
  DeleteIndicator = '[Indicator] Delete Indicator',
  DeleteIndicators = '[Indicator] Delete Indicators',
  ClearIndicators = '[Indicator] Clear Indicators'
}

export class LoadIndicators implements Action {
  readonly type = IndicatorActionTypes.LoadIndicators;
}

export class LoadIndicatorsInitiated implements Action {
  readonly type = IndicatorActionTypes.LoadIndicatorsInitiated;
}

export class LoadIndicatorsFail implements Action {
  readonly type = IndicatorActionTypes.LoadIndicatorsFail;
  constructor(public error: any) {}
}

export class AddIndicator implements Action {
  readonly type = IndicatorActionTypes.AddIndicator;

  constructor(public payload: { indicator: Indicator }) {}
}

export class UpsertIndicator implements Action {
  readonly type = IndicatorActionTypes.UpsertIndicator;

  constructor(public payload: { indicator: Indicator }) {}
}

export class AddIndicators implements Action {
  readonly type = IndicatorActionTypes.AddIndicators;

  constructor(public indicators: Indicator[]) {}
}

export class UpsertIndicators implements Action {
  readonly type = IndicatorActionTypes.UpsertIndicators;

  constructor(public payload: { indicators: Indicator[] }) {}
}

export class UpdateIndicator implements Action {
  readonly type = IndicatorActionTypes.UpdateIndicator;

  constructor(public payload: { indicator: Update<Indicator> }) {}
}

export class UpdateIndicators implements Action {
  readonly type = IndicatorActionTypes.UpdateIndicators;

  constructor(public payload: { indicators: Update<Indicator>[] }) {}
}

export class DeleteIndicator implements Action {
  readonly type = IndicatorActionTypes.DeleteIndicator;

  constructor(public payload: { id: string }) {}
}

export class DeleteIndicators implements Action {
  readonly type = IndicatorActionTypes.DeleteIndicators;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearIndicators implements Action {
  readonly type = IndicatorActionTypes.ClearIndicators;
}

export type IndicatorActions =
  | LoadIndicators
  | LoadIndicatorsInitiated
  | LoadIndicatorsFail
  | AddIndicator
  | UpsertIndicator
  | AddIndicators
  | UpsertIndicators
  | UpdateIndicator
  | UpdateIndicators
  | DeleteIndicator
  | DeleteIndicators
  | ClearIndicators;
