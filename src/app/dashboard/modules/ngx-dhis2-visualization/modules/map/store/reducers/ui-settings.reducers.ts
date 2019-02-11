import { UiSettingsActionTypes } from '../actions/ui-settings.actions';
import { DownloadMapActionTypes } from '../actions/download-map.action';
import { LegendSet } from '../../models/legendSet-config.model';

export interface UISettingState {
  legendSetConfigType: string;
  showDonwloadLegend: boolean;
  currentLegendSet: LegendSet;
}

const initialState: UISettingState = {
  legendSetConfigType: 'automatic',
  showDonwloadLegend: false,
  currentLegendSet: null
};

export function reducer(state = initialState, action): UISettingState {
  switch (action.type) {
    case UiSettingsActionTypes.SET_CURRENT_LEGEND_SELECTION: {
      return {
        ...state,
        legendSetConfigType: action.legendSetConfigType
      };
    }

    case UiSettingsActionTypes.SET_CURRENT_LEGENDSET: {
      return {
        ...state,
        currentLegendSet: action.legendSet
      };
    }

    case DownloadMapActionTypes.ConvertDomToPng: {
      return {
        ...state,
        showDonwloadLegend: true
      };
    }

    case DownloadMapActionTypes.SaveFile:
    case DownloadMapActionTypes.ConvertDomToPngFail: {
      return {
        ...state,
        showDonwloadLegend: false
      };
    }

    default: {
      return state;
    }
  }
}

export const getCurrentLegendSetConfigType = (state: UISettingState) => state.legendSetConfigType;
export const getCurrentLegendSet = (state: UISettingState) => state.currentLegendSet;
export const showDonwloadLegend = (state: UISettingState) => state.showDonwloadLegend;
