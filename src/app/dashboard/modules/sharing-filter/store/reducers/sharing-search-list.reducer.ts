import { createFeatureSelector } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { SharingSearchList } from '../../models/sharing-search-list.model';
import {
  SharingSearchListActions,
  SharingSearchListActionTypes,
} from '../actions/sharing-search-list.actions';

export interface SharingSearchListState extends EntityState<SharingSearchList> {
  loading: boolean;
  loaded: boolean;
  hasError: boolean;
  error: any;
  initiated: boolean;
}

export const sharingSearchListAdapter: EntityAdapter<SharingSearchList> = createEntityAdapter<
  SharingSearchList
>();

const initialState: SharingSearchListState = sharingSearchListAdapter.getInitialState(
  {
    loading: false,
    loaded: false,
    hasError: false,
    error: null,
    initiated: false,
  }
);

export function sharingSearchListReducer(
  state: SharingSearchListState = initialState,
  action: SharingSearchListActions
): SharingSearchListState {
  switch (action.type) {
    case SharingSearchListActionTypes.LoadSharingSearchList: {
      return {
        ...state,
        loading: true,
        loaded: false,
        hasError: false,
        error: null,
      };
    }
    case SharingSearchListActionTypes.AddSharingSearchList: {
      return sharingSearchListAdapter.addMany(action.sharingSearchList, {
        ...state,
        loading: false,
        loaded: true,
      });
    }

    case SharingSearchListActionTypes.LoadSharingSearchListFail: {
      return { ...state, loading: false, hasError: true, error: action.error };
    }

    case SharingSearchListActionTypes.InitiateLoadingSharingList: {
      return { ...state, initiated: true };
    }

    default:
      return state;
  }
}

export const getSharingSearchListState = createFeatureSelector<
  SharingSearchListState
>('sharingSearchList');

export const getSharingSearchListLoadingState = (
  state: SharingSearchListState
) => state.loading;

export const getSharingSearchListLoadedState = (
  state: SharingSearchListState
) => state.loaded;

export const getSharingSearchListHasErrorState = (
  state: SharingSearchListState
) => state.hasError;

export const getSharingSearchListInitiatedState = (
  state: SharingSearchListState
) => state.initiated;

export const {
  selectAll: getSharingSearchList,
} = sharingSearchListAdapter.getSelectors(getSharingSearchListState);
