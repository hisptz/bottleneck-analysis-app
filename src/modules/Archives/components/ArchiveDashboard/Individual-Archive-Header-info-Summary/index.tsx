import i18n from "@dhis2/d2-i18n";
import { NoticeBox } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import React from "react";
import "./index.css";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { OrgUnit } from "../../../../../core/state/orgUnit";
import { SystemSettingsState } from "../../../../../core/state/system";
import { Archive } from "../../../state/data";

export default function IndividualArchiveHeaderInfoSummary(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { calendar } = useRecoilValue(SystemSettingsState);
  const { config, orgUnit: orgUnitId, period: periodId } = useRecoilValue(Archive(id));
  const orgUnit = useRecoilValue(OrgUnit(orgUnitId));
  const period = new Period().setCalendar(calendar).setPreferences({ allowFuturePeriods: true }).getById(periodId);

  const onLiveLinkClick = () => {
    history.push(`/interventions/${config?.id}`);
  };

  return (
    <div className="w-100 archive-header-info-summary">
      <NoticeBox title={i18n.t("You are currently viewing an archived intervention")}>
        <div style={{ gap: 8 }} className="column ">
          <span>
            {i18n.t("Data shown is based on archive of ")}
            <strong>{config.name}</strong>
            {` ${i18n.t("for")} ${i18n.t("organisation unit")} `} <strong>{orgUnit?.displayName}</strong> {` ${i18n.t("and")} ${i18n.t("period")} `}{" "}
            <strong>{period.name}</strong>.
          </span>
          <span onClick={onLiveLinkClick} className="notice-box-link">{`${i18n.t("Go to live")} ${config.name}`}</span>
        </div>
      </NoticeBox>
    </div>
  );
}
