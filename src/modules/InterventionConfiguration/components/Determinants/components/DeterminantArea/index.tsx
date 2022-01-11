import i18n from "@dhis2/d2-i18n";
import { Button, CheckboxField } from "@dhis2/ui";
import { cloneDeep, isEmpty, reduce } from "lodash";
import React, { useCallback } from "react";
import "./DeterminantArea.css";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DataItem } from "../../../../../../shared/interfaces/interventionConfig";
import { UseShortName } from "../../../../state/edit";
import GroupDeterminantComponent from "./component/Determinants";

export default function DeterminantArea(): React.ReactElement {
  const { id: interventionId } = useParams<{ id: string }>();
  const { setValue, getValues, watch } = useFormContext();
  const [useShortName, setUseShortName] = useRecoilState(UseShortName(interventionId));
  const determinants = watch("groups");
  const allDeterminantsEmpty: boolean = reduce(determinants, (acc, determinant) => acc && isEmpty(determinant?.items), true as boolean);

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

  return (
    <div className="determinant-container">
      <div className="determinant-main">
        <div className="determinant-main-header">
          <h3>{i18n.t("Determinants")}</h3>
          <Button className={"determinant-clear-all-config"} dataTest={"clear-determinant-button"} disabled={allDeterminantsEmpty} onClick={onClearAll}>
            {i18n.t("Clear All")}
          </Button>
        </div>
        <div style={{ padding: "8px 16px" }}>
          <CheckboxField disabled={allDeterminantsEmpty} checked={useShortName} onChange={onUseShortNameChange} label={i18n.t("Use short names as labels")} />
        </div>
        <div className={"determinant-selector"}>
          <GroupDeterminantComponent />
        </div>
      </div>
    </div>
  );
}
