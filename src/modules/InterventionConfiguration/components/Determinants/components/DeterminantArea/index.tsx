import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import { cloneDeep, isEmpty, reduce } from "lodash";
import React from "react";
import "./DeterminantArea.css";
import { useParams } from "react-router-dom";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { InterventionDirtySelector } from "../../../../state/data";
import { SelectedDeterminantId, SelectedIndicatorId } from "../../../../state/edit";
import GroupDeterminantComponent from "./component";

export default function DeterminantArea(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const determinants = useRecoilValue(InterventionDirtySelector({ id, path: ["dataSelection", "groups"] }));
  const allDeterminantsEmpty: boolean = reduce(determinants, (acc, determinant) => acc && isEmpty(determinant.items), true as boolean);
  const onClearAll = useRecoilCallback(
    ({ set, reset }) =>
      () => {
        if (window.confirm("Are you sure you want to clear all indicators?")) {
          set(InterventionDirtySelector({ id, path: ["dataSelection", "groups"] }), (prevState: any) => {
            const newGroups = cloneDeep(prevState);
            newGroups.forEach((group: any) => {
              group.items = [];
            });
            return newGroups;
          });
          reset(SelectedIndicatorId(id));
          reset(SelectedDeterminantId(id));
        }
      },
    [id]
  );

  return (
    <div className="determinant-container">
      <div className="determinant-main">
        <div className="determinant-main-header">
          <h3>{i18n.t("Determinants")}</h3>
          <Button dataTest={"clear-determinant-button"} disabled={allDeterminantsEmpty} onClick={onClearAll}>
            {i18n.t("Clear All")}
          </Button>
        </div>
        <div className={"determinant-selector"}>
          <GroupDeterminantComponent />
        </div>
      </div>
    </div>
  );
}
