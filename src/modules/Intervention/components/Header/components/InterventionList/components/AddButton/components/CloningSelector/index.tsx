import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, InputField, Modal, ModalActions, ModalContent, ModalTitle, SingleSelectField, SingleSelectOption } from "@dhis2/ui";
import { find } from "lodash";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { AuthorizedInterventionSummary } from "../../../../../../../../../../core/state/intervention";
import { InterventionSummary as InterventionSummaryType } from "../../../../../../../../../../shared/interfaces/interventionConfig";
import useClone from "./hooks/clone";

export default function CloningSelector({ hide, onClose }: { hide: boolean; onClose: () => void }): React.ReactElement {
  const [newInterventionName, setNewInterventionName] = useState<string | undefined>();
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionSummaryType>();
  const summaries: Array<InterventionSummaryType> = useRecoilValue(AuthorizedInterventionSummary) ?? [];

  const { cloning, onClone } = useClone();

  useEffect(() => {
    if (selectedIntervention) {
      setNewInterventionName(selectedIntervention.name);
    }
  }, [selectedIntervention]);

  return (
    <Modal position={"middle"} hide={hide} onClose={onClose}>
      <ModalTitle>{i18n.t("Duplicate Intervention")}</ModalTitle>
      <ModalContent>
        <div className="column gap w-100 p-8">
          <SingleSelectField
            onChange={({ selected }: { selected: string }) => setSelectedIntervention(find(summaries, { id: selected }))}
            fullWidth
            selected={selectedIntervention?.id}
            label={i18n.t("Select the intervention you want to duplicate")}>
            {summaries?.map((summary) => (
              <SingleSelectOption key={`${summary?.id}-cloning menu`} value={summary?.id} label={summary?.name} />
            ))}
          </SingleSelectField>
          <InputField
            disabled={!selectedIntervention}
            fullWidth
            onChange={({ value }: { value: string }) => setNewInterventionName(value)}
            label={i18n.t("Name of the new intervention")}
            name="name"
            type="text"
            value={newInterventionName}
          />
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip>
          <Button onClick={() => onClose()}>{i18n.t("Cancel")}</Button>
          <Button
            onClick={() => {
              if (selectedIntervention && newInterventionName) {
                onClone(selectedIntervention?.id, newInterventionName);
              }
            }}
            loading={cloning}
            primary
            disabled={!selectedIntervention || !newInterventionName || newInterventionName === selectedIntervention?.name || cloning}>
            {cloning ? i18n.t("Duplicating...") : i18n.t("Duplicate")}
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
