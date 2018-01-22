import * as visualization from './visualization.state';
import * as _ from 'lodash';
import {
  VisualizationAction,
  VisualizationActions
} from './visualization.actions';
import { Visualization } from './visualization.state';
import * as visualizationHelpers from './helpers/index';

export function visualizationReducer(
  state: visualization.VisualizationState = visualization.INITIAL_VISUALIZATION_STATE,
  action: VisualizationAction
) {
  switch (action.type) {
    case VisualizationActions.SET_INITIAL:
      return {
        ...state,
        visualizationObjects: [...state.visualizationObjects, ...action.payload]
      };
    case VisualizationActions.ADD_OR_UPDATE:
      const visualizationIndex = state.visualizationObjects.indexOf(
        _.find(state.visualizationObjects, [
          'id',
          action.payload.visualizationObject
            ? action.payload.visualizationObject.id
            : undefined
        ])
      );

      return visualizationIndex !== -1
        ? {
            ...state,
            visualizationObjects:
              action.payload.placementPreference === 'first'
                ? [
                    action.payload.visualizationObject,
                    ...state.visualizationObjects.slice(0, visualizationIndex),
                    ...state.visualizationObjects.slice(visualizationIndex + 1)
                  ]
                : [
                    ...state.visualizationObjects.slice(0, visualizationIndex),
                    action.payload.visualizationObject,
                    ...state.visualizationObjects.slice(visualizationIndex + 1)
                  ]
          }
        : {
            ...state,
            visualizationObjects:
              action.payload.placementPreference === 'first'
                ? [
                    action.payload.visualizationObject,
                    ...state.visualizationObjects
                  ]
                : [
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
    case VisualizationActions.RESIZE: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload.visualizationId]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      return visualizationObjectIndex !== -1
        ? {
            ...state,
            visualizationObjects: [
              ...state.visualizationObjects.slice(0, visualizationObjectIndex),
              {
                ...visualizationObject,
                shape: action.payload.shape,
                details: {
                  ...visualizationObject.details,
                  width: visualizationHelpers.getVisualizationWidthFromShape(
                    action.payload.shape
                  ),
                  shape: action.payload.shape
                }
              },
              ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
            ]
          }
        : state;
    }
    case VisualizationActions.TOGGLE_INTERPRETATION: {
      const visualizationObject: Visualization = _.find(
        state.visualizationObjects,
        ['id', action.payload]
      );
      const visualizationObjectIndex = state.visualizationObjects.indexOf(
        visualizationObject
      );
      /**
       * Change size of the dashboard item
       */

      const newShape = visualizationObject
        ? visualizationObject.details.showInterpretationBlock
          ? visualizationObject.details.shape
          : visualizationObject.shape === 'NORMAL'
            ? 'DOUBLE_WIDTH'
            : 'FULL_WIDTH'
        : '';

      return visualizationObjectIndex !== -1
        ? {
            ...state,
            visualizationObjects: [
              ...state.visualizationObjects.slice(0, visualizationObjectIndex),
              {
                ...visualizationObject,
                shape: newShape,
                details: {
                  ...visualizationObject.details,
                  width: visualizationHelpers.getVisualizationWidthFromShape(
                    newShape
                  ),
                  showInterpretationBlock: !visualizationObject.details
                    .showInterpretationBlock,
                  shape: visualizationObject.shape
                }
              },
              ...state.visualizationObjects.slice(visualizationObjectIndex + 1)
            ]
          }
        : state;
    }
    default:
      return state;
  }
}
