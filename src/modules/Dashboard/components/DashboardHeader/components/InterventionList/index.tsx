import i18n from "@dhis2/d2-i18n";
import { Button, IconChevronDown24, IconChevronUp24 } from "@dhis2/ui";
import { IconButton } from "@material-ui/core";
import React, { useState } from "react";
import "./intervention-list.css";
import AddButton from "./components/AddButton";
import InterventionChips from "./components/InterventionChips";
import Search from "./components/Search";

export default function InterventionList() {
  const [showAll, setShowAll] = useState<boolean>(false);

  return (
    <div className="column center align-center w-100">
      <div className="intervention-list-container w-100 align-start">
        <div className="column flex">
          <div className="row gap align-start">
            <AddButton />
            <Search />
            <InterventionChips showAll={showAll} />
          </div>
        </div>
        <div className="column ">
          <Button>{i18n.t("View Archives")}</Button>
        </div>
      </div>
      <IconButton style={{ padding: 2 }} onClick={() => setShowAll((prevState) => !prevState)}>
        {showAll ? <IconChevronUp24 /> : <IconChevronDown24 />}
      </IconButton>
    </div>
  );
}