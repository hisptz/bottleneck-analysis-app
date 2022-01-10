import i18n from "@dhis2/d2-i18n";
import { Button, CheckboxField } from "@dhis2/ui";
import { cloneDeep, isEmpty, reduce } from "lodash";
import React, { useCallback, useEffect } from "react";
import "./DeterminantArea.css";
import { useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { UseShortName } from "../../../../state/edit";
import GroupDeterminantComponent from "./component/Determinants";

export default function DeterminantArea(): React.ReactElement {
  const { id: interventionId } = useParams<{ id: string }>();
  const { setValue, getValues, watch } = useFormContext();
  const [useShortName, setUseShortName] = useRecoilState(UseShortName(interventionId));
  const determinants = watch("groups");
  const allDeterminantsEmpty: boolean = reduce(determinants, (acc, determinant) => acc && isEmpty(determinant?.items), true as boolean);

  const onClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all indicators?")) {
      const determinants = getValues("groups");
      const newGroups = cloneDeep(determinants);
      newGroups.forEach((group: any) => {
        group.items = [];
      });
      setValue("groups", newGroups);
    }
  }, [getValues, setValue]);

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
          <CheckboxField
            disabled={allDeterminantsEmpty}
            checked={useShortName}
            onChange={({ checked }: { checked: boolean }) => setUseShortName(checked)}
            label={i18n.t("Use short names as labels")}
          />
        </div>
        <div className={"determinant-selector"}>
          <GroupDeterminantComponent />
        </div>
      </div>
    </div>
  );
}
