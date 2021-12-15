import { DataTableCell, DataTableRow } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import React from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { OrgUnit } from "../../../../core/state/orgUnit";
import { SystemSettingsState } from "../../../../core/state/system";
import { Archive } from "../../../../shared/interfaces/archive";
import ArchiveMenuCell from "../ArchiveMenuCell";

export default function ArchiveRow({ archive }: { archive: Archive }): React.ReactElement {
  const history = useHistory();
  const { calendar } = useRecoilValue(SystemSettingsState);
  const { id, orgUnit: orgUnitId, config, period: periodId, dateCreated } = archive;
  const orgUnitState = useRecoilValueLoadable(OrgUnit(orgUnitId));
  const period = new Period().setCalendar(calendar).setPreferences({ allowFuturePeriods: true }).getById(periodId);

  const onViewClick = () => {
    history.push(`/archives/${id}`);
  };

  return (
    <DataTableRow className={"InterventionList-test"} onClick={onViewClick}>
      <DataTableCell onClick={onViewClick}>{config.name}</DataTableCell>
      <DataTableCell>{orgUnitState?.state !== "hasValue" ? "" : orgUnitState?.contents?.displayName}</DataTableCell>
      <DataTableCell>{period.name}</DataTableCell>
      <DataTableCell>{dateCreated}</DataTableCell>
      <ArchiveMenuCell archive={archive} />
    </DataTableRow>
  );
}
