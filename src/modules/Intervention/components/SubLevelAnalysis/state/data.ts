import i18n from "@dhis2/d2-i18n";
import { isEmpty } from "lodash";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { getSubLevelAnalytics } from "../../../../../shared/services/analytics";
import { isArchiveId } from "../../../../../shared/utils/archives";
import { Archive } from "../../../../Archives/state/data";
import { InterventionPeriodState } from "../../../state/selections";
import { DataItems, SubLevelOrgUnit } from "./dimensions";

export const SubLevelAnalyticsData = selectorFamily({
  key: "analytics-data",
  get:
    (id: string) =>
    async ({ get }) => {
      if (isArchiveId(id)) {
        const { subLevelData } = get(Archive(id)) ?? {};
        return subLevelData;
      }
      const engine = get(EngineState);
      const dataItems = get(DataItems(id));
      const period = get(InterventionPeriodState(id))?.id;
      const orgUnit = get(SubLevelOrgUnit(id));

      if (isEmpty(dataItems)) {
        throw Error(i18n.t("There are no indicators configured for this intervention"));
      }

      if (isEmpty(period) || isEmpty(orgUnit)) {
        throw Error(i18n.t("There are no organisation units or periods configured for this intervention"));
      }

      return await getSubLevelAnalytics({ dx: dataItems, ou: orgUnit, pe: period }, engine);
    },
});
