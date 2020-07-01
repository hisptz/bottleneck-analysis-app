import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  InterventionArchiveState,
  interventionArchiveAdapter,
} from '../reducers/intervention-archive.reducer';

const getInterventionArchiveState = createFeatureSelector<
  InterventionArchiveState
>('interventionArchive');

const {
  selectEntities: getInterventionArchiveEntities,
} = interventionArchiveAdapter.getSelectors(getInterventionArchiveState);

export const getInterventionArchiveById = (id: string) =>
  createSelector(getInterventionArchiveEntities, (entities) =>
    entities ? entities[id] : null
  );
