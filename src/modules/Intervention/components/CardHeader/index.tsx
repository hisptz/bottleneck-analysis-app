import { colors } from "@dhis2/ui";
import React from "react";
import { useRecoilValue } from "recoil";
import { InterventionStateSelector } from "../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../state/selections";
import { useParams } from "react-router-dom";

export default function CardHeader() {
  const { id } = useParams<{ id: string }>();
  const interventionName = useRecoilValue(InterventionStateSelector({ id, path: ["name"] }));
  const period = useRecoilValue(InterventionPeriodState(id));
  const orgUnit = useRecoilValue(InterventionOrgUnitState(id));

  return (
    <div style={{ alignItems: "baseline" }} className="row">
      <h4 style={{ color: colors.grey700 }}>
        {`${interventionName}`}, {`${orgUnit?.displayName}`} - {`${period?.name}`}
      </h4>
    </div>
  );
}
