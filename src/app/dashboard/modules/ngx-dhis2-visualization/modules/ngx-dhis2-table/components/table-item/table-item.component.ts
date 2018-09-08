import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { TableConfiguration } from '../../models/table-configuration';

import { drawTable } from '../../helpers/index';
import { LegendSet } from '../../models/legend-set.model';
import { ChartConfiguration } from '../../../ngx-dhis-chart/models';
import { drawChart } from '../../../ngx-dhis-chart/helpers';
import {
  listEnterAnimation,
  openAnimation
} from '../../../../../../../animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-dhis2-table-item',
  templateUrl: './table-item.component.html',
  styleUrls: ['./table-item.component.css'],
  animations: [listEnterAnimation, openAnimation]
})
export class TableItemComponent implements OnInit {
  @Input()
  tableConfiguration: TableConfiguration;

  @Input()
  analyticsObject: any;
  @Input()
  legendSets: LegendSet[];
  tableObject: any;
  sort_direction: string[] = [];
  current_sorting: boolean[] = [];
  tableData: any;
  constructor() {
    this.tableObject = null;
  }

  ngOnInit() {
    if (this.analyticsObject && this.tableConfiguration) {
      this.tableData = this.drawBnaTable(
        this.analyticsObject,
        this.tableConfiguration
      );
      this.tableObject = drawTable(
        this.analyticsObject,
        this.tableConfiguration,
        this.legendSets
      );
    }
  }

