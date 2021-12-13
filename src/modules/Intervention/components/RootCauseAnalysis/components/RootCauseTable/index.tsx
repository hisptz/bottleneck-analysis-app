import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, DataTable, DataTableCell, DataTableRow, Modal, ModalActions, ModalContent, ModalTitle, TableBody, TableFoot } from "@dhis2/ui";
import { find } from "lodash";
import React, { useEffect, useState } from "react";
import "./rootCauseTable.css";
import { useParams } from "react-router-dom";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { EngineState } from "../../../../../../core/state/dataEngine";
import classes from "../../../../../../styles/Table.module.css";
import { deleteRootCauseData } from "../../services/data";
import { RootCauseTableConfig } from "../../state/config";
import { RootCauseData } from "../../state/data";
import RootCauseActionsProps from "./components/RootCauseActions";
import RootCauseForm from "./components/RootCauseForm";
import RootCauseTableHeader from "./components/RootCauseTableHeader";

export default function RootCauseTable({ tableRef }: { tableRef: any }): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const engine = useRecoilValue(EngineState);
  const { columns, rows, rowIds } = useRecoilValue(RootCauseTableConfig(id));
  const rootCauseData = useRecoilValue(RootCauseData(id));
  const resetRootCauseData = useRecoilRefresher_UNSTABLE(RootCauseData(id));
  const [rootCauseFormDisplayStatus, setRootCauseFormDisplayStatus] = useState(false);
  const [rootCauseDeleteStatus, setRootCauseDeleteStatus] = useState(false);
  const [rootCauseDeleteId, setRootCauseDeleteId] = useState<string>("");
  const [rootCauseDeleteButton, setRootCauseDeleteButton] = useState(false);
  const [selectedRootCauseData, setSelectedRootCauseData] = useState<any>({});
  const [error, setError] = useState<string>("");

  const { show: showError } = useAlert(({ message }) => message, { duration: 3000, info: true });

  useEffect(() => {
    if (error != "") {
      showError({ message: error });
    }
  }, [error, showError]);

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
      resetRootCauseData();
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
    resetRootCauseData();
  }

  function onSaveRootCauseSuccessfully() {
    onUpdateRootCauseFormDisplayStatus();
    resetRootCauseData();
    setSelectedRootCauseData({});
  }

  function onSaveRootCauseFailed() {
    setError(i18n.t("Failed to save root cause"));
    onUpdateRootCauseFormDisplayStatus();
    setSelectedRootCauseData({});
  }

  return (
    <div style={{ width: "100%" }} className="root-cause-widget-table column gap">
      <DataTable ref={tableRef} className={classes["table"]} bordered>
        <RootCauseTableHeader columns={columns} />
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
                        onDeleteRootCause={() => onDeleteRootCause(rowIndex)}
                      />
                    </DataTableCell>
                  );
                }
                const { disabled } = find(columns, ["key", key]) ?? {};

                if (disabled) {
                  return (
                    <DataTableCell fixed align="center" className={classes["table-name-cell"]} key={index}>
                      {value}
                    </DataTableCell>
                  );
                }
                return (
                  <DataTableCell align="center" className={classes["table-cell"]} key={index}>
                    {value}
                  </DataTableCell>
                );
              })}
            </DataTableRow>
          ))}
        </TableBody>
      </DataTable>
      <div className="w-100 row end">
        <Button className={"add-new-root-cause"} onClick={onUpdateRootCauseFormDisplayStatus}>
          {i18n.t("Add New")}
        </Button>
      </div>
      {rootCauseDeleteStatus && (
        <Modal small hide={!rootCauseDeleteStatus} position="middle">
          <ModalTitle>{i18n.t("Delete Root Cause")}</ModalTitle>
          <ModalContent>
            <p>{i18n.t("Are you sure you want to delete this root cause?")}</p>
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button disabled={rootCauseDeleteButton} onClick={onUpdateRootCauseDeleteStatus} secondary>
                {i18n.t("Cancel")}
              </Button>
              <Button
                loading={rootCauseDeleteButton}
                className={"delete-root-cause"}
                disabled={rootCauseDeleteButton}
                onClick={onConfirmDeleteRootCause}
                destructive>
                {rootCauseDeleteButton ? `${i18n.t("Deleting")}...` : i18n.t("Delete")}
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}

      {rootCauseFormDisplayStatus && (
        <RootCauseForm
          hideModal={rootCauseFormDisplayStatus}
          onSavingError={() => {
            setError("");
            onSaveRootCauseFailed();
          }}
          onCancelForm={onCancelRootCauseForm}
          rootCauseData={selectedRootCauseData}
          onSuccessfullySaveRootCause={onSaveRootCauseSuccessfully}
        />
      )}
    </div>
  );
}
