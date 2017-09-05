import {ApplicationState} from '../application-state';

export function interpretationLinkSelector(state: ApplicationState) {
  const currentVersion = state.uiState.systemInfo.currentVersion;
  let interpretationLink = '';
  if (currentVersion.toString() === '2.27') {
    interpretationLink = state.uiState.systemInfo.rootUrl + 'dhis-web-interpretation/index.html';
  } else if (currentVersion.toString() === '2.25') {
    interpretationLink = state.uiState.systemInfo.rootUrl + 'dhis-web-dashboard-integration/interpretation.action';
  }
  return interpretationLink
}
