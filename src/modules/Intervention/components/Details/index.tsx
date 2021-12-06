import i18n from "@dhis2/d2-i18n";
import React from "react";
import { useFullScreenHandle } from "react-full-screen";
import useInterventionConfig from "../../../../shared/hooks/useInterventionConfig";
import InterventionCard from "../Card";

export default function InterventionDetails(): React.ReactElement {
  const intervention = useInterventionConfig();
  const fullScreenHandle = useFullScreenHandle();
  return (
    <InterventionCard
      fullScreenHandle={fullScreenHandle}
      title={
        <div className="p-8">
          <b>{intervention?.name}</b>
        </div>
      }
    >
      <div className="p-8 w-100">
        <span style={{ width: "100%", textAlign: "justify" }}>{intervention?.description ?? i18n.t("No description provided")}</span>
      </div>
    </InterventionCard>
  );
}
