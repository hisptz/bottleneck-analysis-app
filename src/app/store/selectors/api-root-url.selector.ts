import {ApplicationState} from '../application-state';
export function apiRootUrlSelector(state: ApplicationState) {
  const systemInfo: any = state.uiState.systemInfo;

  if (!systemInfo.loaded) {
    return '';
  }
  const url: string = systemInfo.rootUrl + 'api/';
  return systemInfo.currentVersion > systemInfo.maxSupportedVersion ? url + getVersionDecimalPart(systemInfo.maxSupportedVersion) + '/' : url + getVersionDecimalPart(systemInfo.currentVersion)  + '/';
}

function getVersionDecimalPart(version: number) {
  return version.toString().split('.')[1]
}
