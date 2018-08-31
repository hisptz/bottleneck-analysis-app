import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { FunctionRule } from '../models/function-rule.model';
import { FunctionObject } from '../models';

export enum FunctionRuleActionTypes {
  LoadFunctionRules = '[FunctionRule] Load FunctionRules',
  AddFunctionRule = '[FunctionRule] Add FunctionRule',
  UpsertFunctionRule = '[FunctionRule] Upsert FunctionRule',
  AddFunctionRules = '[FunctionRule] Add FunctionRules',
  UpsertFunctionRules = '[FunctionRule] Upsert FunctionRules',
  UpdateFunctionRule = '[FunctionRule] Update FunctionRule',
  UpdateActiveFunctionRule = '[FunctionRule] Update active FunctionRule',
  UpdateFunctionRules = '[FunctionRule] Update FunctionRules',
  DeleteFunctionRule = '[FunctionRule] Delete FunctionRule',
  DeleteFunctionRules = '[FunctionRule] Delete FunctionRules',
  ClearFunctionRules = '[FunctionRule] Clear FunctionRules',
  SetActiveFunctionRule = '[FunctionRule] Set active FunctionRule'
}

export class LoadFunctionRules implements Action {
  readonly type = FunctionRuleActionTypes.LoadFunctionRules;

  constructor(public payload: { functionRules: FunctionRule[] }) {}
}

export class AddFunctionRule implements Action {
  readonly type = FunctionRuleActionTypes.AddFunctionRule;

  constructor(public payload: { functionRule: FunctionRule }) {}
}

export class UpsertFunctionRule implements Action {
  readonly type = FunctionRuleActionTypes.UpsertFunctionRule;

  constructor(public payload: { functionRule: FunctionRule }) {}
}

export class AddFunctionRules implements Action {
  readonly type = FunctionRuleActionTypes.AddFunctionRules;

  constructor(public functionRules: FunctionRule[]) {}
}

export class UpsertFunctionRules implements Action {
  readonly type = FunctionRuleActionTypes.UpsertFunctionRules;

  constructor(public payload: { functionRules: FunctionRule[] }) {}
}

export class UpdateFunctionRule implements Action {
  readonly type = FunctionRuleActionTypes.UpdateFunctionRule;

  constructor(public id: string, public changes: Partial<FunctionRule>) {}
}

export class UpdateFunctionRules implements Action {
  readonly type = FunctionRuleActionTypes.UpdateFunctionRules;

  constructor(public payload: { functionRules: Update<FunctionRule>[] }) {}
}

export class DeleteFunctionRule implements Action {
  readonly type = FunctionRuleActionTypes.DeleteFunctionRule;

  constructor(public payload: { id: string }) {}
}

export class DeleteFunctionRules implements Action {
  readonly type = FunctionRuleActionTypes.DeleteFunctionRules;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearFunctionRules implements Action {
  readonly type = FunctionRuleActionTypes.ClearFunctionRules;
}

export class SetActiveFunctionRule implements Action {
  readonly type = FunctionRuleActionTypes.SetActiveFunctionRule;
  constructor(
    public functionRule: FunctionRule,
    public functionObject: FunctionObject
  ) {}
}

export class UpdateActiveFunctionRule implements Action {
  readonly type = FunctionRuleActionTypes.UpdateActiveFunctionRule;
}

export type FunctionRuleActions =
  | LoadFunctionRules
  | AddFunctionRule
  | UpsertFunctionRule
  | AddFunctionRules
  | UpsertFunctionRules
  | UpdateFunctionRule
  | UpdateFunctionRules
  | DeleteFunctionRule
  | DeleteFunctionRules
  | ClearFunctionRules
  | SetActiveFunctionRule
  | UpdateActiveFunctionRule;
