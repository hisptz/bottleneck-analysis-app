import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Button, ButtonStrip, Modal, ModalContent, ModalTitle, SingleSelectField, SingleSelectOption, TextAreaField } from "@dhis2/ui";
import { cloneDeep, find, get, isEmpty, map, reverse } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { CurrentInterventionSummary } from "../../../../../../../core/state/intervention";
import { InterventionSummary } from "../../../../../../../shared/interfaces/interventionConfig";
import { uid } from "../../../../../../../shared/utils/generators";
import { InterventionStateSelector } from "../../../../../state/intervention";
import { InterventionOrgUnitState, InterventionPeriodState } from "../../../../../state/selections";
import { RootCauseDataInterface } from "../../../interfaces/rootCauseData";
import { uploadRootCauseData } from "../../../services/data";
import { RootCauseConfig } from "../../../state/config";
import { RootCauseData } from "../../../state/data";
import { addRootCause, updateRootCause } from "../services/data";

type RootCauseFormCProps = {
  onCancelForm?: any;
  hideModal: boolean;
  rootCauseData?: any;
};

export default function RootCauseForm({ hideModal, onCancelForm, rootCauseData }: RootCauseFormCProps): React.ReactElement {
  const { id: interventionId } = useParams<{ id: string }>();
  const engine = useDataEngine();
  const { dataElements } = useRecoilValue(RootCauseConfig);
  const [saving, setSaving] = useState(false);
  const [rootCauseInterventionData, updateRootCauseData] = useRecoilState(RootCauseData(interventionId));
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: rootCauseData,
  });
  const { show } = useAlert(
    ({ message }) => message,
    ({ type }) => ({ ...type, duration: 3000 })
  );

  const getDataElementId = useCallback(
    (name: string) => {
      return find(dataElements, (dataElement) => dataElement.name.replace(/\s+/g, "").toLowerCase() === name.replace(/\s+/g, "").toLowerCase())?.id || "";
    },
    [dataElements]
  );

  const intervention: InterventionSummary | undefined = useRecoilValue(CurrentInterventionSummary(interventionId));
  const interventionName = intervention?.name || "";

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
    indicators: map(group?.items, (item) => ({ label: item.name, id: item.id })),
  }));

  const bottleneckOptions = map(bottleneckMetadata, (bottleneck) => ({ label: bottleneck?.name, id: bottleneck?.id }));
  const selectedBottleneck = watch(getDataElementId("bottleneckId"));
  const interventionOptions = find(bottleneckMetadata, (item: any) => item?.id === selectedBottleneck)?.indicators ?? [];

  useEffect(() => {
    setValue(getDataElementId("indicatorId"), undefined);
  }, [getDataElementId, selectedBottleneck, setValue]);

  async function saveRootCause(dataValues: any) {
    setSaving(true);
    try {
      const indicator = find(interventionOptions, ["id", get(dataValues, [getDataElementId("indicatorId")])])?.label;
      const data: RootCauseDataInterface = {
        id: rootCauseData && rootCauseData.id ? rootCauseData.id : `${periodId}_${orgUnitId}_${uid()}`,
        isOrphaned: false,
        isTrusted: true,
        configurationId: "rcaconfig",
        dataValues: {
          ...dataValues,
          ...rootCauseHiddenFields,
          [getDataElementId("bottleneck")]: find(bottleneckOptions, ["id", selectedBottleneck])?.label,
          [getDataElementId("indicator")]: indicator,
        },
      };

      let updatedData = cloneDeep(rootCauseInterventionData);
      if (!isEmpty(rootCauseData)) {
        updatedData = updateRootCause(data, updatedData);
      }
      updatedData = addRootCause(data, updatedData);
      await uploadRootCauseData(engine, interventionId, reverse(updatedData));
      updateRootCauseData(reverse(updatedData));
      if (!isEmpty(rootCauseData)) {
        show({
          message: i18n.t("Root cause data updated successfully"),
          type: { success: true },
        });
      } else {
        show({
          message: i18n.t("Root cause data saved successfully"),
          type: { success: true },
        });
      }
      onCancelForm();
    } catch (e: any) {
      show({
        message: `${i18n.t("Error saving root cause data")}: ${e?.message ?? ""}`,
        type: { info: true },
      });
    }
    setSaving(false);
  }

  return (
    <Modal onClose={onCancelForm} className={"root-cause-form"} large hide={!hideModal} position="middle">
      <ModalTitle>{i18n.t("Add Root Cause")}</ModalTitle>
      <ModalContent>
        <form onSubmit={handleSubmit(saveRootCause)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="column gap p-8">
            <Controller
              rules={{ required: i18n.t("Bottleneck is required") }}
              control={control}
              name={getDataElementId("bottleneckId")}
              render={({ field, fieldState }) => (
                <SingleSelectField
                  label={i18n.t("Bottleneck")}
                  error={fieldState.error}
                  validationText={fieldState?.error?.message}
                  onChange={({ selected }: any) => field.onChange(selected)}
                  name={field.name}
                  selected={!isEmpty(bottleneckOptions) ? field.value : undefined}>
                  {bottleneckOptions?.map((option) => (
                    <SingleSelectOption key={`${option.id}-option`} label={option?.label} value={option?.id} />
                  ))}
                </SingleSelectField>
              )}
            />
            <Controller
              rules={{ required: i18n.t("Indicator is required") }}
              control={control}
              name={getDataElementId("indicatorId")}
              render={({ field, fieldState }) => (
                <SingleSelectField
                  label={i18n.t("Indicator")}
                  error={fieldState.error}
                  validationText={fieldState?.error?.message}
                  name={field.name}
                  onChange={({ selected }: any) => field.onChange(selected)}
                  selected={!isEmpty(interventionOptions) && find(interventionOptions, ["id", field.value]) ? field.value : undefined}>
                  {interventionOptions?.map((option: any) => (
                    <SingleSelectOption key={`${option.id}-option`} label={option?.label} value={option?.id} />
                  ))}
                </SingleSelectField>
              )}
            />
            <Controller
              control={control}
              rules={{ required: i18n.t("Possible root cause is required") }}
              name={getDataElementId("Root cause")}
              render={({ field, fieldState }) => (
                <TextAreaField
                  label={i18n.t("Possible root cause")}
                  error={fieldState.error}
                  validationText={fieldState?.error?.message}
                  name={field.name}
                  value={field.value}
                  onChange={({ value }: any) => field.onChange(value)}
                />
              )}
            />
            <Controller
              control={control}
              rules={{ required: i18n.t("Possible solution is required") }}
              name={getDataElementId("Solution")}
              render={({ field, fieldState }) => (
                <TextAreaField
                  required
                  label={i18n.t("Possible solution")}
                  error={fieldState.error}
                  validationText={fieldState?.error?.message}
                  name={field.name}
                  value={field.value}
                  onChange={({ value }: any) => field.onChange(value)}
                />
              )}
            />
            <ButtonStrip end>
              <Button disabled={saving} secondary onClick={onCancelForm}>
                {i18n.t("Cancel")}
              </Button>
              <Button disabled={saving} loading={saving} primary type="submit">
                {saving ? `${i18n.t("Saving")}...` : i18n.t("Save")}
              </Button>
            </ButtonStrip>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
