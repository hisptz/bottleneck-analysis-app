import { map } from "async";
import { isEmpty } from "lodash";

const query = {
  dataSets: {
    resource: "dataSets",

    params: ({ id }: any) => ({
      fields: ["id", "displayName", "periodType", "timelyDays"],
      filter: [`dataSetElements.dataElement.id:eq:${id}`],
    }),
  },
};

const query2 = {
  numeratorMatch: {
    resource: "indicators",
    params: ({ id }: any) => ({
      fields: ["id"],
      filter: [`numerator:like:${id}`],
    }),
  },
  denominatorMatch: {
    resource: "indicators",
    params: ({ id }: any) => ({
      fields: ["id"],
      filter: [`denominator:like:${id}`],
    }),
  },
};

export async function getNumDenMatch(engine: any, arr: Array<string>) {
  if (!isEmpty(arr)) {
    return await map(arr, async (id: string) =>
      getMatch(engine, id).then((value) => {
        return value.map((val: any) => {
          return val;
        });
      })
    );
  }
}

export async function getDataSetsArray(engine: any, arr: Array<string>) {
  if (arr?.length > 0) {
    return await map(arr, async (id) =>
      getDataSetsFromApi(engine, id).then((value) => {
        return value.map((val: any) => {
          //We always return array just for uniformity
          return val?.dataSets;
        });
      })
    );
  }
}

async function getDataSetsFromApi(engine: any, id: string) {
  const data = await engine.query(query, { variables: { id } });
  return data?.dataSets;
}

async function getMatch(engine: any, id: string) {
  return await engine.query(query2, { variables: { id } });
}
