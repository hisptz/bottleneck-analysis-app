/* eslint-disable no-console */
import * as _ from "lodash";
import { get as _get } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { DataItems, OrgUnit, Period } from "../../SubLevelAnalysis/state/dimensions";
import { getChartAnalytics } from "../services/getChartAnalytics";

export const ChartData = selectorFamily({
  key: "chart-data",
  get:
    (id: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      const period = get(Period(id));
      const orgUnits = get(OrgUnit(id));
      const dataItems = get(DataItems(id));
      return await getChartAnalytics({ dx: dataItems, ou: orgUnits, pe: period }, engine);
    },
});

export const ChartDataOrgUnit = selectorFamily({
  key: "chart-data-org-unit",
  get:
    (id: string) =>
    ({ get }) => {
      const data = get(ChartData(id));
      return _get(data, "metaData.ou.items", []);
    },
});

// create a selector famility to get org unit data from the  chartAnalytics
export const ChartOrgUnits = selectorFamily({
  key: "chart-org-units",
  get:
    (id: string) =>
    async ({ get }) => {
      const chartData = get(ChartData(id));

      return chartData?.metaData?.dimensions?.ou?.map((ouId: string) => {
        return _.get(chartData.metaData, "items." + ouId + ".name", []);
      });
    },
});
