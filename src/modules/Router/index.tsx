import React, { Suspense } from "react";
import { HashRouter, Route } from "react-router-dom";
import useDataEngineInit from "../../core/hooks/initDataEngine";
import FullPageLoader from "../../shared/components/loaders/FullPageLoader";
import Landing from "../Landing";

const Dashboard = React.lazy(() => import("../Dashboard"));
const Archive = React.lazy(() => import("../Dashboard/components/Archives/"));

const routes = [
  {
    pathname: "/dashboards/:id",
    component: Dashboard,
  },
  {
    pathname: "/",
    component: Landing,
  },
  {
    pathname: "/intervention-list",
    component: Archive,
  },
];

export default function Router() {
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
