import { AnalyticsDimension } from "../../../../../shared/interfaces/analytics";
import { isEmpty } from "lodash";
import i18n from "@dhis2/d2-i18n";
import { getCustomFunctionAnalytics } from "../../../../../shared/services/customFunctionAnalytics";

const analyticsQuery = {
  analytics: {
    resource: "analytics",
    params: ({ pe, dx, ou }: AnalyticsDimension) => ({
      dimension: [`dx:${dx.join(";")}`, `ou:${ou.join(";")}`, `pe:${pe}`],
    }),
  },
};

const analyticsMetadataQuery = {
  metadata: {
    resource: "analytics",
    params: ({ pe, ou }: AnalyticsDimension) => ({
      dimension: [`ou:${ou.join(";")}`, `pe:${pe}`],
      skipData: true,
    }),
  },
};

async function getAnalyticsMetadata(engine: any, { ou, pe }: { ou: string[]; pe: string }) {
  const { metadata } = await engine.query(analyticsMetadataQuery, { variables: { pe, ou } });
  return metadata;
}

export async function getData({ dataItems, engine, functions, orgUnit, period }: { dataItems: any; engine: any; functions: any; orgUnit: any; period: any }) {
  if (isEmpty([...dataItems, ...functions])) {
    throw Error(i18n.t("There are no indicators configured for this intervention"));
  }

  if (isEmpty(period) || isEmpty(orgUnit)) {
    throw Error(i18n.t("There are no organisation units or periods configured for this intervention"));
  }

  let dataItemsData: any = {};

  if (!isEmpty(dataItems)) {
    dataItemsData = await getAnalytics({ dx: dataItems, ou: [orgUnit], pe: period }, engine);
  } else {
    dataItemsData = await getAnalyticsMetadata(engine, { ou: [orgUnit], pe: period });
  }
  const functionsData = await getCustomFunctionAnalytics({ functions, periods: [period], orgUnits: [orgUnit] });

  return {
    ...dataItemsData,
    rows: [...(dataItemsData?.rows ?? []), ...(functionsData ?? [])],
  };
}

export async function getAnalytics({ dx, ou, pe }: AnalyticsDimension, engine: any) {
  const { analytics } = await engine.query(analyticsQuery, { variables: { pe, dx, ou } });
  return analytics;
}
