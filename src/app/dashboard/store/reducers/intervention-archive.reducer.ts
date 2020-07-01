import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { InterventionArchive } from '../../models/intervention-archive.model';
import { createReducer, on } from '@ngrx/store';
import {
  upsertInterventionArchive,
  upsertInterventionArchives,
} from '../actions/intervention-archive.actions';

export interface InterventionArchiveState
  extends EntityState<InterventionArchive> {}

export const interventionArchiveAdapter: EntityAdapter<InterventionArchive> = createEntityAdapter<
  InterventionArchive
>({});

export const initialState = interventionArchiveAdapter.getInitialState();
const reducer = createReducer(
  initialState,
  on(upsertInterventionArchive, (state, { interventionArchive }) =>
    interventionArchiveAdapter.upsertOne(interventionArchive, state)
  ),
  on(upsertInterventionArchives, (state, { interventionArchives }) =>
    interventionArchiveAdapter.upsertMany(interventionArchives, state)
  )
);

export function interventionArchiveReducer(
  state,
  action
): InterventionArchiveState {
  return reducer(state, action);
}
