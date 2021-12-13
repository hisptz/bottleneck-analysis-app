import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, Modal, ModalContent, ModalTitle, ReactFinalForm, SingleSelectFieldFF, TextAreaFieldFF } from "@dhis2/ui";
import { find, map } from "lodash";
import React, { useEffect, useState } from "react";
import { OnChange } from "react-final-form-listeners";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { EngineState } from "../../../../../../../core/state/dataEngine";
import { CurrentInterventionSummary } from "../../../../../../../core/state/intervention";
import { InterventionSummary } from "../../../../../../../shared/interfaces/interventionConfig";
import { uid } from "../../../../../../../shared/utils/generators";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../../state/selections";
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

export default function RootCauseForm({
  onSuccessfullySaveRootCause,
  hideModal,
  onSavingError,
  onCancelForm,
  rootCauseData,
}: RootCauseFormCProps): React.ReactElement {
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

  const { name: period, id: periodId } = useRecoilValue(InterventionPeriodState(interventionId)) ?? {};
  const orgUnit = useRecoilValue(InterventionOrgUnitState(interventionId));

  const orgUnitId = orgUnit.id;
  const orgUnitName = orgUnit.displayName;

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
  const [shouldClearIndicator, setShouldClearIndicator] = useState(false);

  useEffect(() => {
    setInterventionOptions(getDefaultInterventionOptions());
  }, [rootCauseData]);

  function getDataElementId(name: string): string {
    return find(dataElements, (dataElement) => dataElement.name.replace(/\s+/g, "").toLowerCase() === name.replace(/\s+/g, "").toLowerCase())?.id || "";
  }

  function getDefaultInterventionOptions(): any[] {
    const bottleneckId = rootCauseData[getDataElementId("bottleneckId")];
    if (!bottleneckId) {
      return [];
    }
    const bottleneck = find(bottleneckMetadata, (item: any) => item?.id === bottleneckId);
    return bottleneck?.indicators || [];
  }

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
    form.change(getDataElementId("indicatorId"), shouldClearIndicator ? "" : rootCauseData[getDataElementId("indicatorId")] || "");
    form.resetFieldState(getDataElementId("indicatorId"));
    setSelectedIndicatorName(shouldClearIndicator ? "" : rootCauseData[getDataElementId("indicator")] || "");
    if (hideModal) {
      setShouldClearIndicator(true);
    }
  }

  function onClosingFormModal(form: any) {
    setShouldClearIndicator(false);
    form.restart();
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
    setShouldClearIndicator(false);
  }

  return (
    <Modal className={"root-cause-form"} large={true} hide={!hideModal} position="middle">
      <ModalTitle>{i18n.t("Root Cause form")}</ModalTitle>
      <ModalContent>
        <ReactFinalForm.Form onSubmit={saveRootCause}>
          {({ handleSubmit, form }: { handleSubmit: any; form: any }) => {
            return (
              <form
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
                onSubmit={(event) => {
                  handleSubmit(event, form);
                }}>
                <OnChange name={getDataElementId("bottleneckId")}>
                  {(value: string) => {
                    onUpdateBottleneck(value);
                    if (hideModal || shouldClearIndicator) {
                      onClearIndicator(form);
                    }
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
                  options={(bottleneckOptions || []).map((option: any) => ({ label: option?.label, value: option?.id }))}
                />
                <ReactFinalForm.Field
                  name={getDataElementId("indicatorId")}
                  label={i18n.t("Indicator")}
                  component={SingleSelectFieldFF}
                  initialValue={hideModal ? "" : rootCauseData[getDataElementId("indicatorId")] || ""}
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
                    <Button loading={rootCauseSaveButton} primary disabled={rootCauseSaveButton} type="submit">
                      {rootCauseSaveButton ? `${i18n.t("Saving")}...` : i18n.t("Save")}
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
