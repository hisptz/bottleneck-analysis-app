import { createAction, props } from '@ngrx/store';

export const loadRootCauseDataIds = createAction(
  '[RootCauseData] Load root cause data ids'
);

export const addRootCauseDataIds = createAction(
  '[RootCauseData] Add root cause data ids',
  props<{ rootCauseDataIds: string[] }>()
);
