import i18n from "@dhis2/d2-i18n";
import { Button, DataTable, DataTableCell, DataTableRow, TableBody, TableFoot } from "@dhis2/ui";
import { find } from "lodash";
import React, { useState } from "react";
import "./rootCauseTable.css";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { RootCauseTableConfig } from "../../state/config";
import { RootCauseData, RootCauseDataRequestId } from "../../state/data";
import RootCauseActionsProps from "./components/RootCauseActionsComponent";
import RootCauseFormComponent from "./components/RootCauseFormComponent";
import RootCauseTableHeaderComponent from "./components/RootCauseTableHeaderComponent";
import classes from "./RootCauseTable.module.css";

export default function RootCauseTable({ tableRef }: { tableRef: any }) {
  const { id } = useParams<{ id: string }>();
  const [rootCauseDataRequestId, setRootCauseDataRequestId] = useRecoilState(RootCauseDataRequestId);
  const { columns, rows, rowIds } = useRecoilValue(RootCauseTableConfig(id));
  const rootCauseData = useRecoilValue(RootCauseData(id));
  const [rootCauseFormDisplayStatus, setRootCauseFormDisplayStatus] = useState(false);
  const [selectedRootCauseData, setSelectedRootCauseData] = useState<any>({});

  function onUpdateRootCauseFormDisplayStatus() {
    setRootCauseFormDisplayStatus(!rootCauseFormDisplayStatus);
  }

  async function onDeleteRootCause(rootCauseIndex: number) {
    setSelectedRootCauseData({});
    const rootCauseId = rowIds[rootCauseIndex];
    console.log("onDeleteRootCause", rootCauseId);
  }

  async function onUpdateRootCause(rootCauseIndex: number) {
    const rootCause: any = rootCauseData[rootCauseIndex];
    const data = { ...rootCause.dataValues, id: rootCause.id };
    setSelectedRootCauseData(data);
    onUpdateRootCauseFormDisplayStatus();
  }

  function onSaveRootCauseSuccessfully() {
    onUpdateRootCauseFormDisplayStatus();
    setRootCauseDataRequestId(rootCauseDataRequestId + 1);
    setSelectedRootCauseData({});
  }

  function onSaveRootCauseFailed() {
    // Error exists
    setSelectedRootCauseData({});
  }

  return (
    <div style={{ width: "100%" }}>
      <DataTable className={classes["table"]} bordered>
        <RootCauseTableHeaderComponent columns={columns} />
        <TableBody>
          {rows.map((row, rowIndex) => (
            <DataTableRow key={rowIndex}>
              {row.map(({ key, value }, index) => {
                if (key === "Actions") {
                  return (
                    <DataTableCell className={classes["table-cell"]} key={index} align="center">
                      <RootCauseActionsProps
                        key={index}
                        onUpdateRootCause={() => onUpdateRootCause(rowIndex)}
                        onDeleteRootCause={() => onDeleteRootCause(rowIndex)}></RootCauseActionsProps>
                    </DataTableCell>
                  );
                }
                const { disabled } = find(columns, ["key", key]) ?? {};
                return (
                  <DataTableCell fixed={disabled ? disabled : undefined} align="center" className={classes["table-cell"]} key={index}>
                    {value}
                  </DataTableCell>
                );
              })}
            </DataTableRow>
          ))}
        </TableBody>
        <TableFoot>
          <DataTableRow>
            <DataTableCell align={"right"} colSpan={`${columns.length}`}>
              <Button onClick={onUpdateRootCauseFormDisplayStatus}>{i18n.t("Add New")}</Button>
            </DataTableCell>
          </DataTableRow>
        </TableFoot>
      </DataTable>

      <RootCauseFormComponent
        hideModal={rootCauseFormDisplayStatus}
        onSavingError={onSaveRootCauseFailed}
        onCancelForm={onUpdateRootCauseFormDisplayStatus}
        rootCauseData={selectedRootCauseData}
        onSuccessfullySaveRootCause={onSaveRootCauseSuccessfully}></RootCauseFormComponent>
    </div>
  );
}
