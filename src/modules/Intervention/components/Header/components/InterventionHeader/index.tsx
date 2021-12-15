import i18n from "@dhis2/d2-i18n";
import {
  Button,
  ButtonStrip,
  colors,
  DropdownButton,
  IconFilter24,
  IconInfo24,
  IconInfoFilled24,
  IconQuestion16,
  IconStar24,
  IconStarFilled24,
  Tooltip,
} from "@dhis2/ui";
import { OrgUnitSelectorModal, PeriodSelectorModal } from "@hisptz/react-ui";
import { IconButton } from "@material-ui/core";
import React, { useState } from "react";
import "./intervention-header.css";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { CalendarTypes } from "../../../../../../constants/calendar";
import { CurrentInterventionSummary } from "../../../../../../core/state/intervention";
import { SystemSettingsState } from "../../../../../../core/state/system";
import { UserAuthority, UserAuthorityOnIntervention } from "../../../../../../core/state/user";
import { InterventionDetailsState } from "../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../state/selections";
import ArchiveModal from "./components/ArchiveModal";
import FilterMenu from "./components/FilterMenu";
import HelperMenu from "./components/HelperMenu";
import useBookmark from "./hooks/bookmark";
import useFilter from "./hooks/filter";

export default function InterventionHeader(): React.ReactElement {
  const { calendar } = useRecoilValue(SystemSettingsState);
  const { id } = useParams<{ id: string }>();
  const authorities = useRecoilValue(UserAuthority);
  const access = useRecoilValue(UserAuthorityOnIntervention(id));
  const intervention = useRecoilValue(CurrentInterventionSummary(id));
  const period = useRecoilValue(InterventionPeriodState(id));
  const orgUnit = useRecoilValue(InterventionOrgUnitState(id));
  const { bookmarked, toggleBookmark } = useBookmark();
  const { name } = intervention ?? {};
  const [showDetails, setShowDetails] = useRecoilState(InterventionDetailsState(id));
  const [openFilterMenu, setOpenFilterMenu] = useState<boolean>(false);
  const [openHelperMenu, setOpenHelperMenu] = useState<boolean>(false);
  const history = useHistory();
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);

  const {
    selectedPeriod,
    excludedPeriodTypes,
    periodSelectorOpen,
    setPeriodSelectorOpen,
    orgUnitSelectorOpen,
    setOrgUnitSelectorOpen,
    onPeriodSelect,
    onOrgUnitSelect,
    orgUnitSelection,
  } = useFilter();

  function onToInterventionConfiguration() {
    history.push(`/${id}/configuration`);
  }

  return (
    <div className="intervention-header-container">
      <div className="column flex-1">
        <div className="row gap align-center">
          <h2 className="intervention-header-text">{name}</h2>
          <span className="intervention-org-unit" style={{ color: colors.grey700 }}>
            ({`${orgUnit?.displayName ?? ""} - ${period?.name ?? ""}`})
          </span>
          <Tooltip content={i18n.t("{{type}} bookmark", { type: bookmarked ? i18n.t("Add") : i18n.t("Remove") })}>
            <IconButton className="intervention-bookmark" onClick={toggleBookmark} style={{ padding: 2, color: "#000000" }}>
              {bookmarked ? <IconStarFilled24 /> : <IconStar24 />}
            </IconButton>
          </Tooltip>
          <Tooltip content={i18n.t("{{type}} description", { type: showDetails ? i18n.t("Hide") : i18n.t("Show") })}>
            <IconButton
              className="intervention-show-description"
              onClick={() => setShowDetails((currentVal: boolean) => !currentVal)}
              style={{ padding: 2, color: "#000000" }}>
              {showDetails ? <IconInfoFilled24 /> : <IconInfo24 />}
            </IconButton>
          </Tooltip>
          <DropdownButton
            className="intervention-header-dropdown"
            open={openFilterMenu}
            onClick={() => {
              setOpenFilterMenu(!openFilterMenu);
            }}
            component={
              <FilterMenu
                onPeriodSelect={() => setPeriodSelectorOpen(true)}
                onOrgUnitSelect={() => setOrgUnitSelectorOpen(true)}
                onClose={() => setOpenFilterMenu(false)}
              />
            }
            icon={<IconFilter24 />}>
            {i18n.t("Add Filter")}
          </DropdownButton>
          {periodSelectorOpen && (
            <PeriodSelectorModal
              calendar={calendar === CalendarTypes.ETHIOPIAN ? CalendarTypes.ETHIOPIAN : CalendarTypes.GREGORIAN}
              singleSelection
              selectedPeriods={[selectedPeriod] as unknown as any}
              excludedPeriodTypes={excludedPeriodTypes}
              onClose={() => setPeriodSelectorOpen(false)}
              hide={!periodSelectorOpen}
              onUpdate={onPeriodSelect}
            />
          )}
          {orgUnitSelectorOpen && (
            <OrgUnitSelectorModal
              value={{ orgUnits: [orgUnitSelection] }}
              singleSelection
              onClose={() => setOrgUnitSelectorOpen(false)}
              hide={!orgUnitSelectorOpen}
              onUpdate={onOrgUnitSelect}
            />
          )}
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
          <Button className={"archive-intervention"} onClick={() => setArchiveModalOpen(true)}>
            {i18n.t("Archive")}
          </Button>
          {authorities?.intervention?.edit && access.write ? (
            <Button className={"configure-intervention"} onClick={onToInterventionConfiguration}>
              {i18n.t("Configure")}
            </Button>
          ) : null}
        </ButtonStrip>
        {archiveModalOpen && <ArchiveModal hide={!archiveModalOpen} onClose={() => setArchiveModalOpen(false)} />}
      </div>
    </div>
  );
}
