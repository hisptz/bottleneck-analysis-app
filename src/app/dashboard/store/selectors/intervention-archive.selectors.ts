import { createFeatureSelector, createSelector } from '@ngrx/store';
import { InterventionArchive } from '../../models/intervention-archive.model';
import {
  interventionArchiveAdapter,
  InterventionArchiveState,
} from '../reducers/intervention-archive.reducer';

const getInterventionArchiveState = createFeatureSelector<
  InterventionArchiveState
>('interventionArchive');

export const {
  selectEntities: getInterventionArchiveEntities,
  selectAll: getAllInterventionArchives,
} = interventionArchiveAdapter.getSelectors(getInterventionArchiveState);

export const getInterventionArchiveLoadingStatus = createSelector(
  getInterventionArchiveState,
  (interventionArchiveState: InterventionArchiveState) =>
    interventionArchiveState.loading
);

export const getInterventionArchiveById = (id: string) =>
  createSelector(getInterventionArchiveEntities, (entities) =>
    entities ? entities[id] : null
  );

export const getInterventionArchivesByInterventionId = (id: string) =>
  createSelector(
    getAllInterventionArchives,
    (interventionArchives: InterventionArchive[]) =>
      (interventionArchives || []).filter((interventionArchive) =>
        interventionArchive ? interventionArchive.id.indexOf(id) !== -1 : false
      )
  );
