import { createSelector } from '@ngrx/store';
import { getRootState, State } from '../reducers';
import { selectAllUsers } from '../reducers/user.reducer';
import { User } from '@iapps/ngx-dhis2-http-client';
import { isSuperUser } from 'src/app/dashboard/helpers';
export const getUserState = createSelector(
  getRootState,
  (state: State) => state.user
);

export const getAllUser = createSelector(
  getUserState,
  selectAllUsers
);

export const getCurrentUser = createSelector(
  getAllUser,
  (users: User[]) => users[0] || null
);

export const getCurrentUserManagementAuthoritiesStatus = createSelector(
  getCurrentUser,
  (currentUser: User) => isSuperUser(currentUser)
);
