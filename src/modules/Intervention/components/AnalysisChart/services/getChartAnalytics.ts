import { AnalyticsDimension } from "../../../../../shared/interfaces/analytics";

const analyticsQuery = {
  analytics: {
    resource: "analytics",
    params: ({ pe, dx, ou }: AnalyticsDimension) => ({
      dimension: [`dx:${dx.join(";")}`, `ou:${ou.join(";")}`],
      filter: `pe:${pe}`,
    }),
  },
};

export async function getChartAnalytics({ dx, ou, pe }: AnalyticsDimension, engine: any) {
  const { analytics } = await engine.query(analyticsQuery, { variables: { pe, dx, ou } });
  return analytics;
}
