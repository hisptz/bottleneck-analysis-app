import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import React from "react";
import "./archivesListHeader.css";
export default function ArchivesListHeader() {
  return (
    <div className="row">
      <div className="archiveListTitle">BNA Archives</div>
      <div>
        <Button>{i18n.t("Back to Intervention")}</Button>
      </div>
    </div>
  );
}
