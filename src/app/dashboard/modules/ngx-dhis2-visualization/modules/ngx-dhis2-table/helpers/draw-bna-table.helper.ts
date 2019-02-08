import * as _ from 'lodash';
import { TableConfiguration } from '../models/table-configuration';
import { getTableDimensionItemsArray } from './get-table-dimension-items-array.helper';
import { getTableRowsOrColumnsArray } from './get-table-rows-or-columns-array.helper';
import { getTableHeaderRows } from './get-table-header-rows.helper';
export function drawBnaTable(
  analyticsObject: any,
  tableConfiguration: TableConfiguration
) {
  // Get table rows
  const rowsItemsArray = getTableDimensionItemsArray(
    tableConfiguration.rows,
    analyticsObject
  );
  const tableRowsArray = getTableRowsOrColumnsArray(rowsItemsArray, 'row');

  // Get table columns
  const columnsItemsArray = getTableDimensionItemsArray(
    tableConfiguration.columns,
    analyticsObject
  );

  const tableColumnsArray = getTableRowsOrColumnsArray(
    columnsItemsArray,
    'column'
  );

  // get table header
  const tableHeaderRows = getTableHeaderRows(
    tableRowsArray[0],
    tableColumnsArray,
    analyticsObject,
    tableConfiguration
  );

  // get table rows with column data
  let tableDataRows = [];

  _.each(tableRowsArray, (tableRow: any[]) => {
    tableDataRows = [
      ...tableDataRows,
      [
        ...tableRow,
        ..._.map(_.last(tableColumnsArray), (tableDataCell: any) => {
          const lastTableRow = _.last(tableRow);
          const rowPaths =
            lastTableRow && lastTableRow.path
              ? lastTableRow.path.split('/')
              : [];
          const columnPaths =
            tableDataCell && tableDataCell.path
              ? tableDataCell.path.split('/')
              : [];

          const dataRowIds = [...rowPaths, ...columnPaths];
          return {
            id: dataRowIds.join('_'),
            isDataCell: true,
            dataDimensions: [
              ...tableConfiguration.rows,
              ...tableConfiguration.columns
            ],
            dataRowIds
          };
        })
      ]
    ];
  });

  // TODO: THIS IS A HACK TO MAKE BNA GROUPING WORK
  // remove empty row based on groups
  const dxDataSelection = _.find(tableConfiguration.dataSelections, [
    'dimension',
    'dx'
  ]);

  const dxGroupMembers = _.flatten(
    _.map(dxDataSelection ? dxDataSelection.groups || [] : [], dxGroup => {
      return _.map(dxGroup.members, (member: any) => [dxGroup.id, member.id]);
    })
  );

  let firstDataColumns = [];
  const flattenedDataRows = _.map(tableDataRows, (tableRows: any[]) => {
    firstDataColumns = [...firstDataColumns, _.first(tableRows)];
    const dataPaths = _.uniq(
      _.flatten(
        _.map(tableRows, (tableCell: any) =>
          tableCell.path ? tableCell.path.split('/') : []
        )
      )
    );

    return _.uniqBy(
      [
        ..._.filter(
          _.map(dataPaths, (dataPath: string) =>
            _.find(firstDataColumns, ['id', dataPath])
          ),
          dataCell => dataCell
        ),
        ...tableRows
      ],
      'id'
    );
  });

  const filteredDataRows = _.filter(
    flattenedDataRows,
    (tableDataRow: any[]) => {
      const matchingDataRows = _.filter(
        _.filter(
          tableDataRow,
          (tableDataCell: any) => tableDataCell.dataRowIds
        ),
        (tableDataCell: any) => {
          const intersectedRows = _.filter(
            dxGroupMembers,
            (dxGroupMember: any[]) => {
              return (
                _.intersection(tableDataCell.dataRowIds, dxGroupMember)
                  .length === dxGroupMember.length
              );
            }
          );

          return intersectedRows.length > 0;
        }
      );

      return matchingDataRows.length > 0;
    }
  );

  let mergedDataRowsArray = [];
  const availableParent = {};
  _.each(filteredDataRows, (filteredDataRow: any[]) => {
    mergedDataRowsArray = [
      ...mergedDataRowsArray,
      _.filter(
        _.map(filteredDataRow, (filterDataCell: any) => {
          if (!availableParent[filterDataCell.id]) {
            if (filterDataCell.id) {
              availableParent[filterDataCell.id] = 1;
            }
            return filterDataCell;
          }

          availableParent[filterDataCell.id] =
            availableParent[filterDataCell.id] + 1;
          return null;
        }),
        dataCell => dataCell
      )
    ];
  });

  mergedDataRowsArray = _.map(mergedDataRowsArray, (mergedDataRows: any[]) => {
    return _.map(mergedDataRows, (mergedDataCell: any) => {
      return {
        ...mergedDataCell,
        rowSpan: availableParent[mergedDataCell.id]
      };
    });
  });

  // TODO MOVE THIS LOGIC TO VISUALIZATION COMPONENT
  // table title
  const subtitle = _.map(tableConfiguration.filters, (filter: string) =>
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

  return {
    title: tableConfiguration.title,
    subtitle,
    headers: tableHeaderRows,
    rows: mergedDataRowsArray
  };
}
