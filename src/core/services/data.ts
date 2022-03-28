const indicatorQuery = {
  indicator: {
    resource: "indicators",
    id: ({ id }: any) => id,
    params: {
      fields: ["displayName", "name", "shortName", "id", "legendSets"],
    },
  },
};

export async function getIndicator(id: string, engine: any) {
  const response = await engine.query(indicatorQuery, {
    variables: {
      id,
    },
  });
  return response?.indicator;
}
