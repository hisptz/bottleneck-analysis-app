import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import {
  getSharingSearchListState,
  getSharingSearchList,
  getSharingSearchListLoadingState
} from '../reducers/sharing-search-list.reducer';
import { getSharingItemEntities } from '../reducers/sharing-item.reducer';

export const getSharingSearchLoading = createSelector(
  getSharingSearchListState,
  getSharingSearchListLoadingState
);

export const getSharingSearchListVm = (currentSharingFilterId: string) =>
  createSelector(
    getSharingSearchList,
    getSharingItemEntities,
    (sharingSearchList, sharingItemEntities) => {
      return _.map(
        [
          { id: 'publicAccess', name: '', displayName: '', isPublic: true },
          ..._.sortBy(sharingSearchList, 'name')
        ],
        sharingSearchItem => {
          const availableSharingItem =
            sharingItemEntities[
              `${sharingSearchItem.id}_${currentSharingFilterId}`
            ];

          return {
            ...sharingSearchItem,
            available: availableSharingItem ? true : false,
            name: availableSharingItem
              ? availableSharingItem.name
              : sharingSearchItem.name,
            access: availableSharingItem ? availableSharingItem.access : ''
          };
        }
      );
    }
  );
