import * as visualization from './visualization.state';
import * as _ from 'lodash';
import {VisualizationAction, VisualizationActions} from './visualization.actions';

export function visualizationReducer(
  state: visualization.VisualizationState = visualization.INITIAL_VISUALIZATION_STATE,
  action: VisualizationAction) {
  switch (action.type) {
    case VisualizationActions.SET_INITIAL:
      return {...state, visualizationObjects: [...state.visualizationObjects, ...action.payload]};
    case VisualizationActions.UPDATE:
      const visualizationIndex = _.findIndex(state.visualizationObjects,
        _.find(state.visualizationObjects, ['id', action.payload ? action.payload.id : '']));

      return visualizationIndex !== -1 ? {
        ...state,
        visualizationObjects: [
          ...state.visualizationObjects.slice(0, visualizationIndex),
          action.payload,
          ...state.visualizationObjects.slice(visualizationIndex + 1)
        ]
      } : state;

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
