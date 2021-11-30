import i18n from "@dhis2/d2-i18n";
import { Button, SingleSelectField, SingleSelectOption, TextArea, Field, Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import { map, find } from "lodash";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { EngineState } from "../../../../../../../core/state/dataEngine";
import { CurrentInterventionSummary } from "../../../../../../../core/state/intervention";
import { UserOrganisationUnits } from "../../../../../../../core/state/user";
import { InterventionSummary } from "../../../../../../../shared/interfaces/interventionConfig";
import { uid } from "../../../../../../../shared/utils/generators";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { RootCauseData } from "../../../interfaces/rootCauseData";
import { addOrUpdateRootCauseData } from "../../../services/data";
import { RootCauseConfig } from "../../../state/config";

type RootCauseFormCProps = {
  onDismissRootCauseForm?: any;
  onSavingError?: any;
  hideModal: boolean;
};

export default function RootCauseFormComponent({ onDismissRootCauseForm, hideModal, onSavingError }: RootCauseFormCProps) {
  const { id: interventionId } = useParams<{ id: string }>();
  const { dataElements } = useRecoilValue(RootCauseConfig);
  const intervention: InterventionSummary | undefined = useRecoilValue(CurrentInterventionSummary(interventionId));
  const interventionName = intervention?.name || "";

  const engine = useRecoilValue(EngineState);

  let bottleneckMetadata = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["dataSelection", "groups"],
    })
  );

  const periodSelection = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["periodSelection"],
    })
  );
  const { id: periodId, name: period } = new Period().getById(periodSelection.id);

  const orgUnitSelection = useRecoilValue(
    InterventionStateSelector({
      id: interventionId,
      path: ["orgUnitSelection", "orgUnit"],
    })
  );
  const { id, displayName } = useRecoilValue(UserOrganisationUnits);
  const orgUnitId = orgUnitSelection.type === "USER_ORGANISATION_UNIT" ? id : orgUnitSelection.orgUnit.id;
  const orgUnitName = orgUnitSelection.type === "USER_ORGANISATION_UNIT" ? displayName : orgUnitSelection.orgUnit.id;

  const hiddenFields = {
    [getDataElementId("orgunit")]: orgUnitName,
    [getDataElementId("orgunitId")]: orgUnitId,
    [getDataElementId("period")]: period,
    [getDataElementId("periodId")]: periodId,
    [getDataElementId("Intervention")]: interventionName,
    [getDataElementId("interventionId")]: interventionId,
  };

  bottleneckMetadata = map(bottleneckMetadata, (group) => ({
    id: group.id,
    name: group.name,
    indicators: map(group?.items, (item) => ({ label: item.name, name: item.id })),
  }));

  const bottleneckOptions = map(bottleneckMetadata, (bottleneck) => ({ label: bottleneck?.name, id: bottleneck?.id }));

  const [rootCauseData, setRootCauseData] = useState(hiddenFields);
  const [interventionOptions, setInterventionOptions] = useState([]);
  const [rootCauseSaveButton, setRootCauseSaveButton] = useState(false);

  function getDataElementId(name: string): string {
    return find(dataElements, (dataElement) => dataElement.name.replace(/\s+/g, "").toLowerCase() === name.replace(/\s+/g, "").toLowerCase())?.id || "";
  }

  function onUpdateBottleneck(e: any) {
    const { selected: bottleneckId } = e;
    const bottleneck: any = find(bottleneckMetadata, (item: any) => item?.id === bottleneckId);
    setRootCauseData({
      ...rootCauseData,
      [getDataElementId("Bottleneck")]: bottleneck?.name,
      [getDataElementId("bottleneckId")]: bottleneckId,
      [getDataElementId("Indicator")]: "",
      [getDataElementId("IndicatorId")]: "",
    });
    setInterventionOptions(bottleneck?.indicators);
  }

  function onUpdateIndicator(e: any) {
    const { selected: indicator } = e;
    const { label: indicatorName } = find(interventionOptions, (item: any) => item?.name === indicator);
    setRootCauseData({ ...rootCauseData, [getDataElementId("Indicator")]: indicatorName, [getDataElementId("IndicatorId")]: indicator });
  }

  async function saveRootCause() {
    setRootCauseSaveButton(true);
    const data: RootCauseData = {
      id: `${periodId}_${orgUnitId}_${uid()}`,
      isOrphaned: false,
      isTrusted: true,
      configurationId: "rcaconfig",
      dataValues: rootCauseData,
    };
    try {
      await addOrUpdateRootCauseData(engine, interventionId, data);
    } catch (error) {
      onSavingError(error);
    }
    setRootCauseData({});
    setRootCauseSaveButton(false);
    onDismissRootCauseForm();
  }

  function onValueChange(e: any) {
    const { name, value } = e;
    if (name) {
      setRootCauseData({ ...rootCauseData, [name]: value });
    }
  }

  return (
    <Modal large={true} hide={!hideModal} onClose={saveRootCause} position="middle" small>
      <ModalTitle>{i18n.t("Root Cause form")}</ModalTitle>
      <ModalContent>
        <div>
          <SingleSelectField
            selected={rootCauseData[getDataElementId("bottleneckId")] || ""}
            label={i18n.t("Bottleneck")}
            name={getDataElementId("bottleneckId")}
            className="select"
            onChange={onUpdateBottleneck}>
            {bottleneckOptions.map((option, index) => (
              <SingleSelectOption label={option?.label} value={option?.id} key={index} />
            ))}
          </SingleSelectField>
          <SingleSelectField
            selected={rootCauseData[getDataElementId("indicatorId")] || ""}
            name={getDataElementId("indicatorId")}
            label={i18n.t("Indicator")}
            className="select"
            onChange={onUpdateIndicator}>
            {interventionOptions.map((option: any, index) => (
              <SingleSelectOption label={option?.label} value={option?.name} key={index} />
            ))}
          </SingleSelectField>

          <Field label={i18n.t("Possible root cause")}>
            <TextArea name={getDataElementId("Root cause")} resize="vertical" onBlur={onValueChange} />
          </Field>
          <Field label={i18n.t("Possible solution")}>
            <TextArea name={getDataElementId("Solution")} resize="vertical" onBlur={onValueChange} />
          </Field>
        </div>
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button disabled={rootCauseSaveButton} secondary onClick={onDismissRootCauseForm}>
            Cancel
          </Button>
          <Button primary disabled={rootCauseSaveButton} onClick={saveRootCause}>
            Save
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
