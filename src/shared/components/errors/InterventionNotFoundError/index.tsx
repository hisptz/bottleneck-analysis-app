import i18n from "@dhis2/d2-i18n";
import { colors, IconInfo24 } from "@dhis2/ui";
import React from "react";
import { useParams } from "react-router-dom";

export default function InterventionNotFoundError(): React.ReactElement {
  const { id: interventionId } = useParams<{ id: string }>();
  return (
    <div className=" h-100 w-100 center align-center column gap">
      <span className="icon-72">
        <IconInfo24 color={colors.grey700} />
      </span>
      <h2 style={{ margin: 0, color: colors.grey900 }}>{i18n.t("Intervention Not Found")}</h2>
      <p style={{ color: colors.grey700, fontSize: 18, margin: 0 }} className="error-text">
        {i18n.t("Intervention with id {{id}} could not be found", { id: interventionId })}
      </p>
    </div>
  );
}
