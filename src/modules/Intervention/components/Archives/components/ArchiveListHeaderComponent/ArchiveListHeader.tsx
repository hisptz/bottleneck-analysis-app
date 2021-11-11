/* eslint-disable no-unused-vars */
/* eslint-disable import/named */
import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import React from "react";
import "./archivesListHeader.css";
import { useHistory } from "react-router-dom";
export default function ArchivesListHeader() {
  const history = useHistory();
  function backtoHomePage(_: any, _e: Event) {
    history.goBack();
  }
  return (
    <div className="row">
      <div className="archiveListTitle">BNA Archives</div>
      <div>
        <Button onClick={backtoHomePage}>{i18n.t("Back to Intervention")}</Button>
      </div>
    </div>
  );
}
