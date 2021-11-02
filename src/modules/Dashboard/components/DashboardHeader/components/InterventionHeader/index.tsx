import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, DropdownButton, IconInfo24, IconStar24, IconStarFilled24 } from "@dhis2/ui";
import { IconButton } from "@material-ui/core";
import React from "react";
import "./intervention-header.css";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DashboardConfig } from "../../../../../../shared/types/dashboardConfig";
import { DashboardState } from "../../../../state/dashboard";

export default function InterventionHeader() {
  const { id } = useParams<{ id: string }>();
  const dashboard = useRecoilValue<DashboardConfig>(DashboardState(id));

  const { name, bookmarked } = dashboard;

  return (
    <div className="intervention-header-container">
      <div className="column flex">
        <div className="row gap align-center">
          <h2 className="intervention-header-text">{name}</h2>
          <IconButton style={{ padding: 2, color: "#000000" }}>{bookmarked ? <IconStarFilled24 /> : <IconStar24 />}</IconButton>
          <IconButton style={{ padding: 2, color: "#000000" }}>
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
