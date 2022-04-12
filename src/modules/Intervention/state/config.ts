import { atomFamily } from "recoil";

export const FullPageState = atomFamily<boolean, string>({
  key: "fullPageState",
  default: (cardName: string) => {
    return false;
  },
});
