import * as _ from 'lodash';
import { TableConfiguration } from '../models/table-configuration';

export function getDataSelectionGroupMembers(
  tableConfiguration: TableConfiguration
) {
  const dxDataSelection = _.find(tableConfiguration.dataSelections, [
    'dimension',
    'dx'
  ]);

  return _.flatten(
    _.map(
      dxDataSelection ? dxDataSelection.groups || [] : [],
      (dxGroup: any) => {
        return _.map(dxGroup.members, (member: any) => [dxGroup.id, member.id]);
      }
    )
  );
}
