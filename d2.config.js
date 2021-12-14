const config = {
  type: "app",
  title: "Bottleneck Analysis App",
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
  ],
};

module.exports = config;
