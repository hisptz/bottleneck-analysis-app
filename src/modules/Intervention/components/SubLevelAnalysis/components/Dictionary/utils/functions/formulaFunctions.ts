import { map } from "async-es";
import { dataTypes, dataTypesInitials } from "../models";

const identifiableQuery1 = {
  identifiableObjects: {
    resource: "identifiableObjects",
    id: ({ id }: any) => id,
    params: {
      fields: ["id", "displayName", "href"],
    },
  },
};

const queryIdentifiable2 = {
  identifiableObjects: {
    resource: "identifiableObjects",
    id: ({ id }: any) => id,
    params: {
      fields: ["id", "displayName", "href"],
    },
  },
  identifiableObjects2: {
    resource: "identifiableObjects",
    id: ({ id2 }: any) => id2,
    params: {
      fields: ["id", "displayName", "href"],
    },
  },
};
const dtEleSourceQuery = {
  dataElementSource: {
    resource: "dataElements",
    id: ({ id }: any) => id,
    params: {
      fields: ["id", "displayName", "dataSetElements[dataSet[id,displayName]]"],
    },
  },
};
const querySource = {
  dataElementSource: {
    resource: "dataElements",
    id: ({ id }: any) => id,
    params: {
      fields: ["id", "displayName", "dataSetElements[dataSet[id,displayName]]"],
    },
  },
  identifiableObjects: {
    resource: "identifiableObjects",
    id: ({ idCombo }: { idCombo: string }) => idCombo,
    params: {
      fields: ["id", "displayName"],
    },
  },
};

const programIndicatorQuery = {
  programIndicators: {
    resource: "programIndicators",
    id: ({ id }: any) => id,
    params: {
      fields: ["id", "displayName", "program[id,displayName]"],
    },
  },
};

const identifiableObjectsQuery = {
  identifiableObjectsProgram: {
    resource: "identifiableObjects",
    id: ({ idProgram }: { idProgram: string }) => idProgram,
    params: {
      fields: ["id", "displayName"],
    },
  },
  identifiableObjectsDtEle: {
    resource: "identifiableObjects",
    id: ({ idDataElement }: { idDataElement: string }) => idDataElement,
    params: {
      fields: ["id", "displayName"],
    },
  },
};

const functionQuery = {
  functions: {
    resource: "dataStore/functions",
    id: ({ idFunction }: { idFunction: string }) => idFunction,
  },
};

function loopGetSources(formula: string, sourceInitial: string) {
  let ind1 = 0;
  let ind2 = 0;
  const arr = [];

  const initialLength = sourceInitial?.length; //since we have case for initials like ORG{
  while (formula?.search(sourceInitial) >= 0) {
    //there is still a dataElement
    ind1 = formula.indexOf(sourceInitial) + initialLength - 2; //first occourance
    const subStr = formula.substr(ind1);
    ind2 = subStr?.indexOf("}");
    ind2 = ind2 + ind1;

    const datEl = formula.substring(ind1 + 2, ind2);
    arr.push(datEl);

    formula = setCharAt(formula, ind1, ""); //remove {
    formula = setCharAt(formula, ind1 - 1, ""); //removes #
    formula = setCharAt(formula, ind2 - 2, ""); //removes }
  }

  return arr;
}

export function getFormulaSources(formula: string, sourceInitial: string) {
  let arr = loopGetSources(formula, sourceInitial);
  if (sourceInitial === dataTypesInitials.DATASET_REPORTING_RATES) {
    const resultedArr: string[] = [];
    arr.filter((ele) => {
      resultedArr.push(ele.split(".")[0]); //elements comes as BfMAe6Itzgt.REPORTING_RATE or OsPTWNqq26W.EXPECTED_REPORTS so we do this to just take the id
    });
    arr = resultedArr;
  }
  return arr;
}

export function setCharAt(str: string, index: number, chr: string) {
  if (index > str.length - 1) {
    return str;
  }
  return str.substring(0, index) + chr + str.substring(index + 1);
}

async function getValueIdentifiableObjects2(engine: any, id: string, id2: string) {
  const data = await engine.query(queryIdentifiable2, {
    variables: { id, id2 },
  });
  return [data?.identifiableObjects?.displayName, data?.identifiableObjects2.displayName];
}

async function getValueIdentifiableObjects(engine: any, id: string) {
  const data = await engine.query(identifiableQuery1, { variables: { id } });
  return [data?.identifiableObjects?.displayName];
}

