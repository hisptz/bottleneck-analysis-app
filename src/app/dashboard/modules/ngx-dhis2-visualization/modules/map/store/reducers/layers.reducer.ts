import { LayerVisibility } from '../../models/layer.model';
import * as fromLayers from './../actions/layers.action';

export interface LayerVisibilityState {
  entities: { [id: string]: LayerVisibility };
}

export const initialState: LayerVisibilityState = {
  entities: {}
};

export function reducer(state = initialState, action: fromLayers.LayersAction): LayerVisibilityState {
  switch (action.type) {
    case fromLayers.INIT_LAYER_VISIBILITY_SETTINGS: {
      const { componentId, settings } = action.payload;
      const entities = {
        ...state.entities,
        ...{ [componentId]: settings }
      };
      return {
        ...state,
        entities
      };
    }

    case fromLayers.TOGGLE_LAYER_VISIBILITY_SETTINGS: {
      const { componentId, layer } = action.payload;
      const entity = state.entities[componentId];
      const visibilityState = entity[layer];
      const layers = { ...entity, ...{ [layer]: !visibilityState } };
      const entities = {
        ...state.entities,
        ...{ [componentId]: layers }
      };
      return {
        ...state,
        entities
      };
    }
  }
  return state;
}

export const getLayersVisibilityEntities = (state: LayerVisibilityState) => state.entities;
