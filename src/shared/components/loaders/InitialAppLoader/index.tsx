import "./initial-page-loader.css";
import { CircularLoader } from "@dhis2/ui";
import React from "react";
import BNALogo from "../../../../assets/images/bna-logo.png";

export default function InitialAppLoader() {
  return (
    <div className="loader-container">
      <img width={"120px"} alt="BNA" src={BNALogo} />
      <CircularLoader small />
      <h2 className="welcome-text-header">Intuitive design patterns</h2>
      <p className="welcome -text">Enjoy simple, elegant and improved look and feel</p>
    </div>
  );
}
