import { DataTableCell, DataTableRow } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import React from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { OrgUnit } from "../../../../core/state/orgUnit";
import { Archive } from "../../../../shared/interfaces/archive";
import ArchiveMenuCell from "../ArchiveMenuCell";

export default function ArchiveRow({ archive }: { archive: Archive }): React.ReactElement {
  const history = useHistory();
  const { id, orgUnit: orgUnitId, config, period: periodId, dateCreated } = archive;
  const orgUnitState = useRecoilValueLoadable(OrgUnit(orgUnitId));
  const period = new Period().getById(periodId);

  const onViewClick = () => {
    history.push(`/archives/${id}`);
  };

  return (
    <DataTableRow onClick={onViewClick}>
      <DataTableCell onClick={onViewClick}>{config.name}</DataTableCell>
      <DataTableCell>{orgUnitState?.state !== "hasValue" ? "" : orgUnitState?.contents?.displayName}</DataTableCell>
      <DataTableCell>{period.name}</DataTableCell>
      <DataTableCell>{dateCreated}</DataTableCell>
      <ArchiveMenuCell id={id} />
    </DataTableRow>
  );
}
