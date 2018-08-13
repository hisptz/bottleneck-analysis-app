import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

// models
import { VisualizationUiConfig } from '../../models';

// actions
import {
  VisualizationUiConfigurationAction,
  VisualizationUiConfigurationActionTypes
} from '../actions';
import { convertVerticalHeightToPixel } from '../../helpers/convert-vertical-height-to-pixel.helper';

export interface VisualizationUiConfigurationState
  extends EntityState<VisualizationUiConfig> {}

export const visualizationUiConfigurationAdapter: EntityAdapter<
  VisualizationUiConfig
> = createEntityAdapter<VisualizationUiConfig>();

const initialState: VisualizationUiConfigurationState = visualizationUiConfigurationAdapter.getInitialState(
  {}
);

export function visualizationUiConfigurationReducer(
  state: VisualizationUiConfigurationState = initialState,
  action: VisualizationUiConfigurationAction
): VisualizationUiConfigurationState {
  switch (action.type) {
    case VisualizationUiConfigurationActionTypes.ADD_ALL_VISUALIZATION_UI_CONFIGURATIONS:
      return visualizationUiConfigurationAdapter.addAll(
        action.visualizationUiConfigurations,
        state
      );
    case VisualizationUiConfigurationActionTypes.ADD_VISUALIZATION_UI_CONFIGURATION:
      return visualizationUiConfigurationAdapter.upsertOne(
        action.visualizationUiConfiguration,
        state
      );
    case VisualizationUiConfigurationActionTypes.SHOW_OR_HIDE_VISUALIZATION_BODY:
    case VisualizationUiConfigurationActionTypes.TOGGLE_VISUALIZATION_FOCUS:
      return visualizationUiConfigurationAdapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    case VisualizationUiConfigurationActionTypes.TOGGLE_FULL_SCREEN:
      const visualizationUiConfig = state.entities[action.id];
      return visualizationUiConfig
        ? visualizationUiConfigurationAdapter.updateOne(
            {
              id: action.id,
              changes: {
                fullScreen: !visualizationUiConfig.fullScreen,
                height: visualizationUiConfig.fullScreen ? '450px' : '99vh'
              }
            },
            state
          )
        : state;
    case VisualizationUiConfigurationActionTypes.RemoveVisualizationUiConfiguration: {
      return visualizationUiConfigurationAdapter.removeOne(action.id, state);
    }
  }
  return state;
}
