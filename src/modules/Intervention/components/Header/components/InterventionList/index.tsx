import i18n from "@dhis2/d2-i18n";
import { Button, IconChevronDown24, IconChevronUp24 } from "@dhis2/ui";
import { IconButton } from "@material-ui/core";
import React, { useState } from "react";
import "./intervention-list.css";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import AddButton from "./components/AddButton";
import InterventionChips from "./components/InterventionChips";
import Search from "./components/Search";
import SearchedInterventionNotFoundMessage from "./components/SearchedInterventionNotFoundMessage";
import { FilteredInterventions, SearchState } from "./state/search";

export default function InterventionList(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [showAll, setShowAll] = useState<boolean>(false);
  const searchKeyword = useRecoilValue(SearchState);
  const interventions = useRecoilValue(FilteredInterventions(id));
  const history = useHistory();

  function onToArchivesList() {
    history.push("/archives");
  }

  function onAddIntervention() {
    history.push(`/new-intervention`);
  }

  return (
    <div className="column center align-center w-100">
      <div className="intervention-list-container w-100 align-start">
        <div className="column flex-1">
          <div className="row gap align-start">
            <AddButton onClick={onAddIntervention} />
            <Search />
            {interventions && interventions?.length > 0 ? (
              <InterventionChips interventions={interventions} showAll={showAll} />
            ) : searchKeyword != "" ? (
              <SearchedInterventionNotFoundMessage />
            ) : null}
          </div>
        </div>
        <div className="row gap ">
          <Button onClick={onToArchivesList}>{i18n.t("View Archives")}</Button>
        </div>
      </div>
      {interventions.length > 5 && (
        <IconButton style={{ padding: 2 }} onClick={() => setShowAll((prevState) => !prevState)}>
          {showAll ? <IconChevronUp24 /> : <IconChevronDown24 />}
        </IconButton>
      )}
    </div>
  );
}