async function getValueDataElementSource(engine: any, id: string) {
  const data = await engine.query(dtEleSourceQuery, { variables: { id } });
  return [data?.dataElementSource];
}

async function getValueProgramIndicator(engine: any, id: string) {
  const data = await engine.query(programIndicatorQuery, { variables: { id } });
  return [data?.programIndicators];
}

async function getValueDataElementSourceWithCombo(engine: any, id: string, idCombo: any) {
  const data = await engine.query(querySource, { variables: { id, idCombo } });
  return [data?.dataElementSource, data?.identifiableObjects.displayName];
}

async function getValueProgramDataElementWithSource(engine: any, idProgram: string, idDataElement: string) {
  const data = await engine.query(identifiableObjectsQuery, {
    variables: { idProgram, idDataElement },
  });
  return [data?.identifiableObjectsProgram?.displayName, data?.identifiableObjectsDtEle?.displayName];
}

async function getValueDataSource(engine: any, id: string) {
  if (isPureDataElement(id)) {
    //its a function
    const data = await engine.query(identifiableQuery1, { variables: { id } });
    return [data?.identifiableObjects];
  } else {
    const idFunction = id.split(".")[0];
    const data = await engine.query(functionQuery, {
      variables: { idFunction },
    });
    return [data?.functions];
  }
}

export function getFormulaInWordsFromFullSources(formula: string, arrOfSources: string | any[]) {
  for (let i = 0; i < arrOfSources?.length; i++) {
    if (formula?.search(arrOfSources[i]?.id) >= 0) {
      formula = formula?.replace(arrOfSources[i]?.id, arrOfSources[i]?.val);
    }
  }
  return formula;
}

