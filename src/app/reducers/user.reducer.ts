import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { User } from '../models/user.model';
import { UserActions, UserActionTypes } from '../actions/user.actions';
import { ErrorMessage } from '../models/error-message.model';

export interface UserState extends EntityState<User> {
  // additional entities state properties

  /**
   * User loading status
   */
  loading: boolean;

  /**
   * User information loaded status
   */
  loaded: boolean;

  /**
   * User information error status
   */
  hasError: boolean;

  /**
   * User loading error
   */
  error: ErrorMessage;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>();

export const initialState: UserState = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  hasError: false,
  error: null
});

export function userReducer(
  state = initialState,
  action: UserActions
): UserState {
  switch (action.type) {
    case UserActionTypes.LoadCurrentUser: {
      return {...state, loading: true, loaded: false, hasError: false, error: null};
    }

    case UserActionTypes.AddCurrentUser: {
      return adapter.addOne(action.currentUser, {...state, loading: false, loaded: true});
    }

    case UserActionTypes.LoadCurrentUserFail: {
      return {...state, loading: false, hasError: true, error: action.error};
    }

    default: {
      return state;
    }
  }
}

// additional selectors

/**
 * User loading state selector
 * @param {UserState} state
 * @return {boolean} loading
 */
export const getUserLoadingState = (state: UserState) => state.loading;
export const getUserLoadedState = (state: UserState) => state.loaded;
export const getUserHasErrorState = (state: UserState) => state.hasError;
export const getUserErrorState = (state: UserState) => state.error;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
