import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import useDataEngineInit from "../../core/hooks/initDataEngine";
import EmptyInterventions from "../EmptyInterventions";
import Landing from "../Landing";
import Migration from "../Migration";

const Intervention = React.lazy(() => import("../Intervention"));
const InterventionArchive = React.lazy(
	() => import("../Archives/components/ArchiveDashboard"),
);
const InterventionConfiguration = React.lazy(
	() => import("../InterventionConfiguration/index"),
);
const Archive = React.lazy(() => import("../Archives"));

const routes = createHashRouter([
	{
		path: "/interventions/:id",
		Component: Intervention,
	},
	{
		path: "/migrate",

		Component: Migration,
	},
	{
		path: "/archives",
		Component: Archive,
	},
	{
		path: "/archives/:id",
		Component: InterventionArchive,
	},
	{
		path: "/no-interventions",
		Component: EmptyInterventions,
	},
	{
		path: "/:id/configuration",
		Component: InterventionConfiguration,
	},
	{
		path: "/new-intervention",
		Component: InterventionConfiguration,
	},
	{
		path: "/",
		Component: Landing,
	},
]);

export default function Router(): React.ReactElement {
	useDataEngineInit();
	return <RouterProvider router={routes} />;
}
