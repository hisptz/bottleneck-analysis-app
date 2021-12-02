import { map } from "async";
import { isEmpty } from "lodash";

const query = {
  identifiableObjects: {
    resource: "identifiableObjects",
    id: ({ id }: any) => id,
    params: {
      fields: ["id", "displayName"],
    },
  },
};

const query2 = {
  program: {
    resource: "programIndicators",
    id: ({ id }: any) => id,
    params: {
      fields: ["program[id,displayName]"],
    },
  },
};

export async function getProgramFromAttributesOrDtElPrg(engine: any, arr: Array<string>) {
  if (!isEmpty(arr)) {
    return await map(
      arr,
      async (id) =>
        await getProgramFromAttributesOrDtElPrgFromApi(engine, id).then((value) => {
          return value.map((val: any) => {
            return val;
          });
        })
    );
  }
}

async function getProgramFromAttributesOrDtElPrgFromApi(engine: any, id: string) {
  const data = await engine.query(query, { variables: { id } });
  return data?.identifiableObjects;
}

export async function getProgramFromProgramIndicator(engine: any, arr: Array<string>) {
  if (!isEmpty(arr)) {
    return await map(
      arr,
      async (id) =>
        await getProgramFromProgramIndicatorApi(engine, id).then((value) => {
          return value.map((val: any) => {
            return val;
          });
        })
    );
  }
}

async function getProgramFromProgramIndicatorApi(engine: any, id: string) {
  const data = await engine.query(query2, { variables: { id } });
  return data?.program?.program;
}
