import { find } from "lodash";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import { OldInterventionConfig } from "../../../shared/interfaces/oldInterventionConfig";
import getOldInterventions from "../../../shared/services/getOldInterventions";

export const DashboardsState = atom<OldInterventionConfig | undefined | any>({
  key: "dashboards-state",
  default: selector<Array<OldInterventionConfig> | undefined | any>({
    key: "dashboard-intervention-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      if (engine) {
        return await getOldInterventions(engine);
      }
      return [];
    },
  }),
});

export const DashboardState = selectorFamily({
  key: "selected-dashboard-state",
  get:
    (id: string) =>
    ({ get }) => {
      const dashboards = get(DashboardsState);
      if (dashboards) {
        return find(dashboards, ["id", id]);
      }
    },
});

export const DashboardDetailsState = atomFamily<boolean, string>({
  key: "dashboard-details-state",
  default: false,
});
