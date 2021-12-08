import i18n from "@dhis2/d2-i18n";
import { Button, IconAdd24 } from "@dhis2/ui";
import React from "react";
import BNALogo from "../../assets/images/bna-logo.png";
import "./empty-intervention.css";

export default function EmptyInterventions() {
  return (
    <div className="main-container">
      <div className="column align-center" style={{ gap: 32 }}>
        <img width={"120px"} alt="BNA" src={BNALogo} />
        <h1>{i18n.t("Welcome to the Bottleneck Analysis App!")}</h1>
        <div className="col-12" style={{ height: "100%" }}>
          <div className="row center">
            <div className="info-box">
              <div className="column">
                <h3 className="info-box-title">{i18n.t("Create a new Intervention")}</h3>
                <ul className="info-box-list">
                  <li>{i18n.t("Create Intervention")}</li>
                  <li>{i18n.t("Place indicators of intervention in their determinants in settings")}</li>
                  <li>{i18n.t("Add different data sources to a group")}</li>
                  <li>{i18n.t("Select period and organisation unit and save changes")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Button primary icon={<IconAdd24 />}>
          {i18n.t("Add New Intervention")}
        </Button>
      </div>
    </div>
  );
}
