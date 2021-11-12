import { IconInfo24 } from "@dhis2/ui";
import React from "react";
import "./index.css";

export default function IndividualArchiveHeaderInfoSummary() {
  return (
    <div className="archive-intervention-info">
      <IconInfo24 />
      <div className="archive-info-summary">
        <p
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            marginTop: "0.8%",
          }}>
          You are current viewing archived intervention
        </p>
        <p>
          Data shown is based on archive of 04 Aug 2020 for Focused ANC Coverage from Animal Region on 2019 . You can still view latest snapshot of this
          intervention
        </p>
        <p
          style={{
            fontSize: "13px",
            textDecoration: "underline",
          }}>
          Go to live Focus ANC Coverage Intervention
        </p>
      </div>
    </div>
  );
}
