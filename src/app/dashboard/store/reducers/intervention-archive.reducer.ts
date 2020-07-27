import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { InterventionArchive } from '../../models/intervention-archive.model';
import { createReducer, on } from '@ngrx/store';
import {
  upsertInterventionArchive,
  upsertInterventionArchives,
  loadInterventionArchives,
} from '../actions/intervention-archive.actions';

export interface InterventionArchiveState
  extends EntityState<InterventionArchive> {
  loading: boolean;
}

export const interventionArchiveAdapter: EntityAdapter<InterventionArchive> = createEntityAdapter<
  InterventionArchive
>({});

export const initialState = interventionArchiveAdapter.getInitialState({
  loading: false,
});
const reducer = createReducer(
  initialState,
  on(upsertInterventionArchive, (state, { interventionArchive }) =>
    interventionArchiveAdapter.upsertOne(interventionArchive, state)
  ),
  on(loadInterventionArchives, (state) => ({ ...state, loading: true })),
  on(upsertInterventionArchives, (state, { interventionArchives }) =>
    interventionArchiveAdapter.upsertMany(interventionArchives, {
      ...state,
      loading: false,
    })
  )
);

export function interventionArchiveReducer(
  state,
  action
): InterventionArchiveState {
  return reducer(state, action);
}
