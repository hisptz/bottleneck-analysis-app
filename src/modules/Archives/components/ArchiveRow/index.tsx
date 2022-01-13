import { DataTableCell, DataTableRow, Tooltip } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import { truncate } from "lodash";
import React from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { OrgUnit } from "../../../../core/state/orgUnit";
import { SystemSettingsState } from "../../../../core/state/system";
import { Archive } from "../../../../shared/interfaces/archive";
import classes from "../../../../styles/Table.module.css";
import ArchiveMenuCell from "../ArchiveMenuCell";

export default function ArchiveRow({ archive }: { archive: Archive }): React.ReactElement {
  const history = useHistory();
  const { calendar } = useRecoilValue(SystemSettingsState);
  const { id, orgUnit: orgUnitId, config, period: periodId, dateCreated, remarks } = archive;
  const orgUnitState = useRecoilValueLoadable(OrgUnit(orgUnitId));
  const period = new Period().setCalendar(calendar).setPreferences({ allowFuturePeriods: true }).getById(periodId);

  const onViewClick = () => {
    history.push(`/archives/${id}`);
  };

  return (
    <DataTableRow className={"InterventionList-test"} onClick={onViewClick}>
      <DataTableCell className={classes["table-cell"]} onClick={onViewClick}>
        {config.name}
      </DataTableCell>
      <DataTableCell onClick={onViewClick} className={classes["table-cell"]}>
        {orgUnitState?.state !== "hasValue" ? "" : orgUnitState?.contents?.displayName}
      </DataTableCell>
      <DataTableCell onClick={onViewClick} className={classes["table-cell"]}>
        {period.name}
      </DataTableCell>
      <DataTableCell onClick={onViewClick} className={classes["table-cell"]}>
        <Tooltip content={remarks}>{truncate(remarks, { length: 124 })}</Tooltip>
      </DataTableCell>
      <DataTableCell onClick={onViewClick} className={classes["table-cell"]}>
        {dateCreated}
      </DataTableCell>
      <ArchiveMenuCell archive={archive} />
    </DataTableRow>
  );
}
