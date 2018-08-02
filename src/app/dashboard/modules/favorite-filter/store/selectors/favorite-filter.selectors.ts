import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

const FILTER_HEADER = {
  users: {
    title: 'Users',
    icon: 'assets/icons/users.png'
  },
  charts: {
    title: 'Charts',
    icon: 'assets/icon/column.png'
  },
  reportTables: {
    title: 'Tables',
    icon: 'assets/icons/table.png'
  },
  eventReports: {
    title: 'Tables',
    icon: 'assets/icons/table.png'
  },
  eventCharts: {
    title: 'Charts',
    icon: 'assets/icons/column.png'
  },
  maps: {
    title: 'Maps',
    icon: 'assets/icons/map.png'
  },
  apps: {
    title: 'Apps',
    icon: 'assets/icons/app.png'
  },
  reports: {
    title: 'Reports',
    icon: 'assets/icons/reports.png'
  },
  resources: {
    title: 'Resources',
    icon: 'assets/icons/documents.png'
  }
};
import {
  getFavoriteFilters,
  getFavoriteFilterState,
  getSelectedHeadersState,
  getFavoriteFilterLoadingState,
  getFavoriteFilterLoadedState,
  getSelectedFavoriteOwnershipState
} from '../reducers/favorite-filter.reducer';
import { getCurrentUser } from '../../../../../store';
import { FavoriteFilter } from '../../models/favorite-filter.model';
import { User } from '../../../../../models';

export const getSelectedFilterHeaders = createSelector(
  getFavoriteFilterState,
  getSelectedHeadersState
);

export const getSelectedFavoriteOwnership = createSelector(
  getFavoriteFilterState,
  getSelectedFavoriteOwnershipState
);

export const getFavoriteFilterLoading = createSelector(
  getFavoriteFilterState,
  getFavoriteFilterLoadingState
);
export const getFavoriteFilterLoaded = createSelector(
  getFavoriteFilterState,
  getFavoriteFilterLoadedState
);

export const getFavoriteFiltersBasedType = createSelector(
  getFavoriteFilters,
  getSelectedFilterHeaders,
  getSelectedFavoriteOwnership,
  getCurrentUser,
  (
    favoriteFilters: FavoriteFilter[],
    selectedFilterHeaders: string[],
    favoriteOwnership: string,
    currentUser: User
  ) => {
    return _.filter(favoriteFilters, (favoriteFilter: FavoriteFilter) => {
      return (
        _.some(
          selectedFilterHeaders,
          selectedHeader =>
            selectedHeader === 'all' || selectedHeader === favoriteFilter.type
        ) &&
        (favoriteOwnership !== 'all'
          ? favoriteFilter.user
            ? favoriteOwnership === 'me'
              ? favoriteFilter.user.id === currentUser.id
              : favoriteFilter.user.id !== currentUser.id
            : true
          : true)
      );
    });
  }
);

export const getFavoriteFilterHeaders = createSelector(
  getFavoriteFiltersBasedType,
  getSelectedFilterHeaders,
  (favoriteFilters, selectedFilterHeaders) => {
    const groupedFavoriteFilters = _.groupBy(favoriteFilters, 'type');
    const favoriteFilterKeys = _.keys(FILTER_HEADER);
    const results = [
      {
        title: 'ALL',
        type: 'all',
        selected: _.some(
          selectedFilterHeaders,
          selectedHeader => selectedHeader === 'all'
        )
      },
      ..._.map(favoriteFilterKeys, filterKey => {
        const filterDetails = FILTER_HEADER[filterKey];
        return {
          itemCount: groupedFavoriteFilters[filterKey]
            ? groupedFavoriteFilters[filterKey].length
            : 0,
          title: filterDetails ? filterDetails.title : '',
          icon: filterDetails ? filterDetails.icon : '',
          type: filterKey,
          selected: _.some(
            selectedFilterHeaders,
            selectedHeader => selectedHeader === filterKey
          )
        };
      })
    ];
    console.log(results);
    return results;
  }
);
