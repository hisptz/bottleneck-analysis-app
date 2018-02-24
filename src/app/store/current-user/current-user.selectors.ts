import {createSelector} from '@ngrx/store';
import {AppState} from '../app.reducers';
import {CurrentUserState} from './current-user.state';

const currentUser = (state: AppState) => state.currentUser;

export const getCurrentUser = createSelector(currentUser, (currentUserObeject: CurrentUserState) => currentUserObeject);
