import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromUiSettings from '../reducers/ui-settings.reducers';

export const getUISettingsState = createSelector(
  fromFeature.getMapState,
  (state: fromFeature.MapState) => state.uiSettings
);

export const getCurrentLegendSetConfigType = createSelector(
  getUISettingsState,
  fromUiSettings.getCurrentLegendSetConfigType
);

export const getCurrentLegendSet = createSelector(
  getUISettingsState,
  fromUiSettings.getCurrentLegendSet
);

export const getShowDownloadLegend = createSelector(
  getUISettingsState,
  fromUiSettings.showDonwloadLegend
);
