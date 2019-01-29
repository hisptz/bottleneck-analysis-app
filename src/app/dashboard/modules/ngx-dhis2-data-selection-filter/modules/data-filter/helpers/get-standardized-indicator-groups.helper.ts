import * as fromModels from '../models';
import * as _ from 'lodash';

export function getStandardizedIndicatorGroups(
  IndicatorGroups: any[]
): fromModels.IndicatorGroup[] {
  return _.map(IndicatorGroups || [], (indicatorGroup: any) => {
    return {
      id: indicatorGroup.id,
      name: indicatorGroup.name,
      indicators: _.map(
        indicatorGroup.indicators || [],
        (indicator: any) => indicator.id
      )
    };
  });
}
