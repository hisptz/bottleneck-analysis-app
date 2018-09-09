import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Intervention } from '../../models/intervention.model';

export enum InterventionActionTypes {
  LoadInterventions = '[Intervention] Load Interventions',
  CreateIntervention = '[Intervention] Create Intervention',
  CreateInterventionSuccess = '[Intervention] Create Intervention success',
  CreateInterventionFail = '[Intervention] Create Intervention fail',
  AddInterventions = '[Intervention] Add Interventions',
  UpdateIntervention = '[Intervention] Update Intervention',
  SaveIntervention = '[Intervention] Save Intervention',
  SaveInterventionSuccess = '[Intervention] Save Intervention success',
  SaveInterventionFail = '[Intervention] Save Intervention fail',
  UpdateInterventions = '[Intervention] Update Interventions',
  DeleteIntervention = '[Intervention] Delete Intervention',
  DeleteInterventionSuccess = '[Intervention] Delete Intervention success',
  DeleteInterventionFail = '[Intervention] Delete Intervention fail',
  ClearInterventions = '[Intervention] Clear Interventions'
}

export class LoadInterventions implements Action {
  readonly type = InterventionActionTypes.LoadInterventions;
}

export class CreateIntervention implements Action {
  readonly type = InterventionActionTypes.CreateIntervention;

  constructor(public intervention: Intervention) {}
}

export class CreateInterventionSuccess implements Action {
  readonly type = InterventionActionTypes.CreateInterventionSuccess;
  constructor(public intervention: Intervention) {}
}

export class CreateInterventionFail implements Action {
  readonly type = InterventionActionTypes.CreateInterventionFail;
  constructor(public intervention: Intervention, public error: any) {}
}

export class AddInterventions implements Action {
  readonly type = InterventionActionTypes.AddInterventions;

  constructor(public interventions: Intervention[]) {}
}

export class UpdateIntervention implements Action {
  readonly type = InterventionActionTypes.UpdateIntervention;

  constructor(public id: string, public changes: Partial<Intervention>) {}
}
export class SaveIntervention implements Action {
  readonly type = InterventionActionTypes.SaveIntervention;
  constructor(public intervention: Intervention) {}
}

export class SaveInterventionSuccess implements Action {
  readonly type = InterventionActionTypes.SaveInterventionSuccess;
  constructor(public intervention: Intervention) {}
}

export class SaveInterventionFail implements Action {
  readonly type = InterventionActionTypes.SaveInterventionFail;
  constructor(public intervention: Intervention, public error: any) {}
}

export class UpdateInterventions implements Action {
  readonly type = InterventionActionTypes.UpdateInterventions;

  constructor(public payload: { interventions: Update<Intervention>[] }) {}
}

export class DeleteIntervention implements Action {
  readonly type = InterventionActionTypes.DeleteIntervention;

  constructor(public intervention: Intervention) {}
}

export class DeleteInterventionSuccess implements Action {
  readonly type = InterventionActionTypes.DeleteInterventionSuccess;

  constructor(public id: string) {}
}

export class DeleteInterventionFail implements Action {
  readonly type = InterventionActionTypes.DeleteInterventionFail;
  constructor(public intervention: Intervention, public error: any) {}
}

export class ClearInterventions implements Action {
  readonly type = InterventionActionTypes.ClearInterventions;
}

export type InterventionActions =
  | LoadInterventions
  | CreateIntervention
  | CreateInterventionSuccess
  | CreateInterventionFail
  | AddInterventions
  | UpdateIntervention
  | SaveIntervention
  | SaveInterventionSuccess
  | SaveInterventionFail
  | UpdateInterventions
  | DeleteIntervention
  | DeleteInterventionSuccess
  | DeleteInterventionFail
  | ClearInterventions;
