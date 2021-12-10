import i18n from "@dhis2/d2-i18n";
import {
  Button,
  ButtonStrip,
  colors,
  DropdownButton,
  IconFilter24,
  IconInfo24,
  IconInfoFilled24,
  IconStar24,
  IconStarFilled24,
  IconQuestion16,
  Tooltip,
} from "@dhis2/ui";
import { IconButton } from "@material-ui/core";
import React, { useRef, useState } from "react";
import "./intervention-header.css";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { CurrentInterventionSummary } from "../../../../../../core/state/intervention";
import { InterventionDetailsState } from "../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../state/selections";
import FilterMenu from "./components/FilterMenu";
import HelperMenu from "./components/HelperMenu";
import useBookmark from "./hooks/bookmark";

export default function InterventionHeader(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const ref = useRef<HTMLDivElement | null>(null);
  const [stateActionRef, setStateActionRef] = useState<any>();
  const intervention = useRecoilValue(CurrentInterventionSummary(id));
  const period = useRecoilValue(InterventionPeriodState(id));
  const orgUnit = useRecoilValue(InterventionOrgUnitState(id));
  const { bookmarked, toggleBookmark } = useBookmark();
  const { name } = intervention ?? {};
  const [showDetails, setShowDetails] = useRecoilState(InterventionDetailsState(id));
  const [openFilterMenu, setOpenFilterMenu] = useState<boolean>(false);
  const [openHelperMenu, setOpenHelperMenu] = useState<boolean>(false);
  const history = useHistory();

  function onToInterventionConfiguration() {
    history.push(`/${id}/configuration`);
  }

  return (
    <div className="intervention-header-container">
      <div className="column flex-1">
        <div className="row gap align-center">
          <h2 className="intervention-header-text">{name}</h2>
          <span style={{ color: colors.grey700 }}>({`${orgUnit?.displayName ?? ""} - ${period?.name ?? ""}`})</span>
          <Tooltip content={i18n.t("{{type}} bookmark", { type: bookmarked ? i18n.t("Add") : i18n.t("Remove") })}>
            <IconButton onClick={toggleBookmark} style={{ padding: 2, color: "#000000" }}>
              {bookmarked ? <IconStarFilled24 /> : <IconStar24 />}
            </IconButton>
          </Tooltip>
          <Tooltip content={i18n.t("{{type}} description", { type: showDetails ? i18n.t("Hide") : i18n.t("Show") })}>
            <IconButton onClick={() => setShowDetails((currentVal: boolean) => !currentVal)} style={{ padding: 2, color: "#000000" }}>
              {showDetails ? <IconInfoFilled24 /> : <IconInfo24 />}
            </IconButton>
          </Tooltip>
          <DropdownButton
            open={openFilterMenu}
            onClick={() => {
              setOpenFilterMenu(true);
            }}
            component={<FilterMenu onClose={() => setOpenFilterMenu(false)} />}
            icon={<IconFilter24 />}>
            {i18n.t("Add Filter")}
          </DropdownButton>
        </div>
      </div>
      <div className="column">
        <ButtonStrip>
          <DropdownButton
            open={openHelperMenu}
            onClick={() => {
              setOpenHelperMenu(!openHelperMenu);
            }}
            component={<HelperMenu onClose={() => setOpenHelperMenu(false)} />}
            icon={<IconQuestion16 color="#212529" />}>
            {i18n.t("Help")}
          </DropdownButton>
          <Button>{i18n.t("Archive")}</Button>
          <Button onClick={onToInterventionConfiguration}>{i18n.t("Configure")}</Button>
        </ButtonStrip>
      </div>
    </div>
  );
}