// eslint-disable-next-line max-params
export function getFinalWordFormula(
  formula: string,
  {
    dataElements,
    programIndicators,
    dataSetReportingRates,
    attributes,
    constants,
    programDataElements,
    orgUnitCount,
  }: {
    dataElements: Array<any>;
    programIndicators: string | any[];
    dataSetReportingRates: string | any[];
    attributes: string | any[];
    constants: string | any[];
    programDataElements: string | any[];
    orgUnitCount: string | any[];
  }
) {
  //need to be reduced to a loop
  let final = getFormulaInWordsFromFullSources(formula, dataElements);
  final = getFormulaInWordsFromFullSources(final, programIndicators);
  final = getFormulaInWordsFromFullSources(final, dataSetReportingRates);
  final = getFormulaInWordsFromFullSources(final, attributes);
  final = getFormulaInWordsFromFullSources(final, constants);
  final = getFormulaInWordsFromFullSources(final, orgUnitCount);
  final = getFormulaInWordsFromFullSources(final, programDataElements);

  //replacing all occurrence of the following globally
  final = final?.replace(/#{/g, "{");
  final = final?.replace(/I{/g, "{");
  final = final?.replace(/D{/g, "{");
  final = final?.replace(/V{/g, "{");
  final = final?.replace(/C{/g, "{");
  final = final?.replace(/A{/g, "{");
  final = final?.replace(/R{/g, "{");
  final = final?.replace(/OUG{/g, "{");

  if (dataSetReportingRates?.length !== 0) {
    //replace those caps
    //has to be fixed later
    final = final?.replace(/ACTUAL_REPORTS/g, "Actual_Reports");
    final = final?.replace(/REPORTING_RATE_ON_TIME/g, "Reporting_on_Time");
    final = final?.replace(/EXPECTED_REPORTS/g, "Expected_Reports");
    final = final?.replace(/REPORTING_RATE/g, "Reporting_Rate");
    final = final?.replace(/ACTUAL_REPORTS_ON_TIME/g, "Actual_Reports_on_Time");
  }

  final = final?.replace(/_/g, " ");
  final = final?.replace(/\./g, " ");

  return cleanBrackets(final);
}

export function lowerCaseAllWordsExceptFirstLetters(string: string) {
  return string?.replace(/\S*/g, function (word) {
    return word?.charAt(0) + word?.slice(1).toLowerCase();
  });
}

export function getSummaryValueFromApi(engine: any, id: string) {
  if (isPureDataElement(id)) {
    //fetch value normally
    return new Promise((resolve) => {
      resolve(getValueIdentifiableObjects(engine, id));
    });
  } else {
    //break to array and just take first element
    return new Promise((resolve) => {
      const arr = id.split(".");
      resolve(getValueIdentifiableObjects2(engine, arr[0], arr[1]));
    });
  }
}

export function getDetailedValueFromApi(engine: any, id: string, type: string) {
  if (type === dataTypes.DATA_ELEMENT) {
    if (isPureDataElement(id)) {
      //fetch value normally
      return new Promise((resolve) => {
        resolve(getValueDataElementSource(engine, id));
      });
    } else {
      //break to array and just take first element
      return new Promise((resolve) => {
        const arr = id.split(".");
        resolve(getValueDataElementSourceWithCombo(engine, arr[0], arr[1]));
      });
    }
  }
  if (type === dataTypes.PROGRAM_DATA_ELEMENT || type === dataTypes.ATTRIBUTES) {
    return new Promise((resolve) => {
      const arr = id.split(".");
      resolve(getValueProgramDataElementWithSource(engine, arr[0], arr[1]));
    });
  }

  if (type === dataTypes.PROGRAM_INDICATOR) {
    return new Promise((resolve) => {
      resolve(getValueProgramIndicator(engine, id));
    });
  } else {
    return new Promise((resolve) => {
      resolve(getValueIdentifiableObjects(engine, id));
    });
  }
}

export function getValueDataSourcePromise(engine: any, id: string) {
  return getValueDataSource(engine, id); //its automatically a promise since it is await
}

// eslint-disable-next-line max-params
export async function getWordData(engine: any, arr: any[], type: string, loc: any) {
  //arr for array of id of datas to get their values, type indicates the data type of data eg dataElement=0 program indicator=1, reporting rates=2

  if (arr.length > 0) {
    const allPromises = arr?.map((id) => {
      return getDetailedValueFromApi(engine, id?.replace(/ /g, ""), type);
    });

    return await Promise.all(allPromises).then((value: any) => {
      if (type === dataTypes.DATA_ELEMENT) {
        return value.map((val: string | any[], index: number) => {
          //We always return array just for uniformity
          if (val.length === 2) {
            //array of two elements first element is dataElement second element of array is category option combo

            return {
              id: arr[index],
              val: val[0].displayName + " " + val[1],
              location: loc,
              sources: val[0].dataSetElements,
            };
            // wordDtEl.push({id:arr[i],val:val[0].displayName+" "+val[1],location:loc,sources:val[0].dataSetElements})
          }
          if (val.length === 1) {
            //this is array of one element for data element that are just pure no category options
            return {
              id: arr[index],
              val: val[0].displayName,
              location: loc,
              sources: val[0].dataSetElements,
            };
            // wordDtEl.push({id:arr[i],val:val[0].displayName,"location":loc,sources:val[0].dataSetElements})
          }
        });
      }
      if (type === dataTypes.PROGRAM_INDICATOR) {
        return value.map((val: any, index: number) => {
          //We always return array just for uniformity
          return {
            id: arr[index],
            val: val[0].displayName,
            location: loc,
            sources: val[0].program,
          };
        });
      }
      if (type === dataTypes.DATASET_REPORTING_RATES) {
        return value.map((val: any[], index: number) => {
          //We always return array just for uniformity
          return { id: arr[index], val: val[0], location: loc };
        });
      } else {
        return value.map((val: any[], index: number) => {
          //We always return array just for uniformity
          return { id: arr[index], val: val[0], location: loc };
        });
      }
    });
  }
}

export async function getWordDataForAll(engine: any, arr: any[], loc: any) {
  if (arr.length > 0) {
    return await map(arr, async (id: string) =>
      getSummaryValueFromApi(engine, id).then((value: any) => {
        return value?.map((val: string | any[], index: number) => {
          //We always return array just for uniformity
          if (val.length === 2) {
            //array of two elements first element is dataElement second element of array is category option combo  or program stage then data element
            return { id: arr[index], val: val[0] + " " + val[1], location: loc };
          }
          if (val.length === 1) {
            //this is array of one element for data element that are just pure no category options
            return { id: arr[index], val: val[0], location: loc };
          }
        });
      })
    );
  }
}

function cleanBrackets(formula: string) {
  if (typeof formula !== dataTypes.UNDEFINED) {
    let arr: Array<string> = formula.split("{");
    let newString: string = arr.join("");
    arr = newString.split("}");
    newString = arr.join(" ");

    return newString;
  }
  return formula;
}

export function isPureDataElement(str: string | string[]) {
  return str?.indexOf(".") === -1;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
