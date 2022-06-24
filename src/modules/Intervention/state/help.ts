import { atom } from "recoil";

const HelpState = atom({
  key: "help-state",
  default: false,
});

const HelpSteps = atom({
  key: "intro-js-state",
  default: [],
});

const HelpIndex = atom({
  key: "current-step-index",
  default: 0,
});

export default HelpState;

export { HelpSteps, HelpIndex };
