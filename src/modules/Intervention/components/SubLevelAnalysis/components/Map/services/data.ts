const boundaryQuery = {
  boundaries: {
    resource: "geoFeatures",
    params: ({ ou }: any) => ({
      ou: `ou:${ou}`,
    }),
  },
};

export async function getBoundaryData(engine: any, orgUnit: Array<string>) {
  const { boundaries } = (await engine.query(boundaryQuery, { variables: { ou: orgUnit?.join(";") } })) ?? {};
  return boundaries;
}
