import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, DropdownButton, IconInfo24, IconStarFilled24 } from "@dhis2/ui";
import React from "react";
import "./intervention-header.css";
import { IconButton } from "@material-ui/core";

export default function InterventionHeader() {
  return (
    <div className="intervention-header-container">
      <div className="column flex">
        <div className="row gap align-center">
          <h2 className="intervention-header-text">Intervention Header</h2>
          <IconStarFilled24 />
          <IconButton style={{ padding: 2 }}>
            <IconInfo24 />
          </IconButton>
          <DropdownButton>{i18n.t("Add Filter")}</DropdownButton>
        </div>
      </div>
      <div className="column">
        <ButtonStrip>
          <Button>{i18n.t("Archive")}</Button>
          <Button>{i18n.t("Configure")}</Button>
        </ButtonStrip>
      </div>
    </div>
  );
}
