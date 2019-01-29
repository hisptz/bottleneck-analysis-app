import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';
import * as _ from 'lodash';

export function getDataSelectionSummary(
  dataSelections: VisualizationDataSelection[]
) {
  const ouDimension = _.find(dataSelections, ['dimension', 'ou']);
  const ouSection = (
    _.head(ouDimension ? ouDimension.items : []) || { name: '' }
  ).name;

  const peDimension = _.find(dataSelections, ['dimension', 'pe']);
  const peSection = _.uniq(
    _.filter(
      [
        (_.head(peDimension ? peDimension.items : []) || { name: '' }).name,
        (_.last(peDimension ? peDimension.items : []) || { name: '' }).name
      ],
      peName => peName !== undefined || peName !== ''
    )
  ).join(' - ');

  return ouSection !== '' && peSection !== ''
    ? ouSection + ' - ' + peSection
    : '';
}
