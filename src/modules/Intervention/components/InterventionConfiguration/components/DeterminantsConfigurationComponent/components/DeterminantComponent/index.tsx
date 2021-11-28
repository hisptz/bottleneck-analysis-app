import { Button } from "@dhis2/ui";
import React from "react";
import GroupDeterminantComponent from "./component";
import "./DeterminantComponent.css";

export default function DeterminantComponent() {
  return (
    <div className="determinant">
      <div className="determinant-main">
        <div className="determinant-main-header">
          <h3>Determinants</h3>
          <Button small>Clears All</Button>
        </div>
        <div>
          <GroupDeterminantComponent />
        </div>
      </div>
    </div>
  );
}
