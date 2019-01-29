import { createFeatureSelector } from '@ngrx/store';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { SharingItem } from '../../models';
import {
  SharingItemActions,
  SharingItemActionTypes
} from '../actions/sharing-item.actions';

export interface SharingItemState extends EntityState<SharingItem> {}

export const sharingItemAdapter: EntityAdapter<
  SharingItem
> = createEntityAdapter<SharingItem>();

const initialState: SharingItemState = sharingItemAdapter.getInitialState({});

export function sharingItemReducer(
  state: SharingItemState = initialState,
  action: SharingItemActions
): SharingItemState {
  switch (action.type) {
    case SharingItemActionTypes.AddSharingItems: {
      return sharingItemAdapter.addMany(action.sharingItems, state);
    }

    case SharingItemActionTypes.UpsertSharingItem: {
      return sharingItemAdapter.upsertOne(action.sharingItem, state);
    }
    case SharingItemActionTypes.RemoveSharingItem: {
      return sharingItemAdapter.removeOne(action.sharingItemId, state);
    }
  }
  return state;
}

export const getSharingItemState = createFeatureSelector<SharingItemState>(
  'sharingItem'
);

export const {
  selectAll: getSharingItems,
  selectEntities: getSharingItemEntities
} = sharingItemAdapter.getSelectors(getSharingItemState);
