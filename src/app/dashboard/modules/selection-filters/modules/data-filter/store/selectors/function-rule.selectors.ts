import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import * as fromFunctionRuleReducer from '../reducers/function-rule.reducer';
import { getActiveFunction } from './function.selectors';
import { FunctionObject, FunctionRule } from '../../models';

export const getActiveFunctionRuleId = createSelector(
  fromFunctionRuleReducer.getFunctionRuleState,
  (functionRuleState: fromFunctionRuleReducer.State) =>
    functionRuleState.activeFunctionRuleId
);

export const getFunctionRulesForActiveFunction = createSelector(
  fromFunctionRuleReducer.getFunctionRuleEntities,
  getActiveFunction,
  getActiveFunctionRuleId,
  (
    functionRuleEntities: any,
    activeFunction: FunctionObject,
    activeRuleId: string
  ) =>
    _.filter(
      _.map(activeFunction ? activeFunction.rules : [], (ruleId: string) => {
        const functionRule: FunctionRule = functionRuleEntities[ruleId];
        return functionRule
          ? {
              ...functionRule,
              active: functionRule.id === activeRuleId
            }
          : null;
      }),
      functionRule => functionRule !== null
    )
);
