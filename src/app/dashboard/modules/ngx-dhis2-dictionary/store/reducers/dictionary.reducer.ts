import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

import { MetadataDictionary } from '../../models/dictionary.model';
import {
  DictionaryActions,
  DictionaryActionTypes
} from '../actions/dictionary.actions';

export interface DictionaryState extends EntityState<MetadataDictionary> {}

export const dictionaryAdapter: EntityAdapter<MetadataDictionary> = createEntityAdapter<
  MetadataDictionary
>();

const initialState: DictionaryState = dictionaryAdapter.getInitialState({});

export function dictionaryReducer(
  state: DictionaryState = initialState,
  action: DictionaryActions
): DictionaryState {
  switch (action.type) {
    case DictionaryActionTypes.AddDictionaryMetadataList: {
      return dictionaryAdapter.addMany(action.dictionaryMetadataList, state);
    }
    case DictionaryActionTypes.UpdateDictionaryMetadata: {
      return dictionaryAdapter.updateOne(
        { id: action.dictionaryMetadataId, changes: action.changes },
        state
      );
    }
  }

  return state;
}

export const getDictionaryState = createFeatureSelector<DictionaryState>(
  'dictionary'
);

export const {
  selectEntities: getDictionaryMetadataEntities
} = dictionaryAdapter.getSelectors(getDictionaryState);
