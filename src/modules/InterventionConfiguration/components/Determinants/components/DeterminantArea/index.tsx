import { Button } from "@dhis2/ui";
import React from "react";
import GroupDeterminantComponent from "./component";
import "./DeterminantArea.css";
import i18n from "@dhis2/d2-i18n";

export default function DeterminantArea() {
  return (
    <div className="determinant-container">
      <div className="determinant-main">
        <div className="determinant-main-header">
          <h3>{i18n.t("Determinants")}</h3>
          <Button>{i18n.t("Clear All")}</Button>
        </div>
        <div className={"determinant-selector"}>
          <GroupDeterminantComponent />
        </div>
      </div>
    </div>
  );
}
