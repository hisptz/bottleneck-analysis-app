import { atomFamily, selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../core/state/dataEngine";
import { LayerConfig } from "../../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { getIndicators } from "../services/config";

export const MapConfigState = atomFamily<LayerConfig | undefined, string | undefined>({
  key: "map-config-state",
  default: selectorFamily<LayerConfig | undefined, string | undefined>({
    key: "map-config-state-getter",
    get:
      (id?: string) =>
      ({ get }) => {
        return get(
          InterventionStateSelector({
            id,
            path: ["map", "config"],
          })
        );
      },
  }),
});

export const MapIndicatorState = atomFamily<Array<any> | undefined, string | undefined>({
  key: "map-indicator-state",
  default: selectorFamily<Array<any> | undefined, string | undefined>({
    key: "map-indicator-state-getter",
    get:
      (id?: string) =>
      async ({ get }) => {
        const engine = get(EngineState);
        const indicatorConfig = get(
          InterventionStateSelector({
            id,
            path: ["map", "indicators"],
          })
        );
        return await getIndicators(
          indicatorConfig?.map(({ id }: { id: string }) => id),
          engine
        );
      },
  }),
});
