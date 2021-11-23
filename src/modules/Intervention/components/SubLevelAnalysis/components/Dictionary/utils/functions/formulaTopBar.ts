import { filter } from "lodash";
import { dataSourceTypes } from "../models";
import { getValueDataSourcePromise, isPureDataElement } from "./formulaFunctions";

export default function IdentifiableObjectDataSource(engine: any, arrId: Array<string>) {
  return arrId?.map((id: string) => {
    return getValueDataSourcePromise(engine, id);
  });
}

export function getDataSourceType(formula: string) {
  if (formula?.search("dataElements") >= 0) {
    return dataSourceTypes.DATA_ELEMENT;
  }
  if (formula?.search("indicators") >= 0) {
    return dataSourceTypes.INDICATOR;
  }
  if (formula?.search("programIndicators") >= 0) {
    return dataSourceTypes.PROGRAM_INDICATOR;
  }
  if (formula?.search("dataElementGroups") >= 0) {
    return dataSourceTypes.DATA_ELEMENT_GROUP;
  }
  if (formula?.search("indicatorGroups") >= 0) {
    return dataSourceTypes.INDICATOR_GROUP;
  }
  if (formula?.search("dataStore/function") >= 0) {
    return dataSourceTypes.FUNCTION;
  }
  if (formula?.search("dataSets") >= 0) {
    return dataSourceTypes.DATASET;
  }
}

export function displayNameSelector(id: string, obj: any) {
  if (isPureDataElement(id)) {
    return obj.displayName;
  } else {
    const ruleId = id.split(".")[1];
    const ruleObjectSelected = filter(obj?.rules, (e) => {
      return e?.id === ruleId;
    }); //will return matched object with one element

    return ruleObjectSelected[0]?.name;
  }
}

export function displayNameLength(name: string) {
  if (name?.length > 18) {
    return name?.substr(0, 16) + "...";
  } else {
    return name;
  }
}

export function idOrRuleSelector(id: string, obj: any) {
  if (isPureDataElement(id)) {
    return obj.id;
  } else {
    const ruleId = id.split(".")[1];
    const ruleObjectSelected = filter(obj?.rules, (e) => {
      return e?.id === ruleId;
    });
    return ruleObjectSelected[0];
  }
}

export function typeOrFunctionSelector(id: string, obj: any) {
  if (isPureDataElement(id)) {
    return getDataSourceType(obj.href);
  } else {
    return obj;
  }
}

export function displayBool(val: boolean) {
  if (val) {
    return "Yes";
  } else {
    return "No";
  }
}
