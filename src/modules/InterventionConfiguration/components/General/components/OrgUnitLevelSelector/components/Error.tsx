import i18n from "@dhis2/d2-i18n";
import { NoticeBox } from "@dhis2/ui";
import React from "react";

export default function OrgUnitLevelError(): React.ReactElement {
  return (
    <div className="column center align-center w-100 ">
      <NoticeBox warning title={i18n.t("Sub-level analysis configuration unavailable")}>
        <span>{i18n.t("Current sub-level analysis configuration were set by a user with higher organisation unit level access and cannot be modified.")}</span>
      </NoticeBox>
    </div>
  );
}
