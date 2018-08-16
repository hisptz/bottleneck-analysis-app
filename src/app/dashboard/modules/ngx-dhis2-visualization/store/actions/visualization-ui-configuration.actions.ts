import { Action } from '@ngrx/store';
import { VisualizationUiConfig } from '../../models';

export enum VisualizationUiConfigurationActionTypes {
  AddVisualizationUiConfigurations = '[VisualizationUIConfig] Add all visualization Ui configurations',
  ADD_VISUALIZATION_UI_CONFIGURATION = '[VisualizationUIConfig] Add visualization Ui configuration',
  SHOW_OR_HIDE_VISUALIZATION_BODY = '[VisualizationUIConfig] show or hide visualization body',
  TOGGLE_FULL_SCREEN = '[VisualizationUIConfig] toggle full screen',
  TOGGLE_VISUALIZATION_FOCUS = '[VisualizationUIConfig] toggle visualization focus',
  RemoveVisualizationUiConfiguration = '[VisualizationUIConfig] Remove visualization Ui configuration'
}

export class AddVisualizationUiConfigurationAction implements Action {
  readonly type =
    VisualizationUiConfigurationActionTypes.ADD_VISUALIZATION_UI_CONFIGURATION;

  constructor(public visualizationUiConfiguration: VisualizationUiConfig) {}
}

export class AddVisualizationUiConfigurationsAction implements Action {
  readonly type =
    VisualizationUiConfigurationActionTypes.AddVisualizationUiConfigurations;

  constructor(public visualizationUiConfigurations: VisualizationUiConfig[]) {}
}

export class ShowOrHideVisualizationBodyAction implements Action {
  readonly type =
    VisualizationUiConfigurationActionTypes.SHOW_OR_HIDE_VISUALIZATION_BODY;

  constructor(
    public id: string,
    public changes: Partial<VisualizationUiConfig>
  ) {}
}

export class ToggleFullScreenAction implements Action {
  readonly type = VisualizationUiConfigurationActionTypes.TOGGLE_FULL_SCREEN;

  constructor(public id: string) {}
}

export class ToggleVisualizationFocusAction implements Action {
  readonly type =
    VisualizationUiConfigurationActionTypes.TOGGLE_VISUALIZATION_FOCUS;
  constructor(
    public id: string,
    public changes: Partial<VisualizationUiConfig>
  ) {}
}

export class RemoveVisualizationUiConfigurationAction implements Action {
  readonly type =
    VisualizationUiConfigurationActionTypes.RemoveVisualizationUiConfiguration;
  constructor(public id: string) {}
}

export type VisualizationUiConfigurationAction =
  | AddVisualizationUiConfigurationsAction
  | AddVisualizationUiConfigurationAction
  | ShowOrHideVisualizationBodyAction
  | ToggleFullScreenAction
  | ToggleVisualizationFocusAction
  | RemoveVisualizationUiConfigurationAction;
