import { atom, atomFamily, selector, selectorFamily } from "recoil";
import { getOrgUnitLevels } from "../services/orgUnits";
import { EngineState } from "./dataEngine";

export const OrgUnitLevels = atom<Array<{ id: string; level: number; displayName: string }>>({
  key: "orgUnitLevels",
  default: selector({
    key: "orgUnitLevelsSelector",
    get: async ({ get }) => {
      const engine = get(EngineState);
      return await getOrgUnitLevels(engine);
    },
  }),
});

const query = {
  orgUnit: {
    resource: "organisationUnits",
    id: ({ id }: any) => id,
    params: {
      fields: ["id", "displayName", "level", "path"],
    },
  },
};

export const OrgUnit = atomFamily({
  key: "orgUnit",
  default: selectorFamily({
    key: "orgUnit-getter",
    get:
      (orgUnitId: string) =>
      async ({ get }) => {
        const engine = get(EngineState);
        const { orgUnit } = (await engine.query(query, { variables: { id: orgUnitId } })) ?? {};
        return orgUnit;
      },
  }),
});
