import i18n from "@dhis2/d2-i18n";
import { Button, DataTable, DataTableCell, DataTableRow, IconMore24, IconEdit24, IconDelete24, Menu, MenuItem, Popover, TableBody, TableFoot } from "@dhis2/ui";
import { find } from "lodash";
import React, { useRef, useState } from "react";
import "./rootCauseTable.css";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { RootCauseTableConfig } from "../../state/config";
import { RootCauseData, RootCauseDataRequestId } from "../../state/data";
import RootCauseFormComponent from "./components/RootCauseFormComponent";
import RootCauseTableHeaderComponent from "./components/RootCauseTableHeaderComponent";
import classes from "./RootCauseTable.module.css";

export default function RootCauseTable({ tableRef }: { tableRef: any }) {
  const { id } = useParams<{ id: string }>();
  const [rootCauseDataRequestId, setRootCauseDataRequestId] = useRecoilState(RootCauseDataRequestId);
  const { columns, rows, rowIds } = useRecoilValue(RootCauseTableConfig(id));
  const rootCauseData = useRecoilValue(RootCauseData(id));
  const ref = useRef<HTMLDivElement | null>(null);
  const [stateRef, setStateRef] = useState<any>();
  const [rootCauseFormDisplayStatus, setRootCauseFormDisplayStatus] = useState(false);

  function onUpdateRootCauseFormDisplayStatus() {
    setRootCauseFormDisplayStatus(!rootCauseFormDisplayStatus);
  }

  async function onDeleteRootCause(rootCauseIndex: number) {
    const rootCauseId = rowIds[rootCauseIndex];
    console.log(rootCauseId);
  }

  async function onUpdateRootCause(rootCauseIndex: number) {
    const rootCause = rootCauseData[rootCauseIndex];
    console.log(rootCause);
  }

  function onSaveRootCauseSuccessfully() {
    onUpdateRootCauseFormDisplayStatus();
    setRootCauseDataRequestId(rootCauseDataRequestId + 1);
  }

  function onSaveRootCauseFailed() {
    // Error exists
  }

  return (
    <div style={{ width: "100%" }}>
      <DataTable className={classes["table"]} bordered>
        <RootCauseTableHeaderComponent columns={columns} />
        <TableBody>
          {rows.map((row, index) => (
            <DataTableRow key={index}>
              {row.map(({ key, value }, index) => {
                if (key === "Actions") {
                  return (
                    <DataTableCell className={classes["table-cell"]} key={index} align="center">
                      <Button
                        className={classes["button"]}
                        onClick={(_: any, e: MouseEvent) => {
                          setStateRef(e.target);
                          ref.current?.scrollIntoView({ behavior: "smooth" });
                        }}>
                        <IconMore24 />
                      </Button>
                      {/* <Popover onClickOutside={() => setStateRef(undefined)} placement="left-start" reference={stateRef}>
                        <Menu>
                          <MenuItem
                            onClick={() => {
                              onUpdateRootCause(index);
                            }}
                            label={i18n.t("Edit")}
                            icon={<IconEdit24 />}
                          />
                          <MenuItem
                            onClick={() => {
                              onDeleteRootCause(index);
                            }}
                            label={i18n.t("Delete")}
                            icon={<IconDelete24 />}
                          />
                        </Menu>
                      </Popover> */}
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
        rootCauseData={{}}
        onSuccessfullySaveRootCause={onSaveRootCauseSuccessfully}></RootCauseFormComponent>
    </div>
  );
}
