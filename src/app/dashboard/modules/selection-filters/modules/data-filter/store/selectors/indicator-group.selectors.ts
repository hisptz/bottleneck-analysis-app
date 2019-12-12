import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import * as fromIndicatorGroup from '../reducers/indicator-group.reducer';
import * as fromIndicator from '../reducers/indicator.reducer';
import * as fromModels from '../../models';

export const getIndicatorGroupsInitiatedStatus = createSelector(
  fromIndicatorGroup.getIndicatorGroupState,
  (state: fromIndicatorGroup.State) => state.loadInitiated
);

export const getIndicatorGroupsLoadingStatus = createSelector(
  fromIndicatorGroup.getIndicatorGroupState,
  (state: fromIndicatorGroup.State) => state.loading
);

export const getIndicatorGroups = createSelector(
  fromIndicatorGroup.getAllIndicatorGroups,
  fromIndicator.getIndicatorEntities,
  (
    indicatorGroups: fromModels.IndicatorGroup[],
    indicatorEntities: { [id: string]: fromModels.Indicator }
  ) => {
    let indicatorIdsWithGroups = [];
    const sanitizedIndicatorGroups = _.map(
      indicatorGroups,
      (indicatorGroup: fromModels.IndicatorGroup) => {
        indicatorIdsWithGroups = [
          ...indicatorIdsWithGroups,
          ...indicatorGroup.indicators,
        ];
        return {
          id: indicatorGroup.id,
          name: indicatorGroup.name,
          items: _.filter(
            _.map(
              indicatorGroup.indicators || [],
              (indicatorId: string) => indicatorEntities[indicatorId]
            ),
            indicator => indicator
          ),
        };
      }
    );

    return [
      {
        id: 'ungrouped',
        name: '[ Un-grouped ]',
        sortOrder: 2,
        items: _.keys(indicatorEntities)
          .filter(
            (indicatorId: string) =>
              !_.some(
                indicatorIdsWithGroups,
                indicator => indicator === indicatorId
              )
          )
          .map(indicatorId => indicatorEntities[indicatorId]),
      },
      ...sanitizedIndicatorGroups,
    ];
  }
);
