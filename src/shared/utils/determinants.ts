import { isEmpty, reduce } from "lodash";

export function allDeterminantsEmpty(determinants: Array<any>): boolean {
  return reduce(determinants, (acc, determinant) => acc && isEmpty(determinant?.items), true as boolean);
}
