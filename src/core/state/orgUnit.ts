import { reduce } from "lodash";
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

export const LastOrgUnitLevel = selector({
  key: "last-org-unit-level",
  get: ({ get }) => {
    const orgUnitLevels = get(OrgUnitLevels);
    return reduce(orgUnitLevels, (acc, level) => (level.level > acc.level ? level : acc));
  },
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
