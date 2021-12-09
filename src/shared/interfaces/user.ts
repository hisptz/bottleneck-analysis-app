import { OrgUnit } from "./orgUnit";

export interface User {
  id: string;
  name: string;
  organisationUnits: Array<OrgUnit>;
}
