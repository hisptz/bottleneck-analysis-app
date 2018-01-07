import * as visualization from './visualization.state';
import * as _ from 'lodash';
import {VisualizationAction, VisualizationActions} from './visualization.actions';

export function visualizationReducer(
  state: visualization.VisualizationState = visualization.INITIAL_VISUALIZATION_STATE,
  action: VisualizationAction) {
  switch (action.type) {
    case VisualizationActions.SET_INITIAL:
      return {
        ...state,
        visualizationObjects: [...state.visualizationObjects, ...action.payload]
      };
    case VisualizationActions.ADD_OR_UPDATE:
      const visualizationIndex = state.visualizationObjects.indexOf(_.find(state.visualizationObjects,
        ['id', action.payload.visualizationObject ? action.payload.visualizationObject.id : undefined]));

      return visualizationIndex !== -1 ? {
        ...state,
        visualizationObjects: action.payload.placementPreference === 'first' ? [
          action.payload.visualizationObject,
          ...state.visualizationObjects.slice(0, visualizationIndex),
          ...state.visualizationObjects.slice(visualizationIndex + 1)
        ] : [
          ...state.visualizationObjects.slice(0, visualizationIndex),
          action.payload.visualizationObject,
          ...state.visualizationObjects.slice(visualizationIndex + 1)
        ]
      } : {
        ...state,
        visualizationObjects: action.payload.placementPreference === 'first' ?
          [
            action.payload.visualizationObject,
            ...state.visualizationObjects
          ] : [
            ...state.visualizationObjects,
            action.payload.visualizationObject
        ]
      };

    case VisualizationActions.SET_CURRENT:
      return {
        ...state,
        currentVisualization: action.payload
      };
    case VisualizationActions.UNSET_CURRENT:
      return {
        ...state,
        currentVisualization: undefined
      };
    default:
      return state;
  }

}
