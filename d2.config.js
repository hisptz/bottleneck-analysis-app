/**
 * @type {import("@dhis2/cli-app-scripts").D2Config}
 */
const config = {
	id: "9099e396-ec68-4038-a5c9-e60650f49935",
	type: "app",
	title: "Bottleneck Analysis (BNA)",
	name: "bottleneck-analysis-app",
	entryPoints: {
		app: "./src/App.tsx",
	},
	namespace: "hisptz-bna",
	customAuthorities: [
		"BNA_ADD_INTERVENTION",
		"BNA_EDIT_INTERVENTION",
		"BNA_DELETE_INTERVENTION",
		"BNA_VIEW_INTERVENTIONS",
		"BNA_ADD_ROOT_CAUSE",
		"BNA_EDIT_ROOT_CAUSE",
		"BNA_DELETE_ROOT_CAUSE",
		"BNA_ADD_ARCHIVE",
		"BNA_DELETE_ARCHIVE",
	],
};

module.exports = config;
