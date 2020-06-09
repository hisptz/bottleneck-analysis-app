import { Action } from '@ngrx/store';
import { IndicatorGroupsState } from '../state/indicators.state';

export enum IndicatorsActions {
  LoadIndicators = '[Indicators] Load indicators',
  LoadIndicatorsSuccess = '[Indicators] Load indicators success',
  LoadProgramIndicators = '[Program Indicators] Load program indicators',
  LoadProgramIndicatorsSuccess = '[Program Indicators] Load program indicators success',
  LoadIndicatorsFail = '[Indicators] Load indicators fail',
  LoadIndicatorsByPages = '[Indicators] Load indicators by pages',
  LoadIndicatorsByPagesSuccess = '[Indicators] Load indicators by pages success',
  LoadProgramIndicatorsByPagesSuccess = '[Program Indicators] Load program indicators by pages success',
  LoadIndicatorsByPagesFail = '[Indicators] Load indicators by pages fail',
  ProgressLoadingIndicators = '[Progress bar] progress bar for loaded indicators',
  LoadIndicatorProperties = '[Indicator properties] Load indicator properties',
  LoadIndicatorPropertiesFail = '[Indicator properties] Load indicator properties fail',
  LoadIndicatorPropertiesSuccess = '[Indicator properties] Load indicator properties success',
  LoadIndicatorGroups = '[Indicator Groups] Load indicator Groups',
  LoadIndicatorGroupsSuccess = '[Indicator Groups] Load indicator Groups success',
  LoadIndicatorGroupsFail = '[Indicator Groups] Load indicator Groups fail',
  LoadProgramIndicatorGroups = '[Program indicator groups] load program indicator groups',
  LoadProgramIndicatorGroupsSuccess = '[Program indicator groups] load program indicator groups success',
  LoadProgramIndicatorGroupsFail = '[Program indicator groups] load program indicator groups fail'
}

export class loadIndicatorsAction implements Action {
  readonly type = IndicatorsActions.LoadIndicators;
}

export class loadIndicatorsSuccessAction implements Action {
  readonly type = IndicatorsActions.LoadIndicatorsSuccess;

  constructor(public payload: any) {}
}

export class loadProgramIndicatorsAction implements Action {
  readonly type = IndicatorsActions.LoadProgramIndicators;
}

export class loadProgramIndicatorsSuccessAction implements Action {
  readonly type = IndicatorsActions.LoadProgramIndicatorsSuccess;

  constructor(public payload: any) {}
}

export class loadIndicatorsFailAction implements Action {
  readonly type = IndicatorsActions.LoadIndicatorsFail;

  constructor(public payload: any) {}
}

export class LoadIndicatorsByPagesAction implements Action {
  readonly type = IndicatorsActions.LoadIndicatorsByPages;

  constructor(public payload: any) {}
}

export class LoadIndicatorsByPagesSuccessAction implements Action {
  readonly type = IndicatorsActions.LoadIndicatorsByPagesSuccess;

  constructor(public payload: any) {}
}

export class LoadProgramIndicatorsByPagesSuccessAction implements Action {
  readonly type = IndicatorsActions.LoadProgramIndicatorsByPagesSuccess;

  constructor(public payload: any) {}
}

export class LoadIndicatorsByPagesFailAction implements Action {
  readonly type = IndicatorsActions.LoadIndicatorsByPagesFail;

  constructor(public payload: any) {}
}

export class LoadIndicatorGroupsAction implements Action {
  readonly type = IndicatorsActions.LoadIndicatorGroups;
}

export class LoadIndicatorGroupsSuccessAction implements Action {
  readonly type = IndicatorsActions.LoadIndicatorGroupsSuccess;

  constructor(public payload: IndicatorGroupsState) {}
}

export class LoadIndicatorGroupsFailAction implements Action {
  readonly type = IndicatorsActions.LoadIndicatorsByPagesFail;

  constructor(public payload: any) {}
}

export class LoadProgramIndicatorGroupsAction implements Action {
  readonly type = IndicatorsActions.LoadProgramIndicatorGroups;
}

export class LoadProgramIndicatorGroupsSuccessAction implements Action {
  readonly type = IndicatorsActions.LoadProgramIndicatorGroupsSuccess;
  constructor(public payload: any) {}
}

export class LoadProgramIndicatorGroupsFailAction implements Action {
  readonly type = IndicatorsActions.LoadProgramIndicatorGroupsFail;
  constructor(public payload: any) {}
}

export type IndicatorsAction =
  | loadIndicatorsAction
  | loadIndicatorsFailAction
  | loadIndicatorsSuccessAction
  | loadProgramIndicatorsAction
  | loadProgramIndicatorsSuccessAction
  | LoadIndicatorsByPagesAction
  | LoadIndicatorsByPagesFailAction
  | LoadIndicatorsByPagesSuccessAction
  | LoadProgramIndicatorsByPagesSuccessAction
  | LoadIndicatorGroupsAction
  | LoadIndicatorGroupsSuccessAction
  | LoadIndicatorGroupsFailAction
  | LoadProgramIndicatorGroupsAction
  | LoadProgramIndicatorGroupsSuccessAction
  | LoadProgramIndicatorGroupsFailAction;
