import { TableConfiguration } from '../models/table-configuration';
import { LegendSet } from '../models/legend-set.model';
import { getTableTitleIndex } from './get-table-index.helper';
import { getTableColSpan } from './get-table-col-span.helper';
import { prepareSingleCategories } from './prepare-single-categories.helper';
import { checkForZeroTableValues } from './check-for-zero-table-values.helper';
import { getTableDataValue } from './get-table-data-value.helper';
import { getaTableDataValueColor } from './get-table-data-value-color.helper';
import { getTableLegendSets } from './get-table-legend-sets.helper';

export function drawTable(
  analyticsObject,
  tableConfiguration: TableConfiguration,
  legendSets: LegendSet[]
) {
  const legendClasses = tableConfiguration.legendSet
    ? tableConfiguration.legendSet.legends
    : null;

  const table = {
    headers: [],
    columns: [],
    rows: [],
    titles: {
      rows: [],
      column: []
    },
    titlesAvailable: false,
    hasParentOu: false
  };
  if (tableConfiguration.hasOwnProperty('title')) {
    table['title'] = tableConfiguration.title;
  }
  if (tableConfiguration.hasOwnProperty('subtitle')) {
    table['subtitle'] = tableConfiguration.subtitle;
  }
  if (tableConfiguration.displayList) {
    table.headers[0] = {
      items: [],
      style: ''
    };
    tableConfiguration.columns[tableConfiguration.columns.indexOf('pe')] =
      'eventdate';
    tableConfiguration.columns[tableConfiguration.columns.indexOf('ou')] =
      'ouname';
    for (const item of tableConfiguration.columns) {
      table.headers[0].items.push({
        name:
          analyticsObject.headers[
            getTableTitleIndex(analyticsObject.headers, item)
          ].column,
        span: 1
      });
    }
    for (const item of analyticsObject.rows) {
      const column_items = [];
      for (const col of tableConfiguration.columns) {
        const index = getTableTitleIndex(analyticsObject.headers, col);
        column_items.push({
          name: '',
          display: true,
          row_span: '1',
          // color:getColor(item[index],)
          val: item[index]
        });
      }
      table.rows.push({
        headers: [],
        items: column_items
      });
    }
  } else {
    // add names to titles array
    if (tableConfiguration.showDimensionLabels) {
      table.titlesAvailable = true;
      for (const item of tableConfiguration.columns) {
        table.titles.column.push(
          analyticsObject.headers[
            getTableTitleIndex(analyticsObject.headers, item)
          ].column
        );
      }
      for (const item of tableConfiguration.rows) {
        table.titles.rows.push(
          analyticsObject.headers[
            getTableTitleIndex(analyticsObject.headers, item)
          ].column
        );
      }
    }

    for (const columnItem of tableConfiguration.columns) {
      const dimension = getTableColSpan(
        analyticsObject,
        tableConfiguration.columns,
        columnItem
      );
      const currentColumnItems = prepareSingleCategories(
        analyticsObject,
        columnItem
      );
      const headerItem = [];
      for (let i = 0; i < dimension.duplication; i++) {
        for (const currentItem of currentColumnItems) {
          headerItem.push({
            name: currentItem.name,
            span: dimension.col_span,
            type: currentItem.type,
            id: currentItem.uid
          });
        }
      }

      let styles = '';
      if (tableConfiguration.hasOwnProperty('style')) {
        if (tableConfiguration.styles.hasOwnProperty(columnItem)) {
          styles = tableConfiguration.styles[columnItem];
        }
      }
      table.headers.push({ items: headerItem, style: styles });
    }
    for (const rowItem of tableConfiguration.rows) {
      table.columns.push(rowItem);
    }

    // Preparing table columns
    const column_length = tableConfiguration.columns.length;
    const column_items_array = [];
    for (let i = 0; i < column_length; i++) {
      const currentRowItems = prepareSingleCategories(
        analyticsObject,
        tableConfiguration.columns[i]
      );
      column_items_array.push(currentRowItems);
    }
    let table_columns_array = [];
    for (let i = 0; i < column_items_array.length; i++) {
      if (table_columns_array.length === 0) {
        for (const item of column_items_array[i]) {
          table_columns_array.push([item]);
        }
      } else {
        const temp_arr = table_columns_array.concat();
        table_columns_array = [];
        for (const item of temp_arr) {
          for (const val of column_items_array[i]) {
            if (item instanceof Array) {
              const tempArr = Array.from(item);
              table_columns_array.push(tempArr.concat([val]));
            } else {
              table_columns_array.push([item, val]);
            }
          }
        }
      }
    }

    // Preparing table rows
    const rows_length = tableConfiguration.rows.length;
    const row_items_array = [];
    for (let i = 0; i < rows_length; i++) {
      const dimension = getTableColSpan(
        analyticsObject,
        tableConfiguration.rows,
        tableConfiguration.rows[i]
      );
      const currentRowItems = prepareSingleCategories(
        analyticsObject,
        tableConfiguration.rows[i]
      );
      row_items_array.push({ items: currentRowItems, dimensions: dimension });
    }
    let table_rows_array = [];
    for (let i = 0; i < row_items_array.length; i++) {
      if (table_rows_array.length === 0) {
        for (const item of row_items_array[i].items) {
          item.dimensions = row_items_array[i].dimensions;
          table_rows_array.push([item]);
        }
      } else {
        const temp_arr = table_rows_array.concat();
        table_rows_array = [];
        for (const item of temp_arr) {
          for (const val of row_items_array[i].items) {
            val.dimensions = row_items_array[i].dimensions;
            if (item instanceof Array) {
              const tempArr = Array.from(item);
              table_rows_array.push(tempArr.concat([val]));
            } else {
              table_rows_array.push([item, val]);
            }
          }
        }
      }
    }

    let counter = 0;
    if (table_rows_array.length !== 0) {
      for (const rowItem of table_rows_array) {
        const item = {
          items: [],
          headers: rowItem
        };
        for (const val of rowItem) {
          if (counter === 0 || counter % val.dimensions.col_span === 0) {
            item.items.push({
              type: val.type,
              name: val.uid,
              val: val.name,
              row_span: val.dimensions.col_span,
              header: true
            });
          }
        }
        for (const colItem of table_columns_array) {
          const dataItem = [];
          for (const val of rowItem) {
            dataItem.push({ type: val.type, value: val.uid });
          }
          for (const val of colItem) {
            dataItem.push({ type: val.type, value: val.uid });
          }
          item.items.push({
            name: '',
            val: getTableDataValue(analyticsObject, dataItem),
            color: getaTableDataValueColor(
              getTableLegendSets(
                dataItem,
                legendClasses,
                legendSets,
                tableConfiguration,
                analyticsObject.metaData
              ),
              getTableDataValue(analyticsObject, dataItem)
            ),
            row_span: '1',
            display: true
          });
        }
        if (
          tableConfiguration.hasOwnProperty('hideEmptyRows') &&
          tableConfiguration.hideEmptyRows
        ) {
          if (
            !checkForZeroTableValues(tableConfiguration.rows.length, item.items)
          ) {
            table.rows.push(item);
          }
        } else {
          table.rows.push(item);
        }

        counter++;
      }
    } else {
      const item = {
        items: [],
        headers: []
      };
      for (const colItem of table_columns_array) {
        const dataItem = [];
        for (const val of colItem) {
          dataItem.push({ type: val.type, value: val.uid });
        }
        item.items.push({
          name: '',
          val: getTableDataValue(analyticsObject, dataItem),
          row_span: '1',
          display: true
        });
      }
      if (
        tableConfiguration.hasOwnProperty('hideEmptyRows') &&
        tableConfiguration.hideEmptyRows
      ) {
        if (
          !checkForZeroTableValues(tableConfiguration.rows.length, item.items)
        ) {
          table.rows.push(item);
        }
      } else {
        table.rows.push(item);
      }
    }
  }

  // todo improve total options to also work for event table
  // return _getSanitizedTableObject(table, tableConfiguration);
  return table;
}