  drawBnaTable(analyticsObject: any, tableConfiguration: TableConfiguration) {
    // Get table rows
    const rowsItemsArray = this.getDimensionItemsArray(
      tableConfiguration.rows,
      analyticsObject
    );
    const tableRowsArray = this.getRowsOrColumnsArray(rowsItemsArray, 'row');

    // Get table columns
    const columnsItemsArray = this.getDimensionItemsArray(
      tableConfiguration.columns,
      analyticsObject
    );

    const tableColumnsArray = this.getRowsOrColumnsArray(
      columnsItemsArray,
      'column'
    );

    // get table header
    const tableHeaderRows = this.getTableHeaderRows(
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

    // TODO THIS IS A HACK TO MAKE BNA GROUPING WORK
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
          _.map(
            tableRows,
            (tableCell: any) =>
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

    mergedDataRowsArray = _.map(
      mergedDataRowsArray,
      (mergedDataRows: any[]) => {
        return _.map(mergedDataRows, (mergedDataCell: any) => {
          return {
            ...mergedDataCell,
            rowSpan: availableParent[mergedDataCell.id]
          };
        });
      }
    );

    return {
      headers: tableHeaderRows,
      rows: mergedDataRowsArray
    };
  }

  getTableHeaderRows(
    tableRow,
    tableColumnsArray,
    analyticsObject,
    tableConfiguration
  ) {
    let tableHeaderRows = [];

    _.each(
      tableColumnsArray,
      (tableColumn: any[], tableColumnIndex: number) => {
        const newTableColumn = _.map(
          tableColumn,
          (tableColumnCell: any, tableColumnCellIndex: number) => {
            const columnDimension =
              tableConfiguration.columns[tableColumnCellIndex];
            return {
              ...tableColumnCell,
              dimension: columnDimension,
              name: tableColumnCell.name
            };
          }
        );
        if (tableColumnIndex === 0) {
          tableHeaderRows = [
            ...tableHeaderRows,
            [
              ..._.map(
                tableRow,
                (tableRowCell: any, tableRowCellIndex: number) => {
                  const rowDimension =
                    tableConfiguration.rows[tableRowCellIndex];
                  return {
                    ...tableRowCell,
                    dimension: rowDimension,
                    name: analyticsObject.metaData.names[rowDimension],
                    rowSpan: tableColumnsArray.length
                  };
                }
              ),
              ...newTableColumn
            ]
          ];
        } else {
          tableHeaderRows = [...tableHeaderRows, newTableColumn];
        }
      }
    );

    return tableHeaderRows;
  }

  getDimensionItemsArray(dimensionItems: any[], analyticsObject) {
    return _.map(dimensionItems, (dimensionItem: string) => {
      const metadataIds = analyticsObject.metaData[dimensionItem];
      return _.map(metadataIds || [], (metadataId: string) => {
        const metadataName =
          analyticsObject &&
          analyticsObject.metaData &&
          analyticsObject.metaData.names
            ? analyticsObject.metaData.names[metadataId]
            : '';
        return {
          id: metadataId,
          name: metadataName
        };
      });
    });
  }

  getRowsOrColumnsArray(dataItemsArray: any, dimension: string) {
    let flatDataItemsArray = [];
    _.each(_.range(dataItemsArray.length), (dataItemArrayIndex: number) => {
      if (flatDataItemsArray.length === 0) {
        if (dimension === 'row') {
          _.each(dataItemsArray[dataItemArrayIndex], (rowsItem: any) => {
            flatDataItemsArray = [
              ...flatDataItemsArray,
              [{ ...rowsItem, column: 0, path: rowsItem.id }]
            ];
          });
        } else {
          flatDataItemsArray = [
            ...flatDataItemsArray,
            _.map(dataItemsArray[dataItemArrayIndex], (dataItem: any) => {
              return {
                ...dataItem,
                path: dataItem.id,
                textCenter: true,
                colSpan: _.reduce(
                  _.map(
                    _.slice(dataItemsArray, dataItemArrayIndex + 1),
                    (slicedDataItemsArray: any[]) => slicedDataItemsArray.length
                  ),
                  (product: number, count: number) => product * count
                )
              };
            })
          ];
        }
      } else {
        let innerFlatDataItemsArray = [];
        _.each(flatDataItemsArray, (flatDataItems: any[]) => {
          const path = _.join(
            _.map(flatDataItems, (dataItemObject: any) => dataItemObject.id),
            '/'
          );
          if (dimension === 'row') {
            _.each(
              dataItemsArray[dataItemArrayIndex],
              (dataItem: any, dataItemIndex: number) => {
                if (dataItemIndex === 0) {
                  innerFlatDataItemsArray = [
                    ...innerFlatDataItemsArray,
                    [
                      ..._.map(flatDataItems, (flatDataItem: any) => {
                        const span = _.reduce(
                          _.map(
                            _.slice(
                              dataItemsArray,
                              flatDataItem.column + 1,
                              dataItemArrayIndex + 1
                            ),
                            (itemArray: any[]) => itemArray.length
                          ),
                          (product: number, count: number) => product * count
                        );
                        return {
                          ...flatDataItem,
                          path: flatDataItem.path ? flatDataItem.path : path,
                          [dimension === 'row' ? 'rowSpan' : 'colSpan']: span
                        };
                      }),
                      {
                        ...dataItem,
                        path: `${path}/${dataItem.id}`,
                        column: dataItemArrayIndex
                      }
                    ]
                  ];
                } else {
                  innerFlatDataItemsArray = [
                    ...innerFlatDataItemsArray,
                    [
                      {
                        ...dataItem,
                        path: `${path}/${dataItem.id}`,
                        column: dataItemArrayIndex
                      }
                    ]
                  ];
                }
              }
            );
          }
        });

        if (dimension === 'column') {
          const flatDataItems = _.last(flatDataItemsArray);

          innerFlatDataItemsArray = [
            ...flatDataItemsArray,
            _.flatten(
              _.map(
                _.range(flatDataItems.length),
                (flatDataItemCount: number) => {
                  const path = flatDataItems[flatDataItemCount].path;
                  return _.map(
                    dataItemsArray[dataItemArrayIndex],
                    (dataItem: any) => {
                      return {
                        ...dataItem,
                        path: `${path}/${dataItem.id}`,
                        textCenter: true,
                        colSpan: _.reduce(
                          _.map(
                            _.slice(dataItemsArray, dataItemArrayIndex + 1),
                            (slicedDataItemsArray: any[]) =>
                              slicedDataItemsArray.length
                          ),
                          (product: number, count: number) => product * count
                        )
                      };
                    }
                  );
                }
              )
            )
          ];
        }
        flatDataItemsArray = innerFlatDataItemsArray;
      }
    });

    return flatDataItemsArray;
  }

  sortData(tableObject, n, isLastItem) {
    if (tableObject.columns.length === 1 && isLastItem) {
      this.current_sorting = [];
      this.current_sorting[n] = true;
      let table,
        rows,
        switching,
        i,
        x,
        y,
        shouldSwitch,
        dir,
        switchcount = 0;
      table = document.getElementById('myPivotTable');
      switching = true;
      //  Set the sorting direction to ascending:
      dir = 'asc';
      /*Make a loop that will continue until
       no switching has been done:*/
      while (switching) {
        //  start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName('TR');
        /*Loop through all table rows (except the
         first, which contains table headers):*/
        for (i = 0; i < rows.length - 1; i++) {
          // start by saying there should be no switching:
          shouldSwitch = false;
          /*Get the two elements you want to compare,
           one from current row and one from the next:*/
          x = rows[i].getElementsByTagName('TD')[n];
          y = rows[i + 1].getElementsByTagName('TD')[n];
          /*check if the two rows should switch place,
           based on the direction, asc or desc:*/
          if (dir === 'asc') {
            if (parseFloat(x.innerHTML)) {
              if (parseFloat(x.innerHTML) > parseFloat(y.innerHTML)) {
                // if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            } else {
              if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                // if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
            this.sort_direction[n] = 'asc';
          } else if (dir === 'desc') {
            if (parseFloat(x.innerHTML)) {
              if (parseFloat(x.innerHTML) < parseFloat(y.innerHTML)) {
                // if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            } else {
              if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                // if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
            }
            this.sort_direction[n] = 'desc';
          }
        }
        if (shouldSwitch) {
          /*If a switch has been marked, make the switch
           and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
          // Each time a switch is done, increase this count by 1:
          switchcount++;
        } else {
          /*If no switching has been done AND the direction is 'asc',
           set the direction to 'desc' and run the while loop again.*/
          if (switchcount === 0 && dir === 'asc') {
            dir = 'desc';
            this.sort_direction[n] = 'desc';
            switching = true;
          }
        }
      }
    }
  }
}
