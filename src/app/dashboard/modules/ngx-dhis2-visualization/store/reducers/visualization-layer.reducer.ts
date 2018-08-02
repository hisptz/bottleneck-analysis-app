import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

// models
import { VisualizationLayer } from '../../models';

// actions
import { VisualizationLayerActionTypes } from '../actions';

export interface VisualizationLayerState
  extends EntityState<VisualizationLayer> {}

export const visualizationLayerAdapter: EntityAdapter<
  VisualizationLayer
> = createEntityAdapter<VisualizationLayer>();

const initialState: VisualizationLayerState = visualizationLayerAdapter.getInitialState(
  {}
);

export function visualizationLayerReducer(
  state: VisualizationLayerState = initialState,
  action: any
): VisualizationLayerState {
  switch (action.type) {
    case VisualizationLayerActionTypes.ADD_VISUALIZATION_LAYER:
      return visualizationLayerAdapter.addOne(action.visualizationLayer, state);
    case VisualizationLayerActionTypes.UPDATE_VISUALIZATION_LAYER:
    case VisualizationLayerActionTypes.LOAD_VISUALIZATION_ANALYTICS_SUCCESS:
      return visualizationLayerAdapter.updateOne(
        { id: action.id, changes: action.changes },
        state
      );
    case VisualizationLayerActionTypes.ReplaceVisualizationLayerId: {
      return visualizationLayerAdapter.updateOne(
        { id: action.currentId, changes: { id: action.newId } },
        state
      );
    }
  }
  return state;
}
