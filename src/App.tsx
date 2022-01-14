import { DataStoreProvider } from "@dhis2/app-service-datastore";
import { CssReset } from "@dhis2/ui";
import HighCharts from "highcharts";
import HighChartGroupedCategories from "highcharts-grouped-categories";
import HighChartsExport from "highcharts/modules/exporting";
import React, { Suspense } from "react";
import "intro.js/introjs.css";
import "./intro-dhis2.css";
import "./App.css";
import "./styles/spacing.css";
import "./styles/layout.css";
import "./styles/icons.css";
import { Helmet } from "react-helmet";
import { RecoilRoot } from "recoil";
import { BNA_NAMESPACE } from "./constants/dataStore";
import Router from "./modules/Router";
import InitialAppLoader from "./shared/components/loaders/InitialAppLoader";

const MyApp = (): React.ReactElement => {
  HighChartsExport(HighCharts);
  HighChartGroupedCategories(HighCharts);
  return (
    <DataStoreProvider namespace={BNA_NAMESPACE} loadingComponent={<InitialAppLoader />}>
      <CssReset />
      <RecoilRoot>
        <Suspense fallback={<InitialAppLoader />}>
          <Helmet>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js" />
          </Helmet>
          <Router />
        </Suspense>
      </RecoilRoot>
    </DataStoreProvider>
  );
};

export default MyApp;
