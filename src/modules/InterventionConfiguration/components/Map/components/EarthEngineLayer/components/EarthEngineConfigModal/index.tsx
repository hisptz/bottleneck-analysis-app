import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { useForm } from "react-hook-form";
import { EarthEngineLayerConfig } from "@hisptz/react-ui/build/types/components/Map/components/MapLayer/interfaces";
import { EarthEngineLayerConfigModalProps, EarthEngineLayerConfiguration } from "@hisptz/react-ui";

interface props extends EarthEngineLayerConfigModalProps {
  [key: string]: any;
}


export function EarthEngineLayerConfigModal({
                                              open,
                                              exclude,
                                              config,
                                              onClose,
                                              onChange,
                                              ...props
                                            }: props) {
  const form = useForm<EarthEngineLayerConfig>({
    defaultValues: config ?? {}
  });
  const onSubmitClick = (values: EarthEngineLayerConfig) => {
    onClose();
    onChange(values);
  };

  return (
    <Modal {...props} open={open} onClose={onClose}>
      <ModalTitle>{i18n.t("Configure Earth Engine Layer")}</ModalTitle>
      <ModalContent>
        <EarthEngineLayerConfiguration form={form} excluded={exclude} />
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={onClose}>{i18n.t("Cancel")}</Button>
          <Button primary onClick={form.handleSubmit(onSubmitClick)}>
            {i18n.t("Save")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
