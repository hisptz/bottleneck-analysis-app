import { useEffect, useState } from "react";
import { getDetailedValueFromApi, getFormulaSources } from "../../functions/formulaFunctions";
import { dataTypes, dataTypesInitials } from "../../models";

export function useGetFormulaDataDetailed(formula: string, engine: any, location: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState<any | undefined>();

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setData({
        dataElements: await getWordData(engine, getFormulaSources(formula, dataTypesInitials.DATA_ELEMENT), dataTypes.DATA_ELEMENT, location),
        programIndicators: await getWordData(engine, getFormulaSources(formula, dataTypesInitials.PROGRAM_INDICATOR), dataTypes.PROGRAM_INDICATOR, location),
        datasetReportingRates: await getWordData(
          engine,
          getFormulaSources(formula, dataTypesInitials.DATASET_REPORTING_RATES),
          dataTypes.DATASET_REPORTING_RATES,
          location
        ),
        attributes: await getWordData(engine, getFormulaSources(formula, dataTypesInitials.ATTRIBUTES), dataTypes.ATTRIBUTES, location),
        constants: await getWordData(engine, getFormulaSources(formula, dataTypesInitials.CONSTANTS), dataTypes.CONSTANTS, location),
        orgUnitCount: await getWordData(engine, getFormulaSources(formula, dataTypesInitials.ORG_UNIT_COUNT), dataTypes.ORG_UNIT_COUNT, location),
        programDataElements: await getWordData(
          engine,
          getFormulaSources(formula, dataTypesInitials.PROGRAM_DATA_ELEMENT),
          dataTypes.PROGRAM_DATA_ELEMENT,
          location
        ),
      });
      setLoading(false);
    }
    fetch().catch((error) => {
      setLoading(false);
      setError(error);
    });
  }, []);
  console.log(data);
  return {
    loading,
    error,
    data,
  };
}

// eslint-disable-next-line max-params
async function getWordData(engine: any, arr: any[], type: string, location: any) {
  //arr for array of id of datas to get their values, type indicates the data type of data eg dataElement=0 program indicator=1, reporting rates=2

  const allPromises = arr?.map((e) => {
    return getDetailedValueFromApi(engine, e, type);
  });

  return await Promise.all(allPromises).then((value: any) => {
    return value.map((val: Array<any>, i: number) => {
      if (type === dataTypes.DATA_ELEMENT) {
        if (val.length === 2) {
          //array of two elements first element is dataElement second element of array is category option combo
          return {
            id: arr[i],
            val: val[0].displayName + " " + val[1],
            location: location,
            sources: val[0].dataSetElements,
          };
        }
        if (val.length === 1) {
          //this is array of one element for data element that are just pure no category options
          return {
            id: arr[i],
            val: val[0].displayName,
            location: location,
            sources: val[0].dataSetElements,
          };
        }
      }
      if (type === dataTypes.ATTRIBUTES || type === dataTypes.PROGRAM_DATA_ELEMENT) {
        return { id: arr[i], val: val[1], location: location, sources: val[0] };
      }
      if (type === dataTypes.PROGRAM_INDICATOR) {
        return {
          id: arr[i],
          val: val[0].displayName,
          location: location,
          sources: val[0].program,
        };
      } else {
        //for orgUnit count, constants and reporting rates
        return { id: arr[i], val: val[0], location: location };
      }
    });
  });
}
