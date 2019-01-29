import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import * as fromModels from '../../models';

export enum FunctionActionTypes {
  LoadFunctionsInitiated = '[Function] Load Functions initiated',
  LoadFunctions = '[Function] Load Functions',
  LoadFunctionsFail = '[Function] Load Functions fail',
  AddFunction = '[Function] Add Function',
  UpsertFunction = '[Function] Upsert Function',
  AddFunctions = '[Function] Add Functions',
  UpsertFunctions = '[Function] Upsert Functions',
  UpdateFunction = '[Function] Update Function',
  UpdateActiveFunction = '[Function] Update active Function',
  UpdateFunctions = '[Function] Update Functions',
  DeleteFunction = '[Function] Delete Function',
  DeleteFunctions = '[Function] Delete Functions',
  ClearFunctions = '[Function] Clear Functions',
  SetActiveFunction = '[Function] Set active Function'
}

export class LoadFunctionsInitiated implements Action {
  readonly type = FunctionActionTypes.LoadFunctionsInitiated;
}
export class LoadFunctions implements Action {
  readonly type = FunctionActionTypes.LoadFunctions;

  constructor(public routeParams?: any) {}
}

export class LoadFunctionsFail implements Action {
  readonly type = FunctionActionTypes.LoadFunctionsFail;

  constructor(public error: any) {}
}

export class AddFunction implements Action {
  readonly type = FunctionActionTypes.AddFunction;

  constructor(public payload: { function: fromModels.FunctionObject }) {}
}

export class UpsertFunction implements Action {
  readonly type = FunctionActionTypes.UpsertFunction;

  constructor(public payload: { function: fromModels.FunctionObject }) {}
}

export class AddFunctions implements Action {
  readonly type = FunctionActionTypes.AddFunctions;

  constructor(
    public functions: fromModels.FunctionObject[],
    public functionRules: fromModels.FunctionRule[]
  ) {}
}

export class UpsertFunctions implements Action {
  readonly type = FunctionActionTypes.UpsertFunctions;

  constructor(public payload: { functions: fromModels.FunctionObject[] }) {}
}

export class UpdateFunction implements Action {
  readonly type = FunctionActionTypes.UpdateFunction;

  constructor(
    public id: string,
    public changes: Partial<fromModels.FunctionObject>
  ) {}
}

export class UpdateFunctions implements Action {
  readonly type = FunctionActionTypes.UpdateFunctions;

  constructor(
    public payload: { functions: Update<fromModels.FunctionObject>[] }
  ) {}
}

export class DeleteFunction implements Action {
  readonly type = FunctionActionTypes.DeleteFunction;

  constructor(public payload: { id: string }) {}
}

export class DeleteFunctions implements Action {
  readonly type = FunctionActionTypes.DeleteFunctions;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearFunctions implements Action {
  readonly type = FunctionActionTypes.ClearFunctions;
}

export class SetActiveFunction implements Action {
  readonly type = FunctionActionTypes.SetActiveFunction;
  constructor(public functionObject: fromModels.FunctionObject) {}
}

export class UpdateActiveFunction implements Action {
  readonly type = FunctionActionTypes.UpdateActiveFunction;
}

export type FunctionActions =
  | LoadFunctionsInitiated
  | LoadFunctions
  | LoadFunctionsFail
  | AddFunction
  | UpsertFunction
  | AddFunctions
  | UpsertFunctions
  | UpdateFunction
  | UpdateFunctions
  | DeleteFunction
  | DeleteFunctions
  | ClearFunctions
  | SetActiveFunction
  | UpdateActiveFunction;
