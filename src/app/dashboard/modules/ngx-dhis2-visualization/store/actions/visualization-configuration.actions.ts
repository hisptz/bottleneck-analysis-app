import { Action } from '@ngrx/store';
import { VisualizationConfig } from '../../models';

export enum VisualizationConfigurationActionTypes {
  ADD_VISUALIZATION_CONFIGURATION = '[VisualizationConfig] Add visualization configuration',
  UPDATE_VISUALIZATION_CONFIGURATION = '[VisualizationConfig] Update visualization configuration',
  RemoveVisualizationConfiguration = '[VisualizationConfig] Remove visualization configuration'
}

export class AddVisualizationConfigurationAction implements Action {
  readonly type =
    VisualizationConfigurationActionTypes.ADD_VISUALIZATION_CONFIGURATION;
  constructor(public visualizationConfiguration: VisualizationConfig) {}
}

export class UpdateVisualizationConfigurationAction implements Action {
  readonly type =
    VisualizationConfigurationActionTypes.UPDATE_VISUALIZATION_CONFIGURATION;
  constructor(
    public id: string,
    public changes: Partial<VisualizationConfig>
  ) {}
}

export class RemoveVisualizationConfigurationAction implements Action {
  readonly type =
    VisualizationConfigurationActionTypes.RemoveVisualizationConfiguration;
  constructor(public id: string) {}
}

export type VisualizationConfigurationAction =
  | AddVisualizationConfigurationAction
  | UpdateVisualizationConfigurationAction
  | RemoveVisualizationConfigurationAction;
