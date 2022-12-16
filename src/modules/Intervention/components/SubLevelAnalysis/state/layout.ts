import { Period, PeriodInterface } from "@iapps/period-utilities";
import { isEmpty } from "lodash";
import { atomFamily, selectorFamily } from "recoil";
import { SystemSettingsState } from "../../../../../core/state/system";
import { DataItem, Group, InterventionConfig, Legend } from "../../../../../shared/interfaces/interventionConfig";
import { TableLayout as Layout } from "../../../../../shared/interfaces/layout";
import { InterventionState } from "../../../state/intervention";
import { InterventionPeriodState } from "../../../state/selections";
import { normalTableLayout } from "../constants/tableLayouts";
import { SubLevelAnalyticsData } from "./data";

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

function assignValuesToLayout(
  type: "columns" | "rows" | "filter",
  {
    layout,
    intervention,
    data,
    period,
    calendar,
  }: {
    layout: Layout;
    intervention: InterventionConfig;
    data: any;
    period?: PeriodInterface;
    calendar: string;
  }
) {
  const dimensions = layout[type];
  for (const dimension of dimensions) {
    if (dimension === "dx") {
      const { dataSelection } = intervention;
      return dataSelection?.groups?.map((group: Group) => {
        return {
          id: group?.id,
          name: group?.name,
          children: group?.items?.map((item: DataItem) => {
            return {
              id: item?.id,
              name: item?.name,
              legend: item?.legends,
            };
          }),
        };
      });
    }
    if (dimension === "pe") {
      if (period) {
        return [
          {
            id: period.id,
            name: period.name,
          },
        ];
      }
      const currentPeriod = new Period().setCalendar(calendar).setPreferences({ allowFuturePeriods: true }).getById(`${new Date().getFullYear()}`);
      return {
        id: currentPeriod.id,
        name: currentPeriod.name,
      };
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

function getTableWidth(columns: any[]) {
  const count = columns.reduce((acc: any, column: { children: any[] }) => {
    const childrenCount =
      column.children?.reduce((acc: number, child: any) => {
        if (child) {
          return acc + 1;
        }
        return acc;
      }, 0) ?? 0;
    if (childrenCount > 0) {
      return acc + childrenCount;
    }
    return acc + 1;
  }, 0);

  return count * 100 + 400;
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
      if (intervention) {
        const period = get(InterventionPeriodState(id));
        const filter = assignValuesToLayout("filter", { layout, intervention, data, period, calendar });
        const columns = assignValuesToLayout("columns", { layout, intervention, data, period, calendar });
        const rows = assignValuesToLayout("rows", { layout, intervention, data, period, calendar });
        const dataValues = data.rows;

        const width = getTableWidth(columns);
        return {
          columns,
          rows,
          filter,
          data: dataValues,
          height: data?.height,
          width,
        };
      }
    },
});
