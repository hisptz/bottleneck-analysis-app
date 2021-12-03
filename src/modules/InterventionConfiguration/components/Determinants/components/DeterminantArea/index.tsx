import i18n from "@dhis2/d2-i18n";
import { Button } from "@dhis2/ui";
import React from "react";
import GroupDeterminantComponent from "./component";
import "./DeterminantArea.css";
import { useSetRecoilState } from "recoil";
import { InterventionDirtySelector } from "../../../../state/data";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";

export default function DeterminantArea(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const setDeterminants = useSetRecoilState(InterventionDirtySelector({ id, path: ["dataSelection", "groups"] }));

  const onClearAll = () => {
    if (window.confirm("Are you sure you want to clear all indicators?")) {
      setDeterminants((prevState: any) => {
        const newGroups = cloneDeep(prevState);
        newGroups.forEach((group: any) => {
          group.items = [];
        });
        return newGroups;
      });
    }
  };

  return (
    <div className="determinant-container">
      <div className="determinant-main">
        <div className="determinant-main-header">
          <h3>{i18n.t("Determinants")}</h3>
          <Button onClick={onClearAll}>{i18n.t("Clear All")}</Button>
        </div>
        <div className={"determinant-selector"}>
          <GroupDeterminantComponent />
        </div>
      </div>
    </div>
  );
}
