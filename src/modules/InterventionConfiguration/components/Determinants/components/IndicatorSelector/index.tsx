import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from "@dhis2/ui";
import { DataSourceSelector } from "@hisptz/react-ui";
import { filter, find, has } from "lodash";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { INDICATORS_PER_DETERMINANT } from "../../../../../../constants/constants";
import { DataItem, Group } from "../../../../../../shared/interfaces/interventionConfig";
import { InterventionDirtySelector } from "../../../../state/data";
import { generateLegendDefaults } from "../DeterminantArea/utils/indicators";

export interface IndicatorSelectorProps {
  group: Group;
  hide: boolean;
  onClose: () => void;
  onSave: (group: Group, indicators: Array<DataItem>) => void;
}

export default function IndicatorSelector({ group, hide, onClose, onSave }: IndicatorSelectorProps): any {
  const { id } = useParams<{ id: string }>();
  const [selectedIndicators, setSelectedIndicators] = useState<Array<DataItem>>(group?.items ?? []);
  const legendDefinitions = useRecoilValue(InterventionDirtySelector({ id, path: ["dataSelection", "legendDefinitions"] }));

  const onSubmit = (dataSources: Array<any>) => {
    setSelectedIndicators((selected) => {
      const newIndicators = filter(dataSources, (item) => !find(selected, { id: item.id }));
      newIndicators.forEach((indicator) => {
        if (!has(indicator, "legends")) {
          indicator.legends = generateLegendDefaults(filter(legendDefinitions, ["default", false]), 100);
          indicator.name = indicator.displayName;
          indicator.label = indicator.displayName;
          indicator.type = indicator.type.toUpperCase();
        }
      });
      return [...selected, ...newIndicators];
    });
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
              onSave(group, selectedIndicators);
            }}
            primary
          >
            {i18n.t("Add")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
