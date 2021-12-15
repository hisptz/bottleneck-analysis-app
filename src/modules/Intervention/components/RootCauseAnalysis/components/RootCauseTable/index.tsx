import { useAlert } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, DataTable, DataTableCell, DataTableRow, Modal, ModalActions, ModalContent, ModalTitle, TableBody } from "@dhis2/ui";
import { find } from "lodash";
import React, { Suspense, useState } from "react";
import "./rootCauseTable.css";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { UserAuthority } from "../../../../../../core/state/user";
import classes from "../../../../../../styles/Table.module.css";
import { RootCauseTableConfig } from "../../state/config";
import { RootCauseData } from "../../state/data";
import RootCauseActionsProps from "./components/RootCauseActions";
import RootCauseForm from "./components/RootCauseForm";
import RootCauseTableHeader from "./components/RootCauseTableHeader";
import { deleteRootCause } from "./services/data";

export default function RootCauseTable({ tableRef }: { tableRef: any }): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const authorities = useRecoilValue(UserAuthority);
  const updateRootCauseData = useSetRecoilState(RootCauseData(id));
  const { columns, rows, rowIds } = useRecoilValue(RootCauseTableConfig(id));
  const rootCauseData = useRecoilValue(RootCauseData(id));
  const [rootCauseFormDisplayStatus, setRootCauseFormDisplayStatus] = useState(false);
  const [rootCauseDeleteStatus, setRootCauseDeleteStatus] = useState(false);
  const [rootCauseDeleteId, setRootCauseDeleteId] = useState<string>("");
  const [selectedRootCauseData, setSelectedRootCauseData] = useState<any>({});
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

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
    updateRootCauseData((prevData) => {
      return deleteRootCause(rootCauseDeleteId, prevData);
    });
    setRootCauseDeleteId("");
    setRootCauseDeleteStatus(false);
    show({
      message: i18n.t("Root cause deleted successfully"),
      type: { success: true },
    });
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
        {authorities?.rootCause?.create && (
          <Button className={"add-new-root-cause"} onClick={onUpdateRootCauseFormDisplayStatus}>
            {i18n.t("Add New")}
          </Button>
        )}
      </div>
      {rootCauseDeleteStatus && (
        <Modal small hide={!rootCauseDeleteStatus} position="middle">
          <ModalTitle>{i18n.t("Delete Root Cause")}</ModalTitle>
          <ModalContent>
            <p>{i18n.t("Are you sure you want to delete this root cause?")}</p>
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button onClick={onUpdateRootCauseDeleteStatus} secondary>
                {i18n.t("Cancel")}
              </Button>
              <Button className={"delete-root-cause"} onClick={onConfirmDeleteRootCause} destructive>
                {i18n.t("Delete")}
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}

      {rootCauseFormDisplayStatus && (
        <Suspense fallback={<div />}>
          <RootCauseForm hideModal={rootCauseFormDisplayStatus} onCancelForm={onCancelRootCauseForm} rootCauseData={selectedRootCauseData} />
        </Suspense>
      )}
    </div>
  );
}
