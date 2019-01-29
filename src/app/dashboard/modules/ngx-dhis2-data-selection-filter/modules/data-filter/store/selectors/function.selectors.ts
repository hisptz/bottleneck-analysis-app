import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import * as fromFunction from '../reducers/function.reducer';

import * as fromFunctionRuleReducer from '../reducers/function-rule.reducer';

import * as fromModels from '../../models';

export const getFunctionInitiatedStatus = createSelector(
  fromFunction.getFunctionState,
  (functionState: fromFunction.State) => functionState.loadInitiated
);

export const getFunctionLoadingStatus = createSelector(
  fromFunction.getFunctionState,
  (functionState: fromFunction.State) => functionState.loading
);

export const getFunctionLoadedStatus = createSelector(
  fromFunction.getFunctionState,
  (functionState: fromFunction.State) => functionState.loaded
);

export const getActiveFunctionId = createSelector(
  fromFunction.getFunctionState,
  (functionState: fromFunction.State) => functionState.activeFunctionId
);
export const getActiveFunction = createSelector(
  fromFunction.getFunctionEntities,
  getActiveFunctionId,
  (functionEntities: any, activeFunctionId: string) =>
    functionEntities[activeFunctionId]
);

export const getFunctions = createSelector(
  fromFunction.getAllFunctions,
  fromFunctionRuleReducer.getFunctionRuleEntities,
  getActiveFunctionId,
  (
    functionList: fromModels.FunctionObject[],
    functionRuleEntities: any,
    activeFunctionId: string
  ) =>
    _.map(functionList, (functionObject: fromModels.FunctionObject) => {
      return functionObject
        ? {
            id: functionObject.id,
            name: functionObject.name,
            items: _.filter(
              _.map(functionObject.rules || [], ruleId => {
                const functionRule = functionRuleEntities[ruleId];
                return functionRule
                  ? {
                      id: functionRule.id,
                      name: functionRule.name,
                      ruleDefinition: functionRule,
                      functionObject: {
                        id: functionObject.id,
                        functionString: functionObject.function
                      }
                    }
                  : null;
              }),
              functionRule => functionRule
            )
          }
        : null;
    })
);

export const getSelectedFunctions = createSelector(
  fromFunction.getAllFunctions,
  fromFunctionRuleReducer.getFunctionRuleEntities,
  (functionList: fromModels.FunctionObject[], functionRuleEntities: any) => {
    return functionList.length > 0 && _.keys(functionRuleEntities).length > 0
      ? _.filter(
          _.map(
            _.filter(
              functionList,
              (functionObject: fromModels.FunctionObject) =>
                functionObject.selected
            ),
            (selectedFunction: fromModels.FunctionObject) => {
              return selectedFunction
                ? {
                    ...selectedFunction,
                    rules: _.filter(
                      _.map(
                        selectedFunction.rules || [],
                        ruleId => functionRuleEntities[ruleId]
                      ),
                      functionRule =>
                        functionRule !== null && functionRule.selected
                    )
                  }
                : null;
            }
          ),
          functionObject => functionObject !== null
        )
      : [];
  }
);
