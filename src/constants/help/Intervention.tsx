import i18n from "@dhis2/d2-i18n";
import React from "react";
export const INTERVENTION_HELP_STEPS = [
  {
    intro: (
      <div>
        <h1>{i18n.t("Welcome to Bottleneck Analysis App (BNA)")}</h1>
        <p>
          {i18n.t(
            "BNA is a structured analysis of the determinants of coverage for a wide range of interventions delivered through the health sector, useful to supporting targeted operational planning"
          )}
        </p>
      </div>
    ),
  },
  {
    intro: i18n.t("This is the list of Interventions in the system"),
    element: ".intervention-list-container",
  },
];
