import { ACCESS_VIEW_ONLY, ACCESS_NONE, ACCESS_VIEW_AND_EDIT, SHARE_TARGET_EXTERNAL, SHARE_TARGET_PUBLIC } from "../../../constants/constants";

const permanentTargets = [SHARE_TARGET_EXTERNAL, SHARE_TARGET_PUBLIC];

export const isRemovableTarget = (target) => {
  // Do not allow removal of permanent targets
  return !permanentTargets.includes(target);
};
