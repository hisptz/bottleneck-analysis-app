import { useEffect, useState } from "react";
import { getAllFunctions, getFunctionDetails, getIdDetails } from "../../functions/functionDictionary";

export function useGetFunctionsDetails(engine: any, array: string[]) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    async function fetch() {
      return await getFunctionDetails(engine, array);
    }

    fetch()
      .then((val) => {
        setData(val);
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

export function useGetIdDetails(array: string[], engine: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    let tmp: any[] | undefined;
    async function fetch() {
      tmp = await getIdDetails(engine, array);
    }
    fetch()
      .then(() => {
        const result = { idDetails: tmp };
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  }, [JSON.stringify(array)]);

  return {
    loading,
    error,
    data,
  };
}

export function useGetAllFunctionsId(engine: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    async function fetch() {
      return getAllFunctions(engine);
    }
    fetch()
      .then((value) => {
        setLoading(false);
        setData(value);
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
