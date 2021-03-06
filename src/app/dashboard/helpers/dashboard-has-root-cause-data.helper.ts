import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';
import * as _ from 'lodash';

export function dashboardHasRootCauseData(
  dataSelections: VisualizationDataSelection[],
  dashboardId: string,
  rootCauseDataIds: string[]
): boolean {
  const ouDimension = _.find(dataSelections, ['dimension', 'ou']);

  const peDimension = _.find(dataSelections, ['dimension', 'pe']);

  const ouIds = (ouDimension ? [(ouDimension.items || [])[0]] || [] : []).map(
    item => item.id
  );

  const peIds = (peDimension ? peDimension.items || [] : []).map(
    item => item.id
  );

  return (rootCauseDataIds || []).some(
    rootCauseDataId =>
      rootCauseDataId.indexOf([ouIds, peIds, [dashboardId]].join('_')) !== -1
  );
}
