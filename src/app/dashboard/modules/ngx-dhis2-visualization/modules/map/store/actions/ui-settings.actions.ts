import { Action } from '@ngrx/store';
import { LegendSet } from '../../models/legendSet-config.model';

export enum UiSettingsActionTypes {
  SET_CURRENT_LEGEND_SELECTION = '[Map] Set current legendSet Selection Type',
  SET_CURRENT_LEGENDSET = '[Map] Set current LegendSet'
}

export class SetCurrentLegendSeletionType implements Action {
  readonly type = UiSettingsActionTypes.SET_CURRENT_LEGEND_SELECTION;
  constructor(public legendSetConfigType: string) {}
}

export class SetCurrentLegendSet implements Action {
  readonly type = UiSettingsActionTypes.SET_CURRENT_LEGENDSET;
  constructor(public legendSet: LegendSet) {}
}

// action types
export type UiSettingActions = SetCurrentLegendSeletionType | SetCurrentLegendSet;
