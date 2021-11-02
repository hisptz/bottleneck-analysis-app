import { atom, selector } from "recoil";
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
