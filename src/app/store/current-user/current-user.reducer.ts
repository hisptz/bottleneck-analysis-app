import {CurrentUserState} from './current-user.state';
import {CurrentUserAction, CurrentUserActions} from './current-user.actions';

export function currentUserReducer(state: CurrentUserState = null, action: CurrentUserAction) {
  switch (action.type) {
    case CurrentUserActions.LOAD_SUCCESS:
      return {...action.payload};
    default:
      return state;
  }
}
