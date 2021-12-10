import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, CircularLoader, Modal, ModalActions, ModalContent, ModalTitle, NoticeBox, TextAreaField } from "@dhis2/ui";
import React from "react";
import useArchive from "./hooks/archive";

export default function ArchiveModal({ hide, onClose }: { hide: boolean; onClose: () => void }): React.ReactElement {
  const { loading, archiveExists, intervention, orgUnit, period, remarks, setRemarks, archiving, onArchiveClick } = useArchive(onClose);

  return (
    <Modal position="middle" onClose={onClose} hide={hide}>
      <ModalTitle>{i18n.t("Archive intervention")}</ModalTitle>
      <ModalContent>
        {loading ? (
          <div className="column w-100 center align-center" style={{ height: 300 }}>
            <CircularLoader small />
          </div>
        ) : (
          <div className="column gap m-8">
            <p>
              {`${i18n.t("Archiving the intervention")}  `}
              <strong> {`${intervention.name}`}</strong>
              {` ${i18n.t("for the organisation unit")} `}
              <strong>{orgUnit.displayName}</strong>
              {` ${i18n.t("and period")} `}
              <strong>{period.name}</strong>
            </p>
            {archiveExists && (
              <NoticeBox title={i18n.t("Archive Exists")} warning>
                {i18n.t("An archive with the same configuration, period and organisation unit already exists. Proceeding will overwrite the existing archive.")}
              </NoticeBox>
            )}
            <TextAreaField value={remarks} onChange={({ value }: { value: string }) => setRemarks(value)} label={i18n.t("Remarks")} />
          </div>
        )}
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
          <Button loading={archiving} onClick={onArchiveClick} disabled={!remarks || archiving} primary>
            {archiving ? i18n.t("Archiving...") : i18n.t("Archive")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
