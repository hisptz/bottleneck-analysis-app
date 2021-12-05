import { filter, flattenDeep } from "lodash";
import { atom, selectorFamily } from "recoil";
import { EngineState } from "../../../../../core/state/dataEngine";
import { UserOrganisationUnits } from "../../../../../core/state/user";
import { PeriodSelection } from "../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../state/intervention";
import { getRootCausesData } from "../services/data";

export const RootCauseDataRequestId = atom({
  key: "root-cause-config-request-id",
  default: 0,
});

export const RootCauseData = selectorFamily({
  key: "root-cause-analysis-data",
  get:
    (id: string) =>
    async ({ get }) => {
      const engine = get(EngineState);
      get(RootCauseDataRequestId);
      const periodSelection: PeriodSelection = get(
        InterventionStateSelector({
          id,
          path: ["periodSelection"],
        })
      );
      const { id: selectedPeriod } = periodSelection;
      const orgUnitSelection = get(
        InterventionStateSelector({
          id,
          path: ["orgUnitSelection", "orgUnit"],
        })
      );
      const { id: selectedOrgUnit, type } = orgUnitSelection;
      const { id: organisationUnitId } = get(UserOrganisationUnits);
      const rootCauseData = await getRootCausesData(engine, id);

      return filter(flattenDeep(rootCauseData), (data: any) => {
        const { id: rootCauseId } = data;
        return rootCauseId.match(`${selectedPeriod}_${type == "USER_ORGANISATION_UNIT" ? organisationUnitId : selectedOrgUnit}`);
      });
    },
});
