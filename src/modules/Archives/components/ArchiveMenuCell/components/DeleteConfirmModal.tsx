import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import React, { useState } from "react";
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { OrgUnit } from "../../../../../core/state/orgUnit";
import { SystemSettingsState } from "../../../../../core/state/system";
import { Archive } from "../../../../../shared/interfaces/archive";
import { deleteArchive } from "../../../../../shared/services/archives";
import { Archives } from "../../../state/data";

export default function DeleteConfirmModal({
  archive,
  hide,
  onClose,
  onDeleteComplete,
}: {
  archive: Archive;
  hide: boolean;
  onClose: () => void;
  onDeleteComplete?: () => void;
}): React.ReactElement {
  const { id, config, period: periodId, orgUnit: orgUnitId } = archive;
  const resetArchives = useRecoilRefresher_UNSTABLE(Archives);
  const engine = useDataEngine();
  const [deleting, setDeleting] = useState(false);
  const orgUnit = useRecoilValue(OrgUnit(orgUnitId));
  const { calendar } = useRecoilValue(SystemSettingsState);
  const period = new Period().setCalendar(calendar).setPreferences({ allowFuturePeriods: true }).getById(periodId);
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const onDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteArchive(engine, id);
      show({
        message: i18n.t("Archive deleted successfully"),
        type: { success: true },
      });
      onClose();
      resetArchives();
    } catch (e: any) {
      show({
        message: e?.message ?? i18n.t("Could not delete archive"),
        type: { info: true },
      });
    }
    setDeleting(false);
    onDeleteComplete && onDeleteComplete();
    onClose();
  };

  return (
    <Modal position="middle" hide={hide} onClose={onClose}>
      <ModalTitle>{i18n.t("Confirm Delete")}</ModalTitle>
      <ModalContent>
        <div className="column gap align-center">
          <div className="w-100">{i18n.t("Are you sure you want to delete this archive?")}</div>
          <strong>
            {config.name} - {orgUnit.displayName} - {period.name}
          </strong>
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
          <Button onClick={onDeleteConfirm} loading={deleting} destructive>
            {deleting ? `${i18n.t("Deleting")}...` : i18n.t("Delete")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
