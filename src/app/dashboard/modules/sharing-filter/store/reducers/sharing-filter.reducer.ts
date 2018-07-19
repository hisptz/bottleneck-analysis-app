import { createFeatureSelector } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { SharingFilter } from '../../models';
import {
  SharingFilterActions,
  SharingFilterActionTypes
} from '../actions/sharing-filter.actions';

export interface SharingFilterState extends EntityState<SharingFilter> {}

export const sharingFilterAdapter: EntityAdapter<
  SharingFilter
> = createEntityAdapter<SharingFilter>();

const initialState: SharingFilterState = sharingFilterAdapter.getInitialState(
  {}
);

export function sharingFilterReducer(
  state: SharingFilterState = initialState,
  action: SharingFilterActions
): SharingFilterState {
  switch (action.type) {
    case SharingFilterActionTypes.AddSharingFilterItem: {
      return sharingFilterAdapter.addOne(action.sharingFilterItem, state);
    }
  }
  return state;
}

export const getSharingFilterState = createFeatureSelector<SharingFilterState>(
  'sharingFilter'
);

export const {
  selectAll: getSharingFilterItems,
  selectEntities: getSharingFilterEntities
} = sharingFilterAdapter.getSelectors(getSharingFilterState);
