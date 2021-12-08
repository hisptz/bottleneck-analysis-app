import { Period, PeriodInterface } from "@iapps/period-utilities";
import { atomFamily, selectorFamily } from "recoil";
import { CurrentInterventionSummary } from "../../../core/state/intervention";
import { OrgUnit } from "../../../core/state/orgUnit";
import { UserOrganisationUnit } from "../../../core/state/user";
import { OrgUnit as OrgUnitType } from "../../../shared/interfaces/orgUnit";

export const InterventionPeriodState = atomFamily<PeriodInterface, string>({
  key: "intervention-period",
  default: selectorFamily<PeriodInterface, string>({
    key: "activePeriodState",
    get:
      (interventionId: string) =>
      ({ get }) => {
        const { periodSelection } = get(CurrentInterventionSummary(interventionId)) ?? {};
        if (periodSelection) {
          return new Period().setPreferences({ allowFuturePeriods: true }).getById(periodSelection?.id) as PeriodInterface;
        }
        return new Period().setPreferences({ allowFuturePeriods: true }).get() as unknown as PeriodInterface;
      },
  }),
});

export const InterventionOrgUnitState = atomFamily<OrgUnitType, string>({
  key: "intervention-orgUnit",
  default: selectorFamily({
    key: "activeOrgUnitState",
    get:
      (interventionId: string) =>
      async ({ get }) => {
        const { orgUnitSelection } = get(CurrentInterventionSummary(interventionId)) ?? {};
        if (orgUnitSelection) {
          if (orgUnitSelection?.orgUnit?.id && !orgUnitSelection?.orgUnit?.id?.includes("USER")) {
            return get(OrgUnit(orgUnitSelection?.orgUnit?.id));
          }
        }
        return get(UserOrganisationUnit);
      },
  }),
});
