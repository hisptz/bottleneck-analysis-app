import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { getSharingFilterEntities } from '../reducers/sharing-filter.reducer';
import { getSharingItems } from '../reducers/sharing-item.reducer';
import { SharingFilter } from '../../models';

export const getSharingFilterItemById = id =>
  createSelector(
    getSharingFilterEntities,
    getSharingItems,
    (sharingFilterEntities, sharingItems) => {
      const currentSharingFilterItem: SharingFilter = sharingFilterEntities
        ? sharingFilterEntities[id]
        : null;
      return currentSharingFilterItem
        ? {
            ...currentSharingFilterItem,
            sharingItems: _.filter(
              sharingItems || [],
              sharingItem => sharingItem.sharingFilterId === id
            )
          }
        : null;
    }
  );
