import { DataStoreProvider } from "@dhis2/app-service-datastore";
import { CssReset } from "@dhis2/ui";
import { ConfirmDialogProvider } from "@hisptz/react-ui";
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
import "./locales/index.js";
import $ from "jquery";

HighChartsExport(HighCharts);
HighChartGroupedCategories(HighCharts);

const MyApp = (): React.ReactElement => {
	//For custom functions requiring jQuery
	// @ts-ignore
	window.$ = $;

	return (
		<DataStoreProvider
			namespace={BNA_NAMESPACE}
			loadingComponent={<InitialAppLoader />}
		>
			<CssReset />
			<RecoilRoot>
				<ConfirmDialogProvider>
					<Suspense fallback={<InitialAppLoader />}>
						<Helmet>
							<link
								rel="stylesheet"
								href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
								integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
								crossOrigin=""
							/>
						</Helmet>
						<Router />
					</Suspense>
				</ConfirmDialogProvider>
			</RecoilRoot>
		</DataStoreProvider>
	);
};

export default MyApp;
