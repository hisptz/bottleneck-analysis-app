import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import * as fromDataFilterReducer from '../reducers/data-filter.reducer';
import * as fromFunctionSelectors from './function.selectors';
import * as fromIndicatorGroupSelectors from './indicator-group.selectors';
import * as fromModels from '../../models';

const getActiveDataFilterSelections = createSelector(
  fromDataFilterReducer.getDataFilterState,
  (state: fromDataFilterReducer.State) => state.activeDataFilterSelections
);

const getCurrentDataFilterGroupId = createSelector(
  fromDataFilterReducer.getDataFilterState,
  (state: fromDataFilterReducer.State) => state.currentDataFilterGroupId
);

const getDataFilterGroupEntities = createSelector(
  fromFunctionSelectors.getFunctions,
  fromIndicatorGroupSelectors.getIndicatorGroups,
  (functions: any[], indicatorGroups: any[]) => {
    return { fn: functions, in: indicatorGroups };
  }
);

const getDataFilterGroupsWithItems = createSelector(
  getActiveDataFilterSelections,
  getDataFilterGroupEntities,
  (activeDataFilterSelections: string[], dataFilterGroupEntities: any) => {
    const selectionKeys =
      activeDataFilterSelections[0] === 'all'
        ? _.keys(dataFilterGroupEntities)
        : activeDataFilterSelections;
    return _.flatten(
      _.map(
        selectionKeys,
        (selectionKey: string) => dataFilterGroupEntities[selectionKey]
      )
    );
  }
);

export const getDataFilterGroups = createSelector(
  getDataFilterGroupsWithItems,
  (dataFilterGroupWithItems: any[]) => {
    return [
      { id: 'all', name: '[ All ]' },
      ..._.sortBy(
        _.map(dataFilterGroupWithItems, (dataFilterGroup: any) =>
          _.omit(dataFilterGroup, ['items'])
        ),
        'name'
      )
    ];
  }
);

export const getCurrentDataFilterGroup = createSelector(
  getDataFilterGroups,
  getCurrentDataFilterGroupId,
  (dataFilterGroups: any[], currentDataFilterGroupId: string) =>
    _.find(dataFilterGroups, ['id', currentDataFilterGroupId]) ||
    _.find(dataFilterGroups, ['id', 'all'])
);
