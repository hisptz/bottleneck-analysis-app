import { atomFamily, selectorFamily } from "recoil";
import { LayerConfig } from "../../../../../../../shared/interfaces/interventionConfig";
import { InterventionStateSelector } from "../../../../../state/intervention";

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
  key: "map-config-state",
  default: selectorFamily<Array<any> | undefined, string | undefined>({
    key: "map-config-state-getter",
    get:
      (id?: string) =>
      ({ get }) => {
        return get(
          InterventionStateSelector({
            id,
            path: ["map", "indicators"],
          })
        );
      },
  }),
});
