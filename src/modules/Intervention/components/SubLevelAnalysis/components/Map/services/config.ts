import { forEach, set } from "lodash";

const generateQuery = (ids: Array<string>) => {
  const queries = ids?.map((id) => ({
    resource: "indicators",
    id,
    params: {
      fields: ["id", "displayName", "description", "legendSets[displayName,legends[displayName,color,startValue,endValue]]"],
    },
  }));
  const queryObject = {};

  forEach(ids, (id, index) => {
    set(queryObject, `${id}`, queries[index]);
  });

  return queryObject;
};

export async function getIndicators(indicators: Array<string>, engine: any) {
  const indicatorsResponse = await engine.query(generateQuery(indicators));
  return Object.values(indicatorsResponse);
}
