import { atomFamily } from "recoil";

export const SelectedDeterminantIndex = atomFamily<number | undefined, string>({
  key: "selected-determinant-id",
  default: undefined,
});

export const SelectedIndicatorIndex = atomFamily<number | undefined, string>({
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
