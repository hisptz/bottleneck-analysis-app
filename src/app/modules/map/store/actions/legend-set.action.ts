import { Action } from '@ngrx/store';
import { LegendSet } from '../../models/Legend-set.model';

// add Context Path
export const ADD_LEGEND_SET = '[MAP] Add Legend Set';
export const ADD_LEGEND_SET_FAIL = '[MAP] Add Legend Set Fail';
export const ADD_LEGEND_SET_SUCCESS = '[MAP] Add Legend Set Success';
export const UPDATE_LEGEND_SET = '[MAP] Add Legend Set';
export const UPDATE_LEGEND_SET_FAIL = '[MAP] Add Legend Set Fail';
export const UPDATE_LEGEND_SET_SUCCESS = '[MAP] Add Legend Set Success';

export class AddLegendSet implements Action {
  readonly type = ADD_LEGEND_SET;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class AddLegendSetFail implements Action {
  readonly type = ADD_LEGEND_SET_FAIL;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class AddLegendSetSuccess implements Action {
  readonly type = ADD_LEGEND_SET_SUCCESS;
  // TODO: add Legend Set data casting;
  constructor(public payload: LegendSet) {}
}

export class UpdateLegendSet implements Action {
  readonly type = ADD_LEGEND_SET;
  // TODO: add Legend Set data casting;
  constructor(public payload: LegendSet) {}
}

export class UpdateLegendSetFail implements Action {
  readonly type = ADD_LEGEND_SET_FAIL;
  // TODO: add Legend Set data casting;
  constructor(public payload: any) {}
}

export class UpdateLegendSetSuccess implements Action {
  readonly type = ADD_LEGEND_SET_SUCCESS;
  // TODO: add Legend Set data casting;
  constructor(public payload: LegendSet) {}
}

export type LegendSetAction =
  | AddLegendSet
  | AddLegendSetFail
  | AddLegendSetSuccess
  | UpdateLegendSet
  | UpdateLegendSetFail
  | UpdateLegendSetSuccess;
