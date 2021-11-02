import { find } from "lodash";
import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { EngineState } from "../../../core/state/dataEngine";
import getDashboards from "../../../shared/services/getDashboards";
import { DashboardConfig } from "../../../shared/types/dashboardConfig";

export const DashboardsState = atom<DashboardConfig | undefined | any>({
  key: "dashboards-state",
  default: selector<Array<DashboardConfig> | undefined | any>({
    key: "dashboard-intervention-getter",
    get: async ({ get }) => {
      const engine = get(EngineState);
      if (engine) {
        return await getDashboards(engine);
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
