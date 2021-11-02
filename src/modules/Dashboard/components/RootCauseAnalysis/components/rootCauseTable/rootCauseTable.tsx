import i18n from "@dhis2/d2-i18n";
import { DataTable, TableHead, DataTableRow, DataTableColumnHeader, TableBody, DataTableCell, TableFoot, Button, IconMore16 } from "@dhis2/ui";
import React from "react";
import "./rootCauseTable.css";

export default function RootCausseTable() {
  return (
    <DataTable>
      <TableHead>
        <DataTableRow>
          <DataTableColumnHeader>SN.</DataTableColumnHeader>
          <DataTableColumnHeader>OrgUnit</DataTableColumnHeader>
          <DataTableColumnHeader>Period</DataTableColumnHeader>
          <DataTableColumnHeader>Intervention</DataTableColumnHeader>
          <DataTableColumnHeader>Bottleneck</DataTableColumnHeader>
          <DataTableColumnHeader>Indicator</DataTableColumnHeader>
          <DataTableColumnHeader>Possible root cause</DataTableColumnHeader>
          <DataTableColumnHeader>Possible solution</DataTableColumnHeader>
          <DataTableColumnHeader>Action</DataTableColumnHeader>
        </DataTableRow>
      </TableHead>
      <TableBody>
        <DataTableRow>
          <DataTableCell bordered>1</DataTableCell>
          <DataTableCell bordered tag="th">
            Animal Region
          </DataTableCell>
          <DataTableCell bordered tag="th">
            2019
          </DataTableCell>
          <DataTableCell bordered tag="th">
            Focused ANC coverage
          </DataTableCell>
          <DataTableCell bordered>Continouss Utilisation</DataTableCell>
          <DataTableCell bordered>Continous Utilization ANC Visits</DataTableCell>
          <DataTableCell bordered>Lack of human resources</DataTableCell>
          <DataTableCell bordered>Hire and train new midwives</DataTableCell>
          <DataTableCell bordered>
            <Button icon={<IconMore16 color="#212529" />} name="Icon large button" small value="default" />
          </DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell bordered>2</DataTableCell>
          <DataTableCell bordered tag="th">
            Animal Region
          </DataTableCell>
          <DataTableCell bordered tag="th">
            2019
          </DataTableCell>
          <DataTableCell bordered tag="th">
            Focused ANC coverage
          </DataTableCell>
          <DataTableCell bordered>Continouss Utilisation</DataTableCell>
          <DataTableCell bordered>Continous Utilization ANC Visits</DataTableCell>
          <DataTableCell bordered>Lack of human resources</DataTableCell>
          <DataTableCell bordered>Hire and train new midwives</DataTableCell>
          <DataTableCell bordered>
            <Button icon={<IconMore16 color="#212529" />} name="Icon large button" small value="default" />
          </DataTableCell>
        </DataTableRow>
        <DataTableRow>
          <DataTableCell bordered>3</DataTableCell>
          <DataTableCell bordered tag="th">
            Animal Region
          </DataTableCell>
          <DataTableCell bordered tag="th">
            2019
          </DataTableCell>
          <DataTableCell bordered tag="th">
            Focused ANC coverage
          </DataTableCell>
          <DataTableCell bordered>Continouss Utilisation</DataTableCell>
          <DataTableCell bordered>Continous Utilization ANC Visits</DataTableCell>
          <DataTableCell bordered>Lack of human resources</DataTableCell>
          <DataTableCell bordered>Hire and train new midwives</DataTableCell>
          <DataTableCell bordered>
            <Button icon={<IconMore16 color="#212529" />} name="Icon large button" small value="default" />
          </DataTableCell>
        </DataTableRow>
      </TableBody>
      <TableFoot>
        <DataTableRow>
          <DataTableCell align={"end"} colSpan="9">
            <Button>{i18n.t("Add New")}</Button>
          </DataTableCell>
        </DataTableRow>
      </TableFoot>
    </DataTable>
  );
}
