import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, DropdownButton, IconInfo24, IconStar24, IconStarFilled24 } from "@dhis2/ui";
import { IconButton } from "@material-ui/core";
import { head } from "lodash";
import React from "react";
import "./intervention-header.css";
import { useParams, useHistory } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CurrentInterventionSummary } from "../../../../../../core/state/intervention";
import { UserState } from "../../../../../../core/state/user";
import { InterventionSummary } from "../../../../../../shared/interfaces/interventionConfig";
import { InterventionDetailsState } from "../../../../state/intervention";
import { FilteredInterventions } from "../InterventionList/state/search";

export default function InterventionHeader() {
  const { id: userId } = useRecoilValue(UserState) ?? {};
  const { id } = useParams<{ id: string }>();
  const intervention = useRecoilValue(CurrentInterventionSummary(id));
  const { name, bookmarks } = intervention ?? {};
  const setShowDetails = useSetRecoilState(InterventionDetailsState(id));
  const interventions = useRecoilValue(FilteredInterventions);
  const firstIntervention: InterventionSummary | undefined = head(interventions);
  const history = useHistory();
  function onToInterventionConfiguration() {
    history.push("/" + firstIntervention?.id + "/configuration");
  }
  return (
    <div className="intervention-header-container">
      <div className="column flex">
        <div className="row gap align-center">
          <h2 className="intervention-header-text">{name}</h2>
          <IconButton style={{ padding: 2, color: "#000000" }}>{bookmarks?.includes(userId) ? <IconStarFilled24 /> : <IconStar24 />}</IconButton>
          <IconButton onClick={() => setShowDetails((currentVal: boolean) => !currentVal)} style={{ padding: 2, color: "#000000" }}>
            <IconInfo24 />
          </IconButton>
          <DropdownButton>{i18n.t("Add Filter")}</DropdownButton>
        </div>
      </div>
      <div className="column">
        <ButtonStrip>
          <Button>{i18n.t("Archive")}</Button>
          <Button onClick={onToInterventionConfiguration}>{i18n.t("Configure")}</Button>
        </ButtonStrip>
      </div>
    </div>
  );
}
