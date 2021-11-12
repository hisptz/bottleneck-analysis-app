import i18n from "@dhis2/d2-i18n";
import React from "react";

export default function SearchedInterventionNotFoundMessage() {
  return (
    <div className="column w-100" style={{ maxWidth: "100%", paddingTop: "1vh" }}>
      <div className="row w-100">{i18n.t("Searched Intervention is not found")}</div>
    </div>
  );
}
