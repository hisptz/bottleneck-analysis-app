import * as fromVisualizationLegend from './../actions/visualization-legend.action';

export interface VisualizationLegendState {
  open: boolean;
  pinned: boolean;
  filterSectionOpen: boolean;
}

export const initialState: VisualizationLegendState = {
  pinned: false,
  open: false,
  filterSectionOpen: false
};

export function reducer(
  state = initialState,
  action: fromVisualizationLegend.VisualizationLegendAction
): VisualizationLegendState {
  switch (action.type) {
    case fromVisualizationLegend.TOGGLE_PIN_VISUALIZATION_LEGEND: {
      const pinned = !state.pinned;
      return {
        ...state,
        pinned
      };
    }
    case fromVisualizationLegend.TOGGLE_OPEN_VISUALIZATION_LEGEND: {
      const pinned = state.pinned;
      const open = !state.open;
      if (pinned) {
        return state;
      }
      return {
        ...state,
        open
      };
    }

    case fromVisualizationLegend.TOGGLE_VISUALIZATION_FILTER_SECTION: {
      const filterSectionOpen = !state.filterSectionOpen;
      return {
        ...state,
        filterSectionOpen
      };
    }

    case fromVisualizationLegend.CLOSE_VISUALIZATION_FILTER_SECTION: {
      const filterSectionOpen = false;
      return {
        ...state,
        filterSectionOpen
      };
    }

    case fromVisualizationLegend.CLOSE_PIN_VISUALIZATION_LEGEND: {
      const pinned = state.pinned;
      const open = !state.open;
      if (pinned) {
        return {
          ...state,
          pinned: !pinned,
          open
        };
      }
      return {
        ...state,
        open
      };
    }
  }
  return state;
}

export const getVisualizationLegendOpen = (state: VisualizationLegendState) => state.open;
export const getVisualizationLegendPinned = (state: VisualizationLegendState) => state.pinned;
export const getVisualizationLegendFilterSectionOpen = (state: VisualizationLegendState) =>
  state.filterSectionOpen;
