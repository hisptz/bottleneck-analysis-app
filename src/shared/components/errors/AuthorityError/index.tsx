import i18n from "@dhis2/d2-i18n";
import { colors, IconBlock24 } from "@dhis2/ui";
import React from "react";

export default function AuthorityError({ actionType }: { actionType: "edit" | "add" | "view" }): React.ReactElement {
  return (
    <div className=" h-100 w-100 center align-center column gap">
      <span className="icon-72">
        <IconBlock24 color={colors.grey700} />
      </span>
      <h2 style={{ margin: 0, color: colors.grey900 }}>{i18n.t("Access Denied")}</h2>
      <p style={{ color: colors.grey700, fontSize: 18, margin: 0 }} className="error-text">
        {i18n.t("You do not have authority to ")}
        {`${actionType} ${i18n.t("interventions")}`}
      </p>
    </div>
  );
}
