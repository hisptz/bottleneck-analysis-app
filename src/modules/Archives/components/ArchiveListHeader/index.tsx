/* eslint-disable no-unused-vars */
/* eslint-disable import/named */
import i18n from "@dhis2/d2-i18n";
import { Button, IconQuestion16 } from "@dhis2/ui";
import React from "react";
import "./archivesListHeader.css";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import HelpState from "../../../Intervention/state/help";
export default function ArchivesListHeader() {
  const setHelperState = useSetRecoilState(HelpState);
  const history = useHistory();
  function backtoHomePage(_: any, _e: Event) {
    history.goBack();
  }
  return (
    <div className="archive-list-row">
      <div className="archiveListTitle">BNA Archives</div>
      <div className="archive-action-button">
        <Button
          icon={<IconQuestion16 color="#212529" />}
          onClick={() => {
            setHelperState(true);
          }}>
          {i18n.t("Help")}
        </Button>
        <Button className={"archive-intervntion-on-back-action"} onClick={backtoHomePage}>{i18n.t("Back to Intervention")}</Button>
      </div>
    </div>
  );
}
