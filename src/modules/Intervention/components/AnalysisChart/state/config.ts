import { atomFamily } from "recoil";

export const ChartConfigState = atomFamily<any, string>({
  key: "chartConfig",
  default: (interventionId: string) => {
    return {
      pointWidth: 100,
      interventionId,
    };
  },
});
