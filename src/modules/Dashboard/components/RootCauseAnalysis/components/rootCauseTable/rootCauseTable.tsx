/* eslint-disable react/jsx-key */
import i18n from "@dhis2/d2-i18n";
import {
  TextAreaField,
  DataTable,
  IconDelete16,
  IconEdit16,
  DataTableRow,
  MenuItem,
  Menu,
  TableBody,
  DataTableCell,
  TableFoot,
  Button,
  Popover,
  IconMore16,
  SingleSelect,
  SingleSelectOption,
} from "@dhis2/ui";
import React, { useRef, useState } from "react";
import "./rootCauseTable.css";
import RootCauseTableHeaderComponent from "./rootCauseTableHeaderComponent";

export default function RootCausseTable() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [stateRef, setstateRef] = useState<any>();
  const init = (
    <DataTableRow>
      <DataTableCell bordered>4</DataTableCell>
      <DataTableCell bordered tag="th">
        Animal Region
      </DataTableCell>
      <DataTableCell bordered tag="th">
        2019
      </DataTableCell>
      <DataTableCell bordered tag="th">
        Focused ANC coverage
      </DataTableCell>
      <DataTableCell bordered>form</DataTableCell>
      <DataTableCell bordered>Form</DataTableCell>
      <DataTableCell bordered>Form</DataTableCell>
      <DataTableCell bordered>Form</DataTableCell>
      <DataTableCell bordered>
        <Button icon={<IconMore16 color="#212529" />} name="Icon large button" small value="default" />
      </DataTableCell>
    </DataTableRow>
  );

  return (
    <DataTable>
      <RootCauseTableHeaderComponent />
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
            <div ref={ref}>
              <Button
                onClick={(_: any, e: MouseEvent) => setstateRef(e.target)}
                icon={<IconMore16 color="#212529" />}
                name="Icon large button"
                small
                value="default"
              />
            </div>
            {stateRef && (
              <Popover onClickOutside={() => setstateRef(undefined)} placement="bottom" reference={ref}>
                <Menu>
                  <MenuItem icon={<IconEdit16 color="#212529" />} label="Edit" />
                  <MenuItem icon={<IconDelete16 color="red" />} label="Delete" />
                </Menu>
              </Popover>
            )}
          </DataTableCell>
        </DataTableRow>
        ,
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
        ,
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
          <DataTableCell bordered>
            {" "}
            <SingleSelect placeholder={"Bottleneck"}>
              <SingleSelectOption value="1" label="BottleNeck one" />
              <SingleSelectOption value="2" label="BottleNeck two" />
              <SingleSelectOption value="3" label="BottleNeck three" />
            </SingleSelect>
          </DataTableCell>
          <DataTableCell bordered>
            {" "}
            <SingleSelect placeholder={"Indicator"}>
              <SingleSelectOption value="1" label="Indicator one" />
              <SingleSelectOption value="2" label="Indicator two" />
              <SingleSelectOption value="3" label="Indicator three" />
            </SingleSelect>
          </DataTableCell>
          <DataTableCell bordered>
            {" "}
            <TextAreaField name="textareaName" />
          </DataTableCell>
          <DataTableCell bordered>
            <TextAreaField name="textareaName" />
          </DataTableCell>
          <DataTableCell bordered>
            <Button icon={<IconMore16 color="#212529" />} name="Icon large button" small value="default" />
          </DataTableCell>
        </DataTableRow>
      </TableBody>
      <TableFoot>
        <DataTableRow>
          <DataTableCell align={"end"} colSpan="9">
            <Button
              onClick={function (_, e) {
                // setDataTableRowDetails([...dataTableRowDetails, init]);
              }}>
              {i18n.t("Add New")}
            </Button>
          </DataTableCell>
        </DataTableRow>
      </TableFoot>
    </DataTable>
  );
}
