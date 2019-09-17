import { VisualizationDataSelection } from '../models';
import * as _ from 'lodash';

export function getAnalyticsWithGrouping(
  dataSelections: VisualizationDataSelection[],
  analytics: any
) {
  if (!analytics) {
    return null;
  }
  const dxDataSelection = _.find(dataSelections, ['dimension', 'dx']);

  const { headers, rows, metaData } = analytics;

  if (!headers || !metaData) {
    return null;
  }

  if (!dxDataSelection) {
    return analytics;
  }

  const dxGroups = dxDataSelection.groups || [];

  if (dxGroups.length === 0) {
    return analytics;
  }

  // Get dx header index
  const dxHeaderIndex = headers.indexOf(_.find(headers, ['name', 'dx']));
  const valueHeaderIndex = headers.indexOf(_.find(headers, ['name', 'value']));

  // Update headers with groups
  const newHeaders = [
    ...headers,
    {
      name: 'groups',
      column: 'Group',
      valueType: 'TEXT',
      type: 'java.lang.String',
      hidden: false,
      meta: true
    }
  ];

  // Update metadata with groups
  const groupNames = {};
  _.each(dxGroups, (group: any) => {
    groupNames[group.id] = group.name;
  });

  // TODO FIND GENERIC WAY TO PUT USER DEFINED NAMES IN METADATA
  const newMetaData = {
    ..._.omit(metaData, ['items']),
    names: {
      ...metaData.names,
      ...groupNames,
      ['groups']: 'Determinant',
      dx: 'Indicator'
    },
    ['groups']: _.map(dxGroups, (group: any) => group.id)
  };

  // Update rows with groups
  let newRows: any[] = [];
  _.each(rows, (row: any[]) => {
    _.each(dxGroups, (group: any) => {
      const groupMember = _.find(group.members, ['id', row[dxHeaderIndex]]);
      if (groupMember) {
        newRows = [...newRows, [...row, group.id]];
      } else {
        newRows = [
          ...newRows,
          [..._.slice(row, 0, valueHeaderIndex), group.id, group.id]
        ];
      }
    });
  });

  return { headers: newHeaders, metaData: newMetaData, rows: newRows };
}
