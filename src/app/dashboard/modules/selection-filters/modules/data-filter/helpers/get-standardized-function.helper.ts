import * as _ from 'lodash';
import { FunctionObject } from '../models/function.model';

export function getStandardizedFunctions(
  functionList,
  functionId: string = ''
): FunctionObject[] {
  return _.map(
    functionList || [],
    (functionItem: any, functionItemIndex: number) => {
      const selectedFunction = _.find(functionList || [], [
        'id',
        functionId !== ''
          ? functionId
          : functionItemIndex === 0
            ? functionItem.id
            : ''
      ]);
      return {
        ...functionItem,
        selected: selectedFunction && selectedFunction.id === functionItem.id,
        rules: _.map(functionItem.rules || [], (rule: any) => rule.id)
      };
    }
  );
}
