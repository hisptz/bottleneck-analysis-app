import { DataStoreProvider } from "@dhis2/app-service-datastore";
import React, { Suspense } from "react";
import "./App.module.css";
import "./styles/spacing.css";
import "./styles/layout.css";
import { RecoilRoot } from "recoil";
import { BNA_NAMESPACE } from "./constants/dataStore";
import Router from "./modules/Router";
import InitialAppLoader from "./shared/components/loaders/InitialAppLoader";

const MyApp = () => {
  return (
    <DataStoreProvider namespace={BNA_NAMESPACE} loadingComponent={<InitialAppLoader />}>
      <RecoilRoot>
        <Suspense fallback={<InitialAppLoader />}>
          <Router />
        </Suspense>
      </RecoilRoot>
    </DataStoreProvider>
  );
};

export default MyApp;
