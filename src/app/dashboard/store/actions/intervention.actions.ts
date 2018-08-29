import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Intervention } from '../models/intervention.model';

export enum InterventionActionTypes {
  LoadInterventions = '[Intervention] Load Interventions',
  AddIntervention = '[Intervention] Add Intervention',
  UpsertIntervention = '[Intervention] Upsert Intervention',
  AddInterventions = '[Intervention] Add Interventions',
  UpsertInterventions = '[Intervention] Upsert Interventions',
  UpdateIntervention = '[Intervention] Update Intervention',
  UpdateInterventions = '[Intervention] Update Interventions',
  DeleteIntervention = '[Intervention] Delete Intervention',
  DeleteInterventions = '[Intervention] Delete Interventions',
  ClearInterventions = '[Intervention] Clear Interventions'
}

export class LoadInterventions implements Action {
  readonly type = InterventionActionTypes.LoadInterventions;
}

export class AddIntervention implements Action {
  readonly type = InterventionActionTypes.AddIntervention;

  constructor(public payload: { intervention: Intervention }) {}
}

export class UpsertIntervention implements Action {
  readonly type = InterventionActionTypes.UpsertIntervention;

  constructor(public payload: { intervention: Intervention }) {}
}

export class AddInterventions implements Action {
  readonly type = InterventionActionTypes.AddInterventions;

  constructor(public interventions: Intervention[]) {}
}

export class UpsertInterventions implements Action {
  readonly type = InterventionActionTypes.UpsertInterventions;

  constructor(public payload: { interventions: Intervention[] }) {}
}

export class UpdateIntervention implements Action {
  readonly type = InterventionActionTypes.UpdateIntervention;

  constructor(public payload: { intervention: Update<Intervention> }) {}
}

export class UpdateInterventions implements Action {
  readonly type = InterventionActionTypes.UpdateInterventions;

  constructor(public payload: { interventions: Update<Intervention>[] }) {}
}

export class DeleteIntervention implements Action {
  readonly type = InterventionActionTypes.DeleteIntervention;

  constructor(public payload: { id: string }) {}
}

export class DeleteInterventions implements Action {
  readonly type = InterventionActionTypes.DeleteInterventions;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearInterventions implements Action {
  readonly type = InterventionActionTypes.ClearInterventions;
}

export type InterventionActions =
  | LoadInterventions
  | AddIntervention
  | UpsertIntervention
  | AddInterventions
  | UpsertInterventions
  | UpdateIntervention
  | UpdateInterventions
  | DeleteIntervention
  | DeleteInterventions
  | ClearInterventions;
