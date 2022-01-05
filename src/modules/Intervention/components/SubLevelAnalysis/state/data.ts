import i18n from "@dhis2/d2-i18n";
import { isEmpty } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { getSubLevelAnalytics } from "../../../../../shared/services/analytics";
import { getCustomFunctionAnalytics } from "../../../../../shared/services/customFunctionAnalytics";
import { CustomFunction } from "../../../../../shared/state/customFunctions";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { InterventionPeriodState } from "../../../state/selections";
import { DataItems, SubLevelOrgUnit } from "./dimensions";

export const SubLevelAnalyticsData = selectorFamily({
  key: "analytics-data",
  get:
    (id: string) =>
    async ({ get, getCallback }) => {
      if (isArchiveId(id)) {
        const { subLevelData } = get(Archive(id)) ?? {};
        return subLevelData;
      }
      const engine = get(EngineState);
      const { dataItems, functions } = get(DataItems(id));
      const period = get(InterventionPeriodState(id))?.id;
      const orgUnit = get(SubLevelOrgUnit(id));

      if (isEmpty(dataItems)) {
        throw Error(i18n.t("There are no indicators configured for this intervention"));
      }

      if (isEmpty(period) || isEmpty(orgUnit)) {
        throw Error(i18n.t("There are no organisation units or periods configured for this intervention"));
      }

      const getCustomFunction = getCallback(({ snapshot }) => async (functionId: string) => {
        return await snapshot.getPromise(CustomFunction(functionId));
      });

      try {
        const dataItemsData = await getSubLevelAnalytics({ dx: dataItems, ou: orgUnit, pe: period }, engine);
        const functionsData = await getCustomFunctionAnalytics({ functions, getCustomFunction, periods: [period], orgUnits: orgUnit });

        return {
          ...dataItemsData,
          rows: [...dataItemsData.rows, ...(functionsData ?? [])],
        };
      } catch (e: any) {
        if (e?.details?.httpStatusCode === 409) {
          throw Error(`${i18n.t("Error getting data for sub-level analysis")}: ${e?.message ?? ""}`);
        }
      }
    },
});
