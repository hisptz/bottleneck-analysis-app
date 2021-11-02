import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Dashboard from "../Dashboard";

const routes = [
  {
    pathname: "/dashboards/:id",
    component: Dashboard,
  },
];

export default function Router() {
  return (
    <HashRouter>
      {routes?.map(({ pathname, component }) => (
        <Route key={`${pathname}-route`} path={pathname} component={component} />
      ))}
    </HashRouter>
  );
}
