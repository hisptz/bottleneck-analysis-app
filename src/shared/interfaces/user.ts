import { OrgUnit } from "./orgUnit";

export interface User {
  id: string;
  name: string;
  organisationUnits: Array<OrgUnit>;
  authorities: Array<string>;
  userGroups: Array<{ id: string; name: string }>;
}
