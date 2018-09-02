import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as _ from 'lodash';
import { DataFilter } from '../../models/data-filter.model';
import {
  DataFilterActions,
  DataFilterActionTypes
} from '../actions/data-filter.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<DataFilter> {
  // additional entities state properties
  activeDataFilterSelections: string[];
  currentDataFilterGroupId: string;
}

export const adapter: EntityAdapter<DataFilter> = createEntityAdapter<
  DataFilter
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  activeDataFilterSelections: ['all'],
  currentDataFilterGroupId: 'all'
});

export function reducer(
  state = initialState,
  action: DataFilterActions
): State {
  switch (action.type) {
    case DataFilterActionTypes.AddDataFilter: {
      return adapter.addOne(action.payload.dataFilter, state);
    }

    case DataFilterActionTypes.UpsertDataFilter: {
      return adapter.upsertOne(action.payload.dataFilter, state);
    }

    case DataFilterActionTypes.AddDataFilters: {
      return adapter.addMany(action.payload.dataFilters, state);
    }

    case DataFilterActionTypes.UpsertDataFilters: {
      return adapter.upsertMany(action.payload.dataFilters, state);
    }

    case DataFilterActionTypes.UpdateDataFilter: {
      return adapter.updateOne(action.payload.dataFilter, state);
    }

    case DataFilterActionTypes.UpdateDataFilters: {
      return adapter.updateMany(action.payload.dataFilters, state);
    }

    case DataFilterActionTypes.DeleteDataFilter: {
      return adapter.removeOne(action.payload.id, state);
    }

    case DataFilterActionTypes.DeleteDataFilters: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case DataFilterActionTypes.LoadDataFilters: {
      return state;
    }

    case DataFilterActionTypes.ClearDataFilters: {
      return adapter.removeAll(state);
    }

    case DataFilterActionTypes.UpdateActiveDataFilterSelections: {
      return {
        ...state,
        activeDataFilterSelections: _.map(
          _.filter(
            action.dataFilterSelections,
            (dataSelection: any) => dataSelection.selected
          ),
          (dataSelection: any) => dataSelection.prefix
        )
      };
    }

    case DataFilterActionTypes.SetCurrentDataFilterGroup: {
      return { ...state, currentDataFilterGroupId: action.dataFilterGroupId };
    }

    default: {
      return state;
    }
  }
}

export const getDataFilterState = createFeatureSelector<State>('dataFilter');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
