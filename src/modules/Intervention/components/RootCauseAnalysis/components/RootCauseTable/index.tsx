import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Button, DataTable, DataTableCell, DataTableRow, TableBody, TableFoot, Modal, ModalTitle, ModalActions, ModalContent, ButtonStrip } from "@dhis2/ui";
import { find } from "lodash";
import React, { useEffect, useState } from "react";
import "./rootCauseTable.css";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { EngineState } from "../../../../../../core/state/dataEngine";
import { UserAuthority } from "../../../../../../core/state/user";
import { deleteRootCauseData } from "../../services/data";
import { RootCauseTableConfig } from "../../state/config";
import { RootCauseData, RootCauseDataRequestId } from "../../state/data";
import RootCauseActionsProps from "./components/RootCauseActionsComponent";
import RootCauseFormComponent from "./components/RootCauseFormComponent";
import RootCauseTableHeaderComponent from "./components/RootCauseTableHeaderComponent";
import classes from "./RootCauseTable.module.css";

export default function RootCauseTable({ tableRef }: { tableRef: any }) {
  const { id } = useParams<{ id: string }>();
  const authorities = useRecoilValue(UserAuthority);
  const [rootCauseDataRequestId, setRootCauseDataRequestId] = useRecoilState(RootCauseDataRequestId);
  const engine = useRecoilValue(EngineState);
  const { columns, rows, rowIds } = useRecoilValue(RootCauseTableConfig(id));
  const rootCauseData = useRecoilValue(RootCauseData(id));
  const [rootCauseFormDisplayStatus, setRootCauseFormDisplayStatus] = useState(false);
  const [rootCauseDeleteStatus, setRootCauseDeleteStatus] = useState(false);
  const [rootCauseDeleteId, setRootCauseDeleteId] = useState<string>("");
  const [rootCauseDeleteButton, setRootCauseDeleteButton] = useState(false);
  const [selectedRootCauseData, setSelectedRootCauseData] = useState<any>({});
  const [error, setError] = useState<string>("");

  const { show: showError } = useAlert(({ message }) => message, { duration: 3000, critical: true });

  useEffect(() => {
    if (error != "") {
      showError({ message: error });
    }
  }, [error]);

  function onUpdateRootCauseFormDisplayStatus() {
    setRootCauseFormDisplayStatus(!rootCauseFormDisplayStatus);
  }

  function onUpdateRootCauseDeleteStatus() {
    setRootCauseDeleteStatus(!rootCauseDeleteStatus);
  }

  function onCancelRootCauseForm() {
    setSelectedRootCauseData({});
    onUpdateRootCauseFormDisplayStatus();
  }

  async function onConfirmDeleteRootCause() {
    setError("");
    setRootCauseDeleteButton(true);
    try {
      await deleteRootCauseData(engine, id, rootCauseDeleteId);
      onUpdateRootCauseDeleteStatus();
      setRootCauseDataRequestId(rootCauseDataRequestId + 1);
    } catch (error) {
      setError(i18n.t("Failed to delete root cause"));
      onUpdateRootCauseDeleteStatus();
    }
    setRootCauseDeleteButton(false);
  }

  async function onDeleteRootCause(rootCauseIndex: number) {
    setSelectedRootCauseData({});
    const rootCauseId = rowIds[rootCauseIndex];
    setRootCauseDeleteId(rootCauseId);
    onUpdateRootCauseDeleteStatus();
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
    setError(i18n.t("Failed to save root cause"));
    onUpdateRootCauseFormDisplayStatus();
    setSelectedRootCauseData({});
  }

  return (
    <div style={{ width: "100%" }} className="root-cause-widget-table">
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
              {authorities?.rootCause?.create && (
                <Button className={"add-new-root-cause"} onClick={onUpdateRootCauseFormDisplayStatus}>
                  {i18n.t("Add New")}
                </Button>
              )}
            </DataTableCell>
          </DataTableRow>
        </TableFoot>
      </DataTable>

      <Modal small={true} hide={!rootCauseDeleteStatus} position="middle">
        <ModalTitle>{i18n.t("Delete Root Cause")}</ModalTitle>
        <ModalContent>
          <p>{i18n.t("Are you sure you want to delete this root cause?")}</p>
        </ModalContent>
        <ModalActions>
          <ButtonStrip end>
            <Button disabled={rootCauseDeleteButton} onClick={onUpdateRootCauseDeleteStatus} secondary>
              Cancel
            </Button>
            <Button className={"delete-root-cause"} disabled={rootCauseDeleteButton} onClick={onConfirmDeleteRootCause} destructive>
              {rootCauseDeleteButton ? "Deleting..." : "Delete"}
            </Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>

      <RootCauseFormComponent
        hideModal={rootCauseFormDisplayStatus}
        onSavingError={() => {
          setError("");
          onSaveRootCauseFailed();
        }}
        onCancelForm={onCancelRootCauseForm}
        rootCauseData={selectedRootCauseData}
        onSuccessfullySaveRootCause={onSaveRootCauseSuccessfully}></RootCauseFormComponent>
    </div>
  );
}
