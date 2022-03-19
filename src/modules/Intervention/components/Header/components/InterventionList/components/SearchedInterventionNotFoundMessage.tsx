import i18n from "@dhis2/d2-i18n";
import { colors, IconError24 } from "@dhis2/ui";
import React from "react";

export default function SearchedInterventionNotFoundMessage({ interventionSearchedIndex }: { interventionSearchedIndex: string }): React.ReactElement {
  return (
    <div className="row w-100 gap align-center" style={{ maxWidth: "100%", paddingTop: "1vh" }}>
      <IconError24 color={colors.grey700} />
      <p style={{ color: colors.grey700, margin: 0 }}>{i18n.t("No Intervention found for " + interventionSearchedIndex)}</p>
    </div>
  );
}
