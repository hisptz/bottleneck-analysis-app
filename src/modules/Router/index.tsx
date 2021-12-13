import React, { Suspense } from "react";
import { HashRouter, Route } from "react-router-dom";
import useDataEngineInit from "../../core/hooks/initDataEngine";
import EmptyInterventions from "../EmptyInterventions";

const Intervention = React.lazy(() => import("../Intervention"));
const InterventionArchive = React.lazy(() => import("../Archives/components/ArchiveDashboard"));
const InterventionConfiguration = React.lazy(() => import("../InterventionConfiguration/index"));
const Archive = React.lazy(() => import("../Archives"));
const Landing = React.lazy(() => import("../Landing"));
const Migration = React.lazy(() => import("../Migration"));

const routes = [
  {
    pathname: "/interventions/:id",
    component: Intervention,
  },
  {
    pathname: "/migrate",
    component: Migration,
  },
  {
    pathname: "/archives",
    component: Archive,
  },
  {
    pathname: "/archives/:id",
    component: InterventionArchive,
  },
  {
    pathname: "/no-interventions",
    component: EmptyInterventions,
  },
  {
    pathname: "/:id/configuration",
    component: InterventionConfiguration,
  },
  {
    pathname: "/new-intervention",
    component: InterventionConfiguration,
  },
  {
    pathname: "/",
    component: Landing,
  },
];

export default function Router(): React.ReactElement {
  useDataEngineInit();
  return (
    <HashRouter>
      {routes?.map(({ pathname, component: Component }) => (
        <Route exact key={`${pathname}-route`} path={pathname}>
          <Suspense fallback={<Landing />}>
            <Component />
          </Suspense>
        </Route>
      ))}
    </HashRouter>
  );
}
