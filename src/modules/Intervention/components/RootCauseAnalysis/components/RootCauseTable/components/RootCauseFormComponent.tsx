import i18n from "@dhis2/d2-i18n";
import { Button, ReactFinalForm, SingleSelectFieldFF, TextAreaFieldFF, Modal, ModalTitle, ModalContent, ButtonStrip } from "@dhis2/ui";
import { Period } from "@iapps/period-utilities";
import { map, find } from "lodash";
import React, { useState } from "react";
import { OnChange } from "react-final-form-listeners";
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
  onSuccessfullySaveRootCause?: any;
  onSavingError?: any;
  onCancelForm?: any;
  hideModal: boolean;
  rootCauseData?: any;
};

export default function RootCauseFormComponent({ onSuccessfullySaveRootCause, hideModal, onSavingError, onCancelForm, rootCauseData }: RootCauseFormCProps) {
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
  const orgUnitId = orgUnitSelection.type === "USER_ORGANISATION_UNIT" ? id : orgUnitSelection.id;
  const orgUnitName = orgUnitSelection.type === "USER_ORGANISATION_UNIT" ? displayName : orgUnitSelection.id;

  const rootCauseHiddenFields = {
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
  const [interventionOptions, setInterventionOptions] = useState<any[]>([]);
  const [selectedBottleneckName, setSelectedBottleneckName] = useState("");
  const [selectedIndicatorName, setSelectedIndicatorName] = useState("");
  const [rootCauseSaveButton, setRootCauseSaveButton] = useState(false);

  function getDataElementId(name: string): string {
    return find(dataElements, (dataElement) => dataElement.name.replace(/\s+/g, "").toLowerCase() === name.replace(/\s+/g, "").toLowerCase())?.id || "";
  }

  // function getDefaultInterventionOptions(): any[] {
  //   const bottleneckId = rootCauseData[getDataElementId("bottleneckId")];
  //   if (bottleneckId) {
  //     return [];
  //   }
  //   const bottleneck = find(bottleneckMetadata, (item: any) => item?.id === bottleneckId);
  //   const indicators = bottleneck?.indicators || [];

  //   return indicators;
  // }

  function onUpdateBottleneck(bottleneckId: string) {
    const bottleneck: any = find(bottleneckMetadata, (item: any) => item?.id === bottleneckId);
    setSelectedBottleneckName(bottleneck?.name);
    setInterventionOptions(bottleneck?.indicators);
  }

  function onUpdateIndicator(indicatorId: string) {
    const indicator: any = find(interventionOptions, (item: any) => item?.name === indicatorId);
    setSelectedIndicatorName(indicator?.label);
  }

  function onClearIndicator(form: any) {
    form.change(getDataElementId("indicatorId"), "");
    form.resetFieldState(getDataElementId("indicatorId"));
    setSelectedIndicatorName("");
  }

  function onClosingFormModal(form: any) {
    form.reset();
    onCancelForm();
  }

  async function saveRootCause(dataValues: any, form: any) {
    setRootCauseSaveButton(true);
    const data: RootCauseData = {
      id: rootCauseData && rootCauseData.id ? rootCauseData.id : `${periodId}_${orgUnitId}_${uid()}`,
      isOrphaned: false,
      isTrusted: true,
      configurationId: "rcaconfig",
      dataValues: {
        ...dataValues,
        ...rootCauseHiddenFields,
        [getDataElementId("bottleneck")]: selectedBottleneckName,
        [getDataElementId("indicator")]: selectedIndicatorName,
      },
    };
    try {
      await addOrUpdateRootCauseData(engine, interventionId, data);
      form.reset();
      setRootCauseSaveButton(false);
      onSuccessfullySaveRootCause();
    } catch (error) {
      form.reset();
      setRootCauseSaveButton(false);
      onSavingError(error);
    }
  }

  return (
    <Modal large={true} hide={!hideModal} position="middle">
      <ModalTitle>{i18n.t("Root Cause form")}</ModalTitle>
      <ModalContent>
        <ReactFinalForm.Form onSubmit={saveRootCause}>
          {({ handleSubmit, form }) => {
            return (
              <form
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
                onSubmit={(event) => {
                  handleSubmit(event, form);
                }}>
                <OnChange name={getDataElementId("bottleneckId")}>
                  {(value: string) => {
                    onUpdateBottleneck(value);
                    onClearIndicator(form);
                  }}
                </OnChange>
                <OnChange name={getDataElementId("indicatorId")}>
                  {(value: string) => {
                    onUpdateIndicator(value);
                  }}
                </OnChange>

                <ReactFinalForm.Field
                  name={getDataElementId("bottleneckId")}
                  label={i18n.t("Bottleneck")}
                  component={SingleSelectFieldFF}
                  initialValue={rootCauseData[getDataElementId("bottleneckId")] || ""}
                  className="select"
                  options={(bottleneckOptions || []).map((option: any) => ({ label: option?.label, value: option?.id }))}
                />
                <ReactFinalForm.Field
                  name={getDataElementId("indicatorId")}
                  label={i18n.t("Indicator")}
                  component={SingleSelectFieldFF}
                  // initialValue={rootCauseData[getDataElementId("indicatorId")] || ""}
                  className="select"
                  options={(interventionOptions || []).map((option: any) => ({ label: option?.label, value: option?.name }))}
                />

                <ReactFinalForm.Field
                  required
                  name={getDataElementId("Root cause")}
                  initialValue={rootCauseData[getDataElementId("Root cause")] || ""}
                  label={i18n.t("Possible root cause")}
                  component={TextAreaFieldFF}
                />
                <ReactFinalForm.Field
                  required
                  name={getDataElementId("Solution")}
                  initialValue={rootCauseData[getDataElementId("solution")] || ""}
                  label={i18n.t("Possible solution")}
                  component={TextAreaFieldFF}
                />

                <div className="column">
                  <ButtonStrip end>
                    <Button
                      disabled={rootCauseSaveButton}
                      secondary
                      onClick={() => {
                        onClosingFormModal(form);
                      }}>
                      Cancel
                    </Button>
                    <Button primary disabled={rootCauseSaveButton} type="submit">
                      {rootCauseSaveButton ? "Saving..." : "Save"}
                    </Button>
                  </ButtonStrip>
                </div>
              </form>
            );
          }}
        </ReactFinalForm.Form>
      </ModalContent>
    </Modal>
  );
}
