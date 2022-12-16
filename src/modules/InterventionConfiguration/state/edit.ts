import { atomFamily } from "recoil";
import { CONFIG_STEPS } from "../constants/steps";
import { head } from "lodash";
import { ConfigStep } from "../interfaces";

export const SelectedDeterminantIndex = atomFamily<number | undefined, string | undefined>({
  key: "selected-determinant-id",
  default: undefined,
});

export const SelectedIndicatorIndex = atomFamily<number | undefined, string | undefined>({
  key: "selected-indicator-id",
  default: undefined,
});

export const UseShortName = atomFamily({
  key: "use-short-name",
  default: false,
});

export const IsNewConfiguration = atomFamily({
  key: "is-new-configuration",
  default: false,
});

export const ActiveStep = atomFamily<ConfigStep | any, string>({
  key: "intervention-config-active-step",
  default: head(CONFIG_STEPS),
});
