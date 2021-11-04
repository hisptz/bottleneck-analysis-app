export interface OrgUnit {
  id: string;
}

export interface OrgUnitSelection {
  orgUnits?: Array<OrgUnit>;
  userOrgUnit?: boolean;
  userSubUnit?: boolean;
  userSubX2Units?: boolean;
  levels?: Array<string>;
  groups?: Array<string>;
}
