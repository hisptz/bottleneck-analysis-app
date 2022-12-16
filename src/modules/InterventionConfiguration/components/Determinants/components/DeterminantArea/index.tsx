import i18n from "@dhis2/d2-i18n";
import { Button, CheckboxField, colors } from "@dhis2/ui";
import { useConfirmDialog } from "@hisptz/react-ui";
import { cloneDeep, get } from "lodash";
import React, { useCallback } from "react";
import "./DeterminantArea.css";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DataItem } from "../../../../../../shared/interfaces/interventionConfig";
import { allDeterminantsEmpty } from "../../../../../../shared/utils/determinants";
import { UseShortName } from "../../../../state/edit";
import GroupDeterminantComponent from "./component/Determinants";

export default function DeterminantArea(): React.ReactElement {
  const { id: interventionId } = useParams<{ id: string }>();
  const { setValue, getValues, watch, formState } = useFormContext();
  const [useShortName, setUseShortName] = useRecoilState(UseShortName(interventionId));
  const determinants = watch("dataSelection.groups");
  const allEmpty: boolean = allDeterminantsEmpty(determinants);
  const { confirm } = useConfirmDialog();

  const groupFormName = "dataSelection.groups";

  const onClearAll = useCallback(() => {
    confirm({
      title: i18n.t("Confirm clear all"),
      message: i18n.t("Are you sure you want to clear all indicators?"),
      onCancel: () => {
        return;
      },
      onConfirm: () => {
        const determinants = getValues("dataSelection.groups");
        const newGroups = cloneDeep(determinants);
        newGroups.forEach((group: any) => {
          group.items = [];
        });
        setValue("dataSelection.groups", newGroups);
      }
    });
  }, [confirm, getValues, setValue]);

  const setShortNameAsLabels = useCallback(() => {
    const determinants = getValues("dataSelection.groups");
    const newGroups = cloneDeep(determinants);
    newGroups.forEach((group: any) => {
      group.items.forEach((item: DataItem) => {
        item.label = item?.shortName ?? item?.name;
      });
    });
    setValue("dataSelection.groups", newGroups);
  }, [getValues, setValue]);
  const onUseShortNameChange = useCallback(
    ({ checked }: { checked: boolean }) => {
      if (checked) {
        confirm({
          title: i18n.t("Confirm Label Replacement"),
          message: i18n.t("This will replace all indicator labels with their short names. All label changes will be lost. Proceed?"),
          onCancel: () => {
            return;
          },
          onConfirm: () => {
            setShortNameAsLabels();
            setUseShortName(true);
          },
          confirmButtonColor: "primary"
        });
      } else {
        setUseShortName(false);
      }
    },
    [confirm, setShortNameAsLabels, setUseShortName]
  );


  const hasError = get(formState?.errors, groupFormName);
  const errorMessage = hasError?.message;

  return (
    <div className="determinant-container">
      <div style={hasError && { border: `1px solid ${colors.red500}` }} className="determinant-main">
        <div className="determinant-main-header">
          <h3>{i18n.t("Determinants")}</h3>
          <Button className={"determinant-clear-all-config"} dataTest={"clear-determinant-button"} disabled={allEmpty} onClick={onClearAll}>
            {i18n.t("Clear all")}
          </Button>
        </div>
        <div style={{ padding: "8px 16px" }}>
          <CheckboxField disabled={allEmpty} checked={useShortName} onChange={onUseShortNameChange}
                         label={i18n.t("Use short names as labels")} />
        </div>
        <div className={"determinant-selector"}>
          <GroupDeterminantComponent />
        </div>
      </div>
      {hasError && <p style={{ color: `${colors.red500}`, margin: "4px 0" }}>{errorMessage}</p>}
    </div>
  );
}
