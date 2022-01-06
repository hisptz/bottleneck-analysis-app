import { Period, PeriodInterface } from "@iapps/period-utilities";
import { atomFamily, selectorFamily } from "recoil";
import { CurrentInterventionSummary } from "../../../core/state/intervention";
import { OrgUnit } from "../../../core/state/orgUnit";
import { SystemSettingsState } from "../../../core/state/system";
import { UserOrganisationUnit } from "../../../core/state/user";
import { OrgUnit as OrgUnitType } from "../../../shared/interfaces/orgUnit";
import { isArchiveId } from "../../../shared/utils/archives";
import { getCurrentPeriod } from "../../../shared/utils/period";
import { Archive } from "../../Archives/state/data";

export const InterventionPeriodState = atomFamily<PeriodInterface, string>({
  key: "intervention-period",
  default: selectorFamily<PeriodInterface, string>({
    key: "activePeriodState",
    get:
      (interventionId: string) =>
      ({ get }) => {
        if (isArchiveId(interventionId)) {
          return new Period().getById(get(Archive(interventionId))?.period ?? new Date().getFullYear().toString());
        }
        const { calendar } = get(SystemSettingsState);
        const { periodSelection } = get(CurrentInterventionSummary(interventionId)) ?? {};
        if (periodSelection) {
          if (periodSelection?.id) {
            return new Period().setCalendar(calendar).setPreferences({ allowFuturePeriods: true }).getById(periodSelection?.id) as PeriodInterface;
          }
          if (periodSelection?.type) {
            return getCurrentPeriod(periodSelection.type, calendar);
          }
        }
        return getCurrentPeriod("Yearly", calendar);
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
        if (isArchiveId(interventionId)) {
          return get(OrgUnit(get(Archive(interventionId))?.orgUnit));
        }

        const { orgUnitSelection } = get(CurrentInterventionSummary(interventionId)) ?? {};
        const userOrgUnit = get(UserOrganisationUnit);
        if (orgUnitSelection) {
          if (orgUnitSelection?.orgUnit?.id && !orgUnitSelection?.orgUnit?.id?.includes("USER")) {
            const orgUnit = get(OrgUnit(orgUnitSelection?.orgUnit?.id));
            if (userOrgUnit) {
              if (orgUnit?.level > userOrgUnit?.level) {
                return orgUnit;
              }
            }
          }
        }
        return userOrgUnit;
      },
  }),
});
