import {ApplicationState} from '../application-state';
export function errorMessageSelector(state: ApplicationState) {
  return state.uiState.errorMessage;
}
