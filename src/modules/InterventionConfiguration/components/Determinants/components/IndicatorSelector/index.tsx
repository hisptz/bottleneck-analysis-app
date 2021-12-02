import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from "@dhis2/ui";
import { DataSourceSelector } from "@hisptz/react-ui";
import React, { useState } from "react";
import { INDICATORS_PER_DETERMINANT } from "../../../../../../constants/constants";
import { DataItem, Group } from "../../../../../../shared/interfaces/interventionConfig";

export interface IndicatorSelectorProps {
  group: Group;
  hide: boolean;
  onClose: () => void;
  onSave: (group: Group, indicators: Array<DataItem>) => void;
}

export default function IndicatorSelector({ group, hide, onClose, onSave }: IndicatorSelectorProps): any {
  const [selectedIndicators, setSelectedIndicators] = useState<Array<DataItem>>(group?.items ?? []);

  const onSubmit = (dataSources: Array<{ id: string; type: string; displayName: string }>) => {
    setSelectedIndicators(
      dataSources?.map(({ id, type, displayName }) => ({
        id,
        type,
        name: displayName,
        label: displayName,
        legends: [],
      }))
    );
  };

  return (
    <Modal position="middle" hide={hide} onClose={onClose}>
      <ModalTitle>{i18n.t("Select Indicator(s)")}</ModalTitle>
      <ModalContent>
        <DataSourceSelector
          selected={selectedIndicators as unknown as Array<any>}
          maxSelections={INDICATORS_PER_DETERMINANT}
          dataSources={["indicator", "customFunction"]}
          onSelect={onSubmit}
        />
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
          <Button
            onClick={() => {
              console.log(selectedIndicators);
              onSave(group, selectedIndicators);
            }}
            primary>
            {i18n.t("Add")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
