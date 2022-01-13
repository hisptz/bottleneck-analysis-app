import i18n from "@dhis2/d2-i18n";
import { Button, CheckboxField, colors } from "@dhis2/ui";
import { cloneDeep, every, isEmpty } from "lodash";
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
  const { setValue, getValues, watch, register, formState } = useFormContext();
  const [useShortName, setUseShortName] = useRecoilState(UseShortName(interventionId));
  const determinants = watch("groups");
  const allEmpty: boolean = allDeterminantsEmpty(determinants);

  const onClearAll = useCallback(() => {
    if (window.confirm(i18n.t("Are you sure you want to clear all indicators?"))) {
      const determinants = getValues("groups");
      const newGroups = cloneDeep(determinants);
      newGroups.forEach((group: any) => {
        group.items = [];
      });
      setValue("groups", newGroups);
    }
  }, [getValues, setValue]);

  const setShortNameAsLabels = useCallback(() => {
    const determinants = getValues("groups");
    const newGroups = cloneDeep(determinants);
    newGroups.forEach((group: any) => {
      group.items.forEach((item: DataItem) => {
        item.label = item?.shortName ?? item?.name;
      });
    });
    setValue("groups", newGroups);
  }, [getValues, setValue]);
  const onUseShortNameChange = useCallback(
    ({ checked }: { checked: boolean }) => {
      if (checked) {
        if (window.confirm(i18n.t("This will replace all indicator labels with their short names. Proceed?"))) {
          setUseShortName(true);
          setShortNameAsLabels();
        }
      } else {
        setUseShortName(false);
      }
    },
    [setShortNameAsLabels, setUseShortName]
  );

  const { name: groupFormName } = register("groups", {
    validate: (value) => {
      return every(value, ({ items }) => !isEmpty(items)) || i18n.t("Please select at least one indicator per each determinant");
    },
  });

  const hasError = formState?.errors[groupFormName];
  const errorMessage = hasError?.message;

  return (
    <div className="determinant-container">
      <div style={hasError && { border: `1px solid ${colors.red500}` }} className="determinant-main">
        <div className="determinant-main-header">
          <h3>{i18n.t("Determinants")}</h3>
          <Button className={"determinant-clear-all-config"} dataTest={"clear-determinant-button"} disabled={allEmpty} onClick={onClearAll}>
            {i18n.t("Clear All")}
          </Button>
        </div>
        <div style={{ padding: "8px 16px" }}>
          <CheckboxField disabled={allEmpty} checked={useShortName} onChange={onUseShortNameChange} label={i18n.t("Use short names as labels")} />
        </div>
        <div className={"determinant-selector"}>
          <GroupDeterminantComponent />
        </div>
      </div>
      {hasError && <p style={{ color: `${colors.red500}`, margin: "4px 0" }}>{errorMessage}</p>}
    </div>
  );
}
