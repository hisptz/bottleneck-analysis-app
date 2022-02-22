import { atomFamily, selectorFamily } from "recoil";
import { EngineState } from "../../../../../../../core/state/dataEngine";
import { ThematicMapLayer } from "../../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { getIndicators } from "../services/config";

export const MapConfigState = atomFamily<any | undefined, string | undefined>({
  key: "map-config-state",
  default: selectorFamily<any | undefined, string | undefined>({
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
        const thematicLayers = get(
          InterventionStateSelector({
            id,
            path: ["map", "coreLayers", "thematicLayers"],
          })
        );
        if (thematicLayers) {
          const indicatorIds = thematicLayers?.map((layer: ThematicMapLayer) => layer.indicator);
          return await getIndicators(indicatorIds, engine);
        }
      },
  }),
});

export const MapIndicatorSelector = selectorFamily({
  key: "map-indicator-selector",
  get:
    ({ id, indicatorId }: { id?: string; indicatorId?: string }) =>
    ({ get }) => {
      const indicators = get(MapIndicatorState(id));
      return indicators?.find(({ id }) => id === indicatorId);
    },
});
