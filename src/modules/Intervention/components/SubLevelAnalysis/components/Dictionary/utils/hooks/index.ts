import { useEffect, useState } from "react";
import { getDataSetsArray, getNumDenMatch } from "../functions/dataElementGroupSetFunctions";
import { getFormulaSources, getWordDataForAll } from "../functions/formulaFunctions";
import { dataTypesInitials } from "../models";

export function useGetData(formula: string, engine: any, loc: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    let arrDtEle = getFormulaSources(formula, dataTypesInitials.DATA_ELEMENT);
    let arrProgInd = getFormulaSources(formula, dataTypesInitials.PROGRAM_INDICATOR);
    let arrDtSetRep = getFormulaSources(formula, dataTypesInitials.DATASET_REPORTING_RATES);
    let arrAttr = getFormulaSources(formula, dataTypesInitials.ATTRIBUTES);
    let arrConst = getFormulaSources(formula, dataTypesInitials.CONSTANTS);

    async function fetch() {
      arrDtEle = await getWordDataForAll(engine, arrDtEle, loc);
      arrProgInd = await getWordDataForAll(engine, arrProgInd, loc);
      arrDtSetRep = await getWordDataForAll(engine, arrDtSetRep, loc);
      arrAttr = await getWordDataForAll(engine, arrAttr, loc);
      arrConst = await getWordDataForAll(engine, arrConst, loc);
    }

    fetch()
      .then(() => {
        const result = {
          dataElements: arrDtEle,
          programIndicators: arrProgInd,
          dataSetReportingRates: arrDtSetRep,
          attributes: arrAttr,
          constants: arrConst,
        };

        setData(result);
        // setData((prevState => {return prevState.concat(result) }))
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, []);

  return {
    loading,
    error,
    data,
  };
}

export function useGetDataSet(array, engine) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  //{"dataSetName:[dataElements in {id:"",displname:""}]}
  useEffect(() => {
    let tempArr;

    async function fetch() {
      tempArr = await getDataSetsArray(engine, array);
    }

    fetch()
      .then(() => {
        const result = { dataSets: tempArr };

        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, []);

  return {
    loading,
    error,
    data,
  };
}

export function useGetNumDenMatch(array, engine) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    let tempArr;

    async function fetch() {
      tempArr = await getNumDenMatch(engine, array);
    }

    fetch()
      .then(() => {
        const result = { matches: tempArr };
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [array?.length]);

  return {
    loading,
    error,
    data,
  };
}
