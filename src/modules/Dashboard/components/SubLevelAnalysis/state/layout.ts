import { find, flattenDeep, isEmpty } from "lodash";
import { atomFamily, selectorFamily } from "recoil";
import { DashboardConfig, GlobalSelection, SelectionGroup, SelectionItem } from "../../../../../shared/types/dashboardConfig";
import { TableLayout as Layout } from "../../../../../shared/types/layout";
import { DashboardState } from "../../../state/dashboard";

export const TableLayout = atomFamily<Layout, string>({
  key: "sub-level-layout-state",
  default: () => ({
    columns: ["ou"],
    rows: ["dx"],
    filter: ["pe"],
  }),
});

function assignValuesToLayout(type: "columns" | "rows" | "filter", layout: Layout, selections: Array<GlobalSelection>) {
  const selectedLayout = layout[type];
  return selectedLayout.map((dimensionKey) => {
    const dimension = find(selections, ["dimension", dimensionKey]);
    if (isEmpty(dimension?.groups)) {
      return dimension?.items ?? [];
    }
    return dimension?.groups ?? [];
  });
}

function getRowNames(layout: Layout, rows: Array<Array<SelectionGroup> | Array<SelectionItem>>) {
  return flattenDeep(
    layout.rows.map((row) => {
      if (row === "dx") {
        return ["Determinant", "Indicator"];
      }
      return [""];
    })
  );
}

type TableConfigType = {
  columns: Array<Array<SelectionGroup> | Array<SelectionItem>>;
  rows: Array<Array<SelectionGroup> | Array<SelectionItem>>;
  filter: Array<Array<SelectionGroup> | Array<SelectionItem>>;
  rowNames: Array<string>;
};

export const TableConfig = selectorFamily<TableConfigType, string>({
  key: "table-config-state",
  get:
    (id: string) =>
    ({ get }): TableConfigType => {
      const layout = get(TableLayout(id));
      const dashboard: DashboardConfig = get(DashboardState(id));
      const { globalSelections } = dashboard ?? {};
      return {
        columns: assignValuesToLayout("columns", layout, globalSelections) ?? [],
        rows: assignValuesToLayout("rows", layout, globalSelections) ?? [],
        filter: assignValuesToLayout("filter", layout, globalSelections) ?? [],
        rowNames: getRowNames(layout, assignValuesToLayout("rows", layout, globalSelections)),
      };
    },
});
