export interface FunctionRule {
  id: string;
  name: string;
  json: string;
  isDefault?: boolean;
}

export interface CustomFunction {
  id: string;
  created: string;
  displayName: string;
  externalAccess: boolean;
  function: string;
  href: string;
  lastUpdated: string;
  publicAccess: string;
  rules: Array<FunctionRule>;
  translation: Array<any>;
}
