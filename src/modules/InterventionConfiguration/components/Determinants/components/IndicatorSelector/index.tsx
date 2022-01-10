import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from "@dhis2/ui";
import { DataSourceSelector } from "@hisptz/react-ui";
import { filter, find, uniqBy } from "lodash";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { INDICATORS_PER_DETERMINANT } from "../../../../../../constants/constants";
import { DataItem, Group } from "../../../../../../shared/interfaces/interventionConfig";
import { generateLegendDefaults } from "../DeterminantArea/utils/indicators";

export interface IndicatorSelectorProps {
  group: Group;
  hide: boolean;
  onClose: () => void;
  onSave: (group: Group, indicators: Array<DataItem>) => void;
}

export default function IndicatorSelector({ group, hide, onClose, onSave }: IndicatorSelectorProps): any {
  const { watch } = useFormContext();
  const [selectedIndicators, setSelectedIndicators] = useState<Array<DataItem>>(group?.items ?? []);
  const legendDefinitions = watch("legendDefinitions");

  const onSaveClicked = () => {
    const newIndicators = selectedIndicators.map((indicator: any) => {
      return (
        find(group?.items, { id: indicator.id }) ?? {
          ...indicator,
          name: indicator.displayName,
          label: indicator.displayName,
          legends: generateLegendDefaults(
            filter(legendDefinitions, (definition) => !definition.isDefault),
            100
          ),
          type: indicator.type.toUpperCase(),
        }
      );
    });
    onSave(group, uniqBy(newIndicators, "id"));
  };

  const onSubmit = (dataSources: Array<any>) => {
    setSelectedIndicators(dataSources);
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
          <Button onClick={onSaveClicked} primary>
            {i18n.t("Add")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
