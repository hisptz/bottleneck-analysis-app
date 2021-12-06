import React, { Suspense } from "react";
import { HashRouter, Route } from "react-router-dom";
import useDataEngineInit from "../../core/hooks/initDataEngine";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";
import EmptyInterventions from "../EmptyInterventions";
import Landing from "../Landing";
import Migration from "../Migration";

const Intervention = React.lazy(() => import("../Intervention"));
const InterventionArchive = React.lazy(() => import("../Intervention/components/Archives/ArchiveDashboard"));
const InterventionConfiguration = React.lazy(() => import("../InterventionConfiguration/index"));
const Archive = React.lazy(() => import("../Intervention/components/Archives/"));

const routes = [
  {
    pathname: "/interventions/:id",
    component: Intervention,
  },
  {
    pathname: "/",
    component: Landing,
  },
  {
    pathname: "/migrate",
    component: Migration,
  },
  {
    pathname: "/:id/archives",
    component: Archive,
  },
  {
    pathname: "/no-interventions",
    component: EmptyInterventions,
  },
  {
    pathname: "/:id/archives/:id",
    component: InterventionArchive,
  },
  {
    pathname: "/:id/configuration",
    component: InterventionConfiguration,
  },
  {
    pathname: "/new-intervention",
    component: InterventionConfiguration,
  },
];

export default function Router(): React.ReactElement {
  useDataEngineInit();
  return (
    <HashRouter>
      {routes?.map(({ pathname, component: Component }) => (
        <Route exact key={`${pathname}-route`} path={pathname}>
          <Suspense fallback={<FullPageLoader />}>
            <Component />
          </Suspense>
        </Route>
      ))}
    </HashRouter>
  );
}
