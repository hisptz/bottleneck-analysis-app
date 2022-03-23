import i18n from "@dhis2/d2-i18n";
import * as _ from "lodash";
import { get as _get, isEmpty } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { getCustomFunctionAnalytics } from "../../../../../shared/services/customFunctionAnalytics";
import { CustomFunction } from "../../../../../shared/state/customFunctions";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../state/selections";
import { DataItems } from "../../SubLevelAnalysis/state/dimensions";
import { getChartAnalytics } from "../services/getChartAnalytics";

export const ChartData = selectorFamily({
  key: "chart-data",
  get:
    (id: string) =>
    async ({ get, getCallback }) => {
      if (isArchiveId(id)) {
        const { chartData } = get(Archive(id)) ?? {};
        return chartData;
      }
      const engine = get(EngineState);
      const period = get(InterventionPeriodState(id))?.id;
      const orgUnit = get(InterventionOrgUnitState(id))?.id;
      const { dataItems, functions } = get(DataItems(id));

      if (isEmpty([...dataItems, ...functions])) {
        throw Error(i18n.t("There are no indicators configured for this intervention"));
      }

      if (isEmpty(period) || isEmpty(orgUnit)) {
        throw Error(i18n.t("There are no organisation units or periods configured for this intervention"));
      }

      const getCustomFunction = getCallback(({ snapshot }) => async (functionId: string) => {
        return await snapshot.getPromise(CustomFunction(functionId));
      });

      const dataItemsData = await getChartAnalytics({ dx: dataItems, ou: [orgUnit], pe: period }, engine);
      const functionsData = await getCustomFunctionAnalytics({ functions, getCustomFunction, periods: [period], orgUnits: [orgUnit] });

      return {
        ...dataItemsData,
        rows: [...dataItemsData.rows, ...(functionsData ?? [])],
      };
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
