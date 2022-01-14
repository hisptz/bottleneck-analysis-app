import { atomFamily } from "recoil";

export const ChartRef = atomFamily<any | null, string>({
  key: "chart-ref",
  default: null,
  dangerouslyAllowMutability: true,
});
