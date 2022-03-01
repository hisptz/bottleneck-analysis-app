import i18n from "@dhis2/d2-i18n";
import { Button, IconQuestion16 } from "@dhis2/ui";
import React from "react";
import "./archivesListHeader.css";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import HelpState from "../../../Intervention/state/help";

export default function ArchivesListHeader(): React.ReactElement {
  const setHelperState = useSetRecoilState(HelpState);
  const history = useHistory();

  function backToHomePage(_: any, _e: Event) {
    history.replace("/");
  }

  return (
    <div className="archive-list-row">
      <div className="archiveListTitle">{i18n.t("BNA Archives")}</div>
      <div className="archive-action-button">
        <Button
          icon={<IconQuestion16 color="#212529" />}
          onClick={() => {
            setHelperState(true);
          }}>
          {i18n.t("Help")}
        </Button>
        <Button className={"archive-intervntion-on-back-action"} onClick={backToHomePage}>
          {i18n.t("Back to all intervention")}
        </Button>
      </div>
    </div>
  );
}
