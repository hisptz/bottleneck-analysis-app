import { Period, PeriodInterface } from "@iapps/period-utilities";
import { compact, filter, find, findIndex, flatten, flattenDeep, forEach, fromPairs, get, groupBy, head, isEmpty, last, mapValues, reduce, set } from "lodash";
import { atomFamily, selectorFamily } from "recoil";
import { SystemSettingsState } from "../../../../../core/state/system";
import { DataItem, Group, InterventionConfig, Legend } from "../../../../../shared/interfaces/interventionConfig";
import { Dimension, TableLayout as Layout } from "../../../../../shared/interfaces/layout";
import { InterventionState } from "../../../state/intervention";
import { InterventionPeriodState } from "../../../state/selections";
import { normalTableLayout, switchedTableLayout } from "../constants/tableLayouts";
import { SubLevelAnalyticsData } from "./data";
import { Analytics } from "@hisptz/dhis2-utils";
import { Column } from "react-table";
import i18n from "@dhis2/d2-i18n";

export const TableLayout = atomFamily<Layout, string>({
  key: "sub-level-layout-state",
  default: () => normalTableLayout,
});

interface TableItem {
  id: string;
  name: string;
  children?: Array<TableItem>;
  legend?: Array<Legend>;
}

type TableConfigType = {
  columns: Array<Column<Record<string, any>>>;
  data: Record<string, any>[];
  rowState: Record<string, any>;
};

function getColumnsFromDimension({
  dimension,
  determinants,
  data,
}: {
  dimension: Dimension;
  determinants: Group[];
  data: Analytics;
}): Column<Record<string, any>>[] {
  if (dimension === "dx") {
    return determinants.map(({ id: groupId, name, items }) => {
      return {
        id: groupId,
        Header: name,
        columns: items.map(({ id, label }) => {
          return {
            id,
            Header: label,
            accessor: (originalRow) => {
              return originalRow[id];
            },
          };
        }),
      };
    });
  } else {
    return (
      data.metaData?.dimensions[dimension]?.map((item) => {
        const itemConfig = (data.metaData?.items as any)?.[item];
        return {
          id: item,
          Header: itemConfig?.name,
          accessor: (originalRow) => {
            return originalRow[item];
          },
        } as Column<Record<string, any>>;
      }) ?? []
    );
  }
}

function getColumns({ layout, data, determinants }: { layout: Layout; determinants: Group[]; data: Analytics }): Column<Record<string, any>>[] {
  const { columns: dimensions, filter: filters, rows } = layout ?? {};

  const columns: Column<Record<string, any>>[] = reduce(
    dimensions,
    (acc, dimension) => {
      if (isEmpty(acc)) {
        return getColumnsFromDimension({ dimension, data, determinants });
      } else {
        return acc.map((column: Column) => ({ ...column, columns: getColumnsFromDimension({ dimension, data, determinants }) }));
      }
    },
    [] as any
  );

  const headerColumns: Column<Record<string, any>>[] = flattenDeep(
    rows.map((row) => {
      const itemConfig = (data.metaData?.items as any)?.[row];
      if (row === "dx") {
        //Should generate 2 columns, one for group and one for dataItem
        return [
          {
            id: `group`,
            Header: i18n.t("Determinants"),
            accessor: (originalRow) => {
              return originalRow?.group;
            },
          },
          {
            id: row,
            Header: itemConfig?.name ?? "",
            accessor: (originalRow: any) => {
              return originalRow.dx;
            },
          },
        ] as Column<Record<string, any>>[];
      }
      return {
        id: row,
        Header: itemConfig?.name ?? "",
        accessor: (originalRow: any) => {
          return originalRow[row];
        },
      };
    })
  );

  const filterLabel = filters.map((dimension: Dimension) => {
    return data.metaData?.dimensions[dimension]?.map((itemId) => {
      return (data.metaData?.items as any)?.[itemId]?.name;
    });
  });

  return [
    {
      Header: filterLabel.join(", "),
      id: filters.join(","),
      columns: [...headerColumns, ...columns] as Column<Record<string, any>>[],
    },
  ];
}

function getData(
  data: Analytics,
  { layout, determinants }: { layout: Layout; determinants: Group[] }
): {
  data: Record<string, any>[];
  rowState: Record<string, any>;
} {
  const valueIndex = findIndex(data.headers, ["name", "value"]);
  const rowState: Record<string, any> = {};

  if (head(layout.rows) === "dx") {
    //We have determinants as the rows.
    const rowData = determinants
      .map(({ id, items, name: groupName }) => {
        return items.map(({ id: dataItemId, name, legends }, index) => {
          set(rowState, [dataItemId, "legends"], [...legends]);
          const row = fromPairs([
            ["id", dataItemId],
            ["dx", name],
            ...(data.metaData?.dimensions?.[last(layout.columns) ?? "pe"]?.map((item: string) => {
              const value = filter(data.rows as unknown as string[][], (row) => row.includes(dataItemId) && row.includes(item)).reduce((acc, value) => {
                return acc + parseFloat(value[valueIndex]);
              }, 0) as number;
              return [item, value.toString()];
            }) ?? []),
          ]);

          if (index === 0) {
            set(row, ["group"], groupName);
            set(rowState, [dataItemId, "cellState", "group", "rowSpan"], items.length);
          } else {
            set(rowState, [dataItemId, "cellState"], {});
          }
          return row;
        });
      })
      .flat();

    return {
      data: rowData,
      rowState,
    };
  } else {
    const dimension = head(layout.rows) ?? "pe";
    const rowData =
      data.metaData?.dimensions?.[dimension]?.map((itemId) => {
        const itemName = (data.metaData?.items as any)?.[itemId]?.name;
        return fromPairs([
          ["id", itemId],
          [dimension, itemName],
          ...(data.metaData?.dimensions?.[last(layout.columns) ?? "pe"]?.map((item: string) => {
            const legends = find(flattenDeep(determinants.map(({ items }) => items)), ["id", item])?.legends;

            set(rowState, [itemId, "cellState", item], { legends });
            const value = filter(data.rows as unknown as string[][], (row) => row.includes(itemId) && row.includes(item)).reduce((acc, value) => {
              return acc + parseFloat(value[valueIndex]);
            }, 0) as number;
            return [item, value.toString()];
          }) ?? []),
        ]);
      }) ?? [];

    return {
      data: rowData,
      rowState,
    };
  }
}

function getTableProps({
  intervention,
  data,
  period,
  layout,
}: {
  intervention: InterventionConfig;
  period: PeriodInterface;
  data: Analytics;
  layout: Layout;
}): TableConfigType {
  const columns = getColumns({ layout, data, determinants: intervention.dataSelection.groups }) ?? [];
  const { data: rowData, rowState } = getData(data, { layout, determinants: intervention.dataSelection.groups }) ?? [];

  return {
    columns,
    data: rowData,
    rowState,
  };
}

export const TableConfig = selectorFamily<TableConfigType | undefined, string>({
  key: "table-config-state",
  get:
    (id: string) =>
    ({ get }): TableConfigType | undefined => {
      const { calendar } = get(SystemSettingsState);
      const layout = get(TableLayout(id));
      const data = get(SubLevelAnalyticsData(id));
      const intervention: InterventionConfig | undefined = get(InterventionState(id));

      const period = get(InterventionPeriodState(id));

      if (intervention) {
        return getTableProps({
          layout,
          intervention,
          period,
          data,
        });
      }
    },
});
