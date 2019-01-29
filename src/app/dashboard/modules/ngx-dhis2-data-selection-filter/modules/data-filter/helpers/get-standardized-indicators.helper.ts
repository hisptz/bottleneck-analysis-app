import * as fromModels from '../models';
import * as _ from 'lodash';

export function getStandardizedIndicators(
  Indicators: any[]
): fromModels.Indicator[] {
  return _.map(Indicators || [], (indicator: any) => {
    return {
      id: indicator.id,
      name: indicator.name,
      type: 'INDICATOR'
    };
  });
}
