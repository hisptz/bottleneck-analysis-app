import { atom, selector } from "recoil";
import { EngineState } from "./dataEngine";

const systemSettingsKeys = ["keyCalendar"];

const systemSettingsQuery = {
  system: {
    resource: "systemSettings",
    params: ({ keys }: any) => ({
      keys: keys?.map((key: string) => `key=${key}`),
    }),
  },
};

export const SystemSettingsState = atom({
  key: "system-settings-state",
  default: selector({
    key: "system-settings-selector",
    get: async ({ get }) => {
      const engine = get(EngineState);
      const { system } = await engine.query(systemSettingsQuery, {
        variables: { keys: systemSettingsKeys },
      });
      const { keyCalendar } = system ?? {};
      return {
        calendar: keyCalendar,
      };
    },
  }),
});
