import i18n from "@dhis2/d2-i18n";
import "./initial-page-loader.css";
import { CircularLoader } from "@dhis2/ui";
import React from "react";
import BNALogo from "../../../../assets/images/bna-logo.png";

export default function InitialAppLoader(): React.ReactElement {
  return (
    <div className="loader-container">
      <img width={"120px"} alt="BNA" src={BNALogo} />
      <CircularLoader small />
      <h2 className="welcome-text-header">{i18n.t("Intuitive design patterns")}</h2>
      <p className="welcome -text">{i18n.t("Enjoy simple, elegant and improved look and feel")}</p>
    </div>
  );
}
