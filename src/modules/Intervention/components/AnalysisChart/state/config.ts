import { selectorFamily } from "recoil";

export const ChartConfigState = selectorFamily<any, string>({
  key: "chartConfig",
  get: (interventionId: string) => () => {
    return {
      pointWidth: 160,
      interventionId,
    };
  },
});
