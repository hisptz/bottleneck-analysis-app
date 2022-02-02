import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, CheckboxField, Field, Modal, ModalActions, ModalContent, ModalTitle } from "@dhis2/ui";
import { DataSourceSelector } from "@hisptz/react-ui";
import React, { useCallback, useState } from "react";
import { Controller } from "react-hook-form";

function IndicatorSelectorModal({ onUpdate, onClose, hide, selected }: { onUpdate: (data: any) => void; onClose: () => void; hide: boolean; selected: any }) {
  const [selectedIndicators, setSelectedIndicators] = useState(selected);

  const onUpdateClick = useCallback(() => {
    onUpdate(selectedIndicators);
    onClose();
  }, [onUpdate, selectedIndicators]);

  const onSelect = useCallback((indicators: any) => {
    setSelectedIndicators(indicators);
  }, []);

  return (
    <Modal placement="middle" hide={hide} onClose={onClose}>
      <ModalTitle>{i18n.t("Select Indicator")}</ModalTitle>
      <ModalContent>
        <DataSourceSelector maxSelections={2} selected={selectedIndicators} onSelect={onSelect} />
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
          <Button primary onClick={onUpdateClick}>
            {i18n.t("Update")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}

export default function MapConfiguration() {
  const [openDataSelector, setOpenDataSelector] = useState(false);
  return (
    <Field label={i18n.t("Map Configuration")}>
      <div className="column gap">
        <div>
          <Controller
            name={"map.indicators"}
            render={({ field }) => {
              return (
                <Field label={i18n.t("Thematic Layer")}>
                  <p>{field.value?.map((value: { name: string; shortName: string }) => value.name || value.shortName)?.join(", ")}</p>
                  <Button onClick={() => setOpenDataSelector(true)}>Add Indicator</Button>
                  {openDataSelector && (
                    <IndicatorSelectorModal
                      hide={!openDataSelector}
                      onClose={() => setOpenDataSelector(false)}
                      onUpdate={field.onChange}
                      selected={field.value}
                    />
                  )}
                </Field>
              );
            }}
          />
        </div>
        <div className="column gap">
          <Field label={i18n.t("Other Layers")}>
            <Controller
              render={({ field }) => {
                return (
                  <CheckboxField label={i18n.t("Boundary")} checked={field.value} onChange={({ checked }: { checked: boolean }) => field.onChange(checked)} />
                );
              }}
              name={"map.config.enabled.boundary"}
            />
            <Controller
              render={({ field }) => {
                return (
                  <CheckboxField label={i18n.t("Facility")} checked={field.value} onChange={({ checked }: { checked: boolean }) => field.onChange(checked)} />
                );
              }}
              name={"map.config.enabled.facility"}
            />
          </Field>
        </div>
      </div>
    </Field>
  );
}
