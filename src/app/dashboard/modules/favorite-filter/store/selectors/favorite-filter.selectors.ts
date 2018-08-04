import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

const FILTER_HEADER = {
  users: {
    title: 'Users',
    icon: 'assets/icons/users.png'
  },
  charts: {
    title: 'Charts',
    icon: 'assets/icons/column.png'
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
    return _.filter(
      _.map(favoriteFilters, favoriteFilter => {
        const favoriteHeader = FILTER_HEADER[favoriteFilter.type];
        return {
          ...favoriteFilter,
          headerName: favoriteHeader ? favoriteHeader.title : '',
          icon: favoriteHeader ? favoriteHeader.icon : ''
        };
      }),
      favoriteFilter =>
        _.some(
          selectedFilterHeaders,
          selectedHeader =>
            selectedHeader === 'ALL' ||
            selectedHeader === favoriteFilter.headerName
        ) &&
        (favoriteOwnership !== 'all'
          ? favoriteFilter.user
            ? favoriteOwnership === 'me'
              ? favoriteFilter.user.id === currentUser.id
              : favoriteFilter.user.id !== currentUser.id
            : true
          : true)
    );
  }
);

export const getFavoriteFilterHeaders = createSelector(
  getFavoriteFilters,
  getSelectedFilterHeaders,
  getSelectedFavoriteOwnership,
  getCurrentUser,
  (favoriteFilters, selectedFilterHeaders, favoriteOwnership, currentUser) => {
    const groupedFavoriteFilters = _.groupBy(favoriteFilters, 'type');
    const favoriteFilterKeys = _.keys(FILTER_HEADER);

    const favoriteHeaders: any[] = [
      {
        title: 'ALL',
        type: 'all',
        selected: _.some(
          selectedFilterHeaders,
          selectedHeader => selectedHeader === 'ALL'
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
            selectedHeader =>
              filterDetails && selectedHeader === filterDetails.title
          )
        };
      })
    ];

    const groupedFavoriteHeaders = _.groupBy(favoriteHeaders, 'title');
    return _.map(_.keys(groupedFavoriteHeaders), favoriteHeaderKey => {
      const favoriteHeaderArray = groupedFavoriteHeaders[favoriteHeaderKey];
      return {
        title: favoriteHeaderKey,
        icon: favoriteHeaderArray[0] ? favoriteHeaderArray[0].icon : '',
        selected: _.some(
          favoriteHeaderArray,
          favoriteHeader => favoriteHeader.selected
        ),
        itemCount: _.sumBy(favoriteHeaderArray, 'itemCount')
      };
    });
  }
);
