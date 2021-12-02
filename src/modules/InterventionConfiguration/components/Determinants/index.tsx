import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import DeterminantArea from "./components/DeterminantArea";
import IndicatorConfiguration from "./components/IndicatorConfiguration";
import "./Determinant.css";
import { SelectedIndicator } from "../../state/edit";

export default function DeterminantsConfiguration(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const selectedIndicator = useRecoilValue(SelectedIndicator(id));
  return (
    <div className="determinant-main-container">
      <div className="determinant-area-container">
        <DeterminantArea />
      </div>
      <div className="indicator-configuration-container">{selectedIndicator && <IndicatorConfiguration />}</div>
    </div>
  );
}
