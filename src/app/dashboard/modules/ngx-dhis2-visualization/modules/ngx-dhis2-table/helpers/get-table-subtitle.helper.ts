import * as _ from 'lodash';
import { TableConfiguration } from '../models/table-configuration';

export function getTableSubtitle(
  tableConfiguration: TableConfiguration,
  analyticsObject: any
) {
  return _.map(tableConfiguration.filters, (filter: string) =>
    _.map(
      analyticsObject && analyticsObject.metaData
        ? analyticsObject.metaData[filter] || []
        : [],
      (itemId: string) =>
        analyticsObject &&
        analyticsObject.metaData &&
        analyticsObject.metaData.names
          ? analyticsObject.metaData.names[itemId] || []
          : []
    ).join(', ')
  ).join(' - ');
}
