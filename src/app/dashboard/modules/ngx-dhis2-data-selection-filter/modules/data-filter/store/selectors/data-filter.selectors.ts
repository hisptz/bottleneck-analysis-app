import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import * as fromDataFilterReducer from '../reducers/data-filter.reducer';
import * as fromFunctionSelectors from './function.selectors';
import * as fromIndicatorGroupSelectors from './indicator-group.selectors';
import * as fromIndicatorSelectors from './indicator.selectors';
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

export const getDataFilterLoadingStatus = createSelector(
  fromFunctionSelectors.getFunctionLoadingStatus,
  fromIndicatorGroupSelectors.getIndicatorGroupsLoadingStatus,
  fromIndicatorSelectors.getIndicatorsLoadingStatus,
  (
    functionLoading: boolean,
    indicatorGroupsLoading: boolean,
    indicatorsLoading: boolean
  ) => functionLoading && indicatorGroupsLoading && indicatorsLoading
);

export const getDataFilterGroups = createSelector(
  getDataFilterGroupsWithItems,
  getCurrentDataFilterGroupId,
  (dataFilterGroupWithItems: any[], currentDataFilterGroupId: string) => {
    return [
      {
        id: 'all',
        name: '[ All ]',
        selected: currentDataFilterGroupId === 'all'
      },
      ..._.sortBy(
        _.map(dataFilterGroupWithItems, (dataFilterGroup: any) =>
          _.omit(
            {
              ...dataFilterGroup,
              selected: dataFilterGroup.id === currentDataFilterGroupId
            },
            ['items']
          )
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

export const getDataFilterItems = createSelector(
  getDataFilterGroupsWithItems,
  getCurrentDataFilterGroup,
  (dataFilterGroups: any[], currentDataFilterGroup: any) => {
    if (!currentDataFilterGroup) {
      return [];
    }

    if (currentDataFilterGroup.id === 'all') {
      return _.sortBy(
        _.uniqBy(
          _.flatten(
            _.map(
              dataFilterGroups,
              (dataFilterGroup: any) => dataFilterGroup.items
            )
          ),
          'id'
        ),
        'name'
      );
    }

    return _.sortBy(
      _.uniqBy(
        _.flatten(
          _.map(
            _.filter(
              dataFilterGroups,
              (dataFilterGroup: any) =>
                dataFilterGroup.id === currentDataFilterGroup.id
            ),
            (dataFilterGroup: any) => dataFilterGroup.items
          )
        ),
        'id'
      ),
      'name'
    );
  }
);
