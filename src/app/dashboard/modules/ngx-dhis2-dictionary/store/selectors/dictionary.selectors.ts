import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { getDictionaryMetadataEntities } from '../reducers/dictionary.reducer';

export const getDictionaryList = metadataIdentifiers =>
  createSelector(
    getDictionaryMetadataEntities,
    (dictionaryMetadataEntities: any) =>
      _.filter(
        _.map(
          metadataIdentifiers,
          metadataId => dictionaryMetadataEntities[metadataId]
        ),
        metadata => metadata
      )
  );
