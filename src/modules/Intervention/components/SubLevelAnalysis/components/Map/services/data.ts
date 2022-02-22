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

const analyticsQuery = {
  analytics: {
    resource: "analytics",
    params: ({ ou, pe, dx }: any) => ({
      dimension: `ou:${ou?.join(";")},dx:${dx?.join(";")}`,
      filter: `pe:${pe}`,
    }),
  },
};

export async function getAnalyticsData({ dx, pe, ou }: { dx: Array<string>; pe: string; ou: Array<string> }, engine: any) {
  const { analytics } = (await engine.query(analyticsQuery, { variables: { dx, pe, ou } })) ?? {};
  return analytics;
}
