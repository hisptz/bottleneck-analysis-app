import i18n from "@dhis2/d2-i18n";
import * as _ from "lodash";
import { get as _get, isEmpty } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { InterventionPeriodState } from "../../../state/selections";
import { DataItems, OrgUnit } from "../../SubLevelAnalysis/state/dimensions";
import { getChartAnalytics } from "../services/getChartAnalytics";

export const ChartData = selectorFamily({
  key: "chart-data",
  get:
    (id: string) =>
    async ({ get }) => {
      if (isArchiveId(id)) {
        const { chartData } = get(Archive(id)) ?? {};
        return chartData;
      }
      const engine = get(EngineState);
      const period = get(InterventionPeriodState(id))?.id;
      const orgUnits = get(OrgUnit(id));
      const dataItems = get(DataItems(id));

      if (isEmpty(dataItems)) {
        throw Error(i18n.t("There are no indicators configured for this intervention"));
      }

      if (isEmpty(period) || isEmpty(orgUnits)) {
        throw Error(i18n.t("There are no organisation units or periods configured for this intervention"));
      }

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
