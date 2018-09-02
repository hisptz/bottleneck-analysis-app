export interface FunctionObject {
  selected?: boolean;
  unsaved?: boolean;
  active?: boolean;
  id?: string;
  name?: string;
  displayName?: string;
  function?: string;
  rules?: Array<any>;
  description?: string;
  lastUpdated?: Date;
  created?: Date;
  externalAccess?: boolean;
  userGroupAccesses?: Array<any>;
  attributeValues?: Array<any>;
  translations?: Array<any>;
  userAccesses?: Array<any>;
  publicAccess?: string;
  href?: string;
  user?: any;
  saving?: boolean;
  isNew?: boolean;
  simulating?: boolean;
}
