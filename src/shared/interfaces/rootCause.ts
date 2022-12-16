export interface RootCauseConfigDataElement {
  id: string;
  name: string;
  valueType: string;
  isHidden?: boolean;
  parentId?: string;
  associatedId?: string;
  isGroup?: boolean;
  routerParam?: {
    key: string;
    namespace: string;
  };
  optionSetValue: boolean;
  columnMandatory: boolean;
}

export interface RootCauseConfigInterface {
  id: string;
  name: string;
  dataElements: Array<RootCauseConfigDataElement>;
}
