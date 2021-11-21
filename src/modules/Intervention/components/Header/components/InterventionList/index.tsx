import i18n from "@dhis2/d2-i18n";
import { Button, IconChevronDown24, IconChevronUp24 } from "@dhis2/ui";
import { IconButton } from "@material-ui/core";
import { head } from "lodash";
import React, { useCallback, useState } from "react";
import "./intervention-list.css";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { InterventionSummary as InterventionSummaryType } from "../../../../../../shared/interfaces/interventionConfig";
import { migrateRootCauses } from "../../../../../Migration/services/migrate";
import AddButton from "./components/AddButton";
import InterventionChips from "./components/InterventionChips";
import Search from "./components/Search";
import SearchedInterventionNotFoundMessage from "./components/SearchedInterventionNotFoundMessage";
import { FilteredInterventions, SearchState } from "./state/search";
import { useDataEngine } from "@dhis2/app-runtime";

export default function InterventionList() {
  const [showAll, setShowAll] = useState<boolean>(false);
  const searchKeyword = useRecoilValue(SearchState);
  const interventions = useRecoilValue(FilteredInterventions);
  const firstIntervention: InterventionSummaryType | undefined = head(interventions);
  const history = useHistory();
  const engine = useDataEngine();

  function onToArchivesList(_: any, e: Event) {
    history.push("/" + firstIntervention?.id + "/archives");
  }

  const migrateData = useCallback(() => {
    migrateRootCauses(engine, interventions).catch((e) => console.error(e));
  }, [engine, interventions]);

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
        <div className="row gap ">
          <Button onClick={onToArchivesList}>{i18n.t("View Archives")}</Button>
          <Button onClick={migrateData}>{i18n.t("Migrate Data")}</Button>
        </div>
      </div>
      <IconButton style={{ padding: 2 }} onClick={() => setShowAll((prevState) => !prevState)}>
        {showAll ? <IconChevronUp24 /> : <IconChevronDown24 />}
      </IconButton>
    </div>
  );
}
