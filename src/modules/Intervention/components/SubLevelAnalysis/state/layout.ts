import { Period } from "@iapps/period-utilities";
import { isEmpty } from "lodash";
import { atomFamily, selectorFamily } from "recoil";
import { DataItem, Group, InterventionConfig, Legend } from "../../../../../shared/interfaces/interventionConfig";
import { TableLayout as Layout } from "../../../../../shared/interfaces/layout";
import { InterventionState } from "../../../state/intervention";
import { SubLevelAnalyticsData } from "./data";

export const TableLayout = atomFamily<Layout, string>({
  key: "sub-level-layout-state",
  default: () => ({
    columns: ["ou"],
    rows: ["dx"],
    filter: ["pe"],
  }),
});

interface TableItem {
  id: string;
  name: string;
  children?: Array<TableItem>;
  legend?: Array<Legend>;
}

function assignValuesToLayout(
  type: "columns" | "rows" | "filter",
  {
    layout,
    intervention,
    data,
  }: {
    layout: Layout;
    intervention: InterventionConfig;
    data: any;
  }
) {
  const dimensions = layout[type];
  for (const dimension of dimensions) {
    if (dimension === "dx") {
      const { dataSelection } = intervention;
      return dataSelection.groups.map((group: Group) => {
        return {
          id: group.id,
          name: group.name,
          children: group.items.map((item: DataItem) => {
            return {
              id: item.id,
              name: item.name,
              legend: item.legends,
            };
          }),
        };
      });
    }
    if (dimension === "pe") {
      const { periodSelection } = intervention;
      const period = new Period().setType(periodSelection.type);
      return [
        {
          id: periodSelection.id,
          name: period.getById(periodSelection.id).name,
        },
      ];
    }
    if (dimension === "ou") {
      const orgUnitKeys = data?.metaData?.dimensions?.ou;
      if (orgUnitKeys && !isEmpty(orgUnitKeys)) {
        return orgUnitKeys.map((key: string) => {
          return {
            id: key,
            name: data?.metaData?.items?.[key]?.name,
          };
        });
      }
    }
  }
}

type TableConfigType = {
  columns: Array<TableItem>;
  rows: Array<TableItem>;
  filter: Array<TableItem>;
  data: Array<Array<string>>;
  width: number;
  height: number;
};

export const TableConfig = selectorFamily<TableConfigType, string>({
  key: "table-config-state",
  get:
    (id: string) =>
    ({ get }): TableConfigType => {
      const layout = get(TableLayout(id));
      const data = get(SubLevelAnalyticsData(id));
      const intervention: InterventionConfig = get(InterventionState(id));
      const filter = assignValuesToLayout("filter", { layout, intervention, data });
      const columns = assignValuesToLayout("columns", { layout, intervention, data });
      const rows = assignValuesToLayout("rows", { layout, intervention, data });
      const dataValues = data.rows;
      return {
        columns,
        rows,
        filter,
        data: dataValues,
        width: data?.width,
        height: data?.height,
      };
    },
});
