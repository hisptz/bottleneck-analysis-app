import { Period } from "@iapps/period-utilities";
import { selectorFamily } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import { UserState } from "../../../core/state/user";
import { InterventionState } from "./intervention";

export const InterventionPeriodState = selectorFamily({
  key: "activePeriodState",
  get:
    (interventionId: string) =>
    ({ get }) => {
      const { periodSelection } = get(InterventionState(interventionId));
      return new Period().getById(periodSelection.id);
    },
});

const query = {
  orgUnit: {
    resource: "organisationUnits",
    id: ({ id }: any) => id,
    params: {
      fields: ["id", "displayName", "level"],
    },
  },
};

export const InterventionOrgUnitState = selectorFamily({
  key: "activeOrgUnitState",
  get:
    (interventionId: string) =>
    async ({ get }) => {
      const { orgUnitSelection } = get(InterventionState(interventionId));
      if (orgUnitSelection.orgUnit.id.includes("USER")) {
        const user = get(UserState);
        return user?.organisationUnits[0];
      }
      const engine = get(EngineState);
      const { orgUnit } = (await engine.query(query, { variables: { id: orgUnitSelection.orgUnit.id } })) ?? {};
      return orgUnit;
    },
});
