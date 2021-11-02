import React from "react";
import { HashRouter, Route } from "react-router-dom";
import useDataEngineInit from "../../core/hooks/initDataEngine";
import Dashboard from "../Dashboard";
import Landing from "../Landing";

const routes = [
  {
    pathname: "/dashboards/:id",
    component: Dashboard,
  },
  {
    pathname: "/",
    component: Landing,
  },
];

export default function Router() {
  useDataEngineInit();
  return (
    <HashRouter>
      {routes?.map(({ pathname, component }) => (
        <Route key={`${pathname}-route`} path={pathname} component={component} />
      ))}
    </HashRouter>
  );
}
