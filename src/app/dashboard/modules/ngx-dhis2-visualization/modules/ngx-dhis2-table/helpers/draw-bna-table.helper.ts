import * as _ from 'lodash';

import { TableConfiguration } from '../models/table-configuration';
import { getMergedTableRows } from './get-merged-table-rows.helper';
import { getTableDimensionItemsArray } from './get-table-dimension-items-array.helper';
import { getTableHeaderRows } from './get-table-header-rows.helper';
import { getTableRowsOrColumnsArray } from './get-table-rows-or-columns-array.helper';
import { getTableRowsUpdatedWithColumnsMetadata } from './get-table-rows-updated-with-columns-metadata.helper';
import { getTableSubtitle } from './get-table-subtitle.helper';
import { getDataSelectionGroupMembers } from './get-data-selection-group-members.helper';

export function drawBnaTable(
  analyticsObject: any,
  tableConfiguration: TableConfiguration
) {
  // Get table rows
  const tableRowsArray = getTableRowsOrColumnsArray(
    getTableDimensionItemsArray(tableConfiguration.rows, analyticsObject),
    'row'
  );

  // Get table columns
  const tableColumnsArray = getTableRowsOrColumnsArray(
    getTableDimensionItemsArray(tableConfiguration.columns, analyticsObject),
    'column'
  );

  const tableDataRows = getTableRowsUpdatedWithColumnsMetadata(
    tableConfiguration,
    tableRowsArray,
    tableColumnsArray
  );

  return {
    title: tableConfiguration.title,
    subtitle: getTableSubtitle(tableConfiguration, analyticsObject),
    headers: getTableHeaderRows(
      tableRowsArray[0],
      tableColumnsArray,
      analyticsObject,
      tableConfiguration
    ),
    rows: getMergedTableRows(
      tableDataRows,
      getDataSelectionGroupMembers(tableConfiguration)
    )
  };
}
