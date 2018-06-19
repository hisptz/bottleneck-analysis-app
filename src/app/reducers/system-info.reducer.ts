import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { SystemInfo } from '../models/system-info.model';
import { SystemInfoActions, SystemInfoActionTypes } from '../actions/system-info.actions';
import { ErrorMessage } from '../models/error-message.model';

export interface SystemInfoState extends EntityState<SystemInfo> {
  // additional entities state properties
  /**
   * SystemInfo loading status
   */
  loading: boolean;

  /**
   * SystemInfo information loaded status
   */
  loaded: boolean;

  /**
   * SystemInfo information error status
   */
  hasError: boolean;

  /**
   * SystemInfo loading error
   */
  error: ErrorMessage;
}

export const adapter: EntityAdapter<SystemInfo> = createEntityAdapter<SystemInfo>();

export const initialState: SystemInfoState = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  loaded: false,
  hasError: false,
  error: null
});

export function systemInfoReducer(state = initialState,
  action: SystemInfoActions): SystemInfoState {
  switch (action.type) {
    case SystemInfoActionTypes.AddSystemInfo: {
      return adapter.addOne(action.systemInfo, {...state, loading: false, loaded: true});
    }

    case SystemInfoActionTypes.LoadSystemInfo: {
      return {...state, loading: true, loaded: false, hasError: false, error: null};
    }

    case SystemInfoActionTypes.LoadSystemInfoFail: {
      return {...state, loading: false, hasError: true, error: action.error};
    }

    default: {
      return state;
    }
  }
}

export const getSystemInfoLoadingState = (state: SystemInfoState) => state.loading;
export const getSystemInfoLoadedState = (state: SystemInfoState) => state.loaded;
export const getSystemInfoHasErrorState = (state: SystemInfoState) => state.hasError;
export const getSystemInfoErrorState = (state: SystemInfoState) => state.error;

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
