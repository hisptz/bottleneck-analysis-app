import {ApplicationState} from '../application-state';
export function apiRootUrlSelector(state: ApplicationState) {
  const systemInfo: any = state.uiState.systemInfo;

  if (!systemInfo.loaded) {
    return '';
  }

  return systemInfo.apiRootUrl;
}


