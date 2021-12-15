import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from "@dhis2/ui";
import React from "react";

export default function ConfirmIndicatorDeleteModal({
  hide,
  onClose,
  onConfirm,
  item,
}: {
  hide: boolean;
  onClose: () => void;
  onConfirm: (groupId: string, itemId: string) => void;
  item: { groupId: string; itemId: string };
}): React.ReactElement {
  return (
    <Modal position={"middle"} small hide={hide} onClose={onClose}>
      <ModalTitle>{i18n.t("Confirm Delete")}</ModalTitle>
      <ModalContent>
        <div className="p-8">
          {i18n.t("Removing this indicator may affect already existing data for this intervention.")}
          {i18n.t(" Are you sure you want to delete this indicator?")}
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
          <Button
            destructive
            onClick={() => {
              onConfirm(item.groupId, item.itemId);
              onClose();
            }}>
            {i18n.t("Delete")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
