import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip } from "@dhis2/ui";
import React from "react";
import { useHistory, useParams } from "react-router-dom";
import "./index.css";
import { useRecoilValue } from "recoil";
import { OrgUnit } from "../../../../../core/state/orgUnit";
import { OrgUnit as OrgUnitType } from "../../../../../shared/interfaces/orgUnit";
import { Archive } from "../../../state/data";
import { Period } from "@iapps/period-utilities";

export default function IndividualArchiveHeader(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const { config, period: periodId, orgUnit: orgUnitId } = useRecoilValue(Archive(id));
  const orgUnit: OrgUnitType = useRecoilValue(OrgUnit(orgUnitId));
  const period = new Period().getById(periodId);
  const history = useHistory();
  return (
    <div className="archive-header w-100 row space-between p-16 align-center">
      <div className="column">
        <h2>{config.name}</h2>
        <span>
          {orgUnit.displayName} - {period.name}
        </span>
      </div>
      <div>
        <ButtonStrip end>
          <Button
            onClick={(_: any, e: Event) => {
              history.goBack();
            }}>
            {i18n.t("Back to archives")}
          </Button>
          <Button>{i18n.t("Refresh")}</Button>
          <Button>{i18n.t("Delete")}</Button>
        </ButtonStrip>
      </div>
    </div>
  );
}
