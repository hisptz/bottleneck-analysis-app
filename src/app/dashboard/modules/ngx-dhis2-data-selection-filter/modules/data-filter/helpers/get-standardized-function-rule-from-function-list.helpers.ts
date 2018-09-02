import * as _ from 'lodash';
import { FunctionRule } from '../models/function-rule.model';

export function getStandardizedFunctionRulesFromFunctionList(
  functionList,
  ruleId: string = ''
): FunctionRule[] {
  const functionRules = _.flatten(
    _.map(functionList || [], (functionObject: any) => functionObject.rules)
  );

  return _.map(
    functionRules,
    (functionRule: any, functionRuleIndex: number) => {
      const selectedRule = _.find(functionRules, [
        'id',
        ruleId !== '' ? ruleId : functionRuleIndex === 0 ? functionRule.id : ''
      ]);
      return {
        ...functionRule,
        type: 'FUNCTION_RULE',
        selected: selectedRule && selectedRule.id === functionRule.id
      };
    }
  );
}
