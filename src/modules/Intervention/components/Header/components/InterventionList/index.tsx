/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import i18n from "@dhis2/d2-i18n";
import { Button, IconChevronDown24, IconChevronUp24 } from "@dhis2/ui";
import { IconButton } from "@material-ui/core";
import { head } from "lodash";
import React, { useState } from "react";
import "./intervention-list.css";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionSummary as InterventionSummaryType } from "../../../../../../shared/interfaces/interventionConfig";
import AddButton from "./components/AddButton";
import InterventionChips from "./components/InterventionChips";
import Search from "./components/Search";
import SearchedInterventionNotFoundMessage from "./components/SearchedInterventionNotFoundMessage";
import { FilteredInterventions, SearchState } from "./state/search";

export default function InterventionList() {
  const [showAll, setShowAll] = useState<boolean>(false);
  const searchKeyword = useRecoilValue(SearchState);
  const interventions = useRecoilValue(FilteredInterventions);
  const firstIntervention: InterventionSummaryType | undefined = head(interventions);
  const history = useHistory();
  function onToArchivesList(_: any, e: Event) {
    history.push("/" + firstIntervention?.id + "/archives");
  }

  return (
    <div className="column center align-center w-100">
      <div className="intervention-list-container w-100 align-start">
        <div className="column flex">
          <div className="row gap align-start">
            <AddButton />
            <Search />
            {interventions && interventions?.length > 0 ? (
              <InterventionChips interventions={interventions} showAll={showAll} />
            ) : searchKeyword != "" ? (
              <SearchedInterventionNotFoundMessage />
            ) : null}
          </div>
        </div>
        <div className="column ">
          <Button onClick={onToArchivesList}>{i18n.t("View Archives")}</Button>
        </div>
      </div>
      <IconButton style={{ padding: 2 }} onClick={() => setShowAll((prevState) => !prevState)}>
        {showAll ? <IconChevronUp24 /> : <IconChevronDown24 />}
      </IconButton>
    </div>
  );
}
