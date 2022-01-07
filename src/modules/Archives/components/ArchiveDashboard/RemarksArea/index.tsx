import i18n from "@dhis2/d2-i18n";
import React from "react";
import { useFullScreenHandle } from "react-full-screen";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import InterventionCard from "../../../../Intervention/components/Card";
import { Archive } from "../../../state/data";

export default function RemarksArea(): React.ReactElement {
  const fullScreenHandle = useFullScreenHandle();
  const { id } = useParams<{ id: string }>();
  const { remarks } = useRecoilValue(Archive(id));
  return (
    <InterventionCard
      fullScreenHandle={fullScreenHandle}
      title={
        <div className="p-8">
          <b>{i18n.t("Archive Description")}</b>
        </div>
      }>
      <div className="p-8 w-100">
        <span style={{ width: "100%", textAlign: "justify" }}>{remarks ?? i18n.t("No description provided")}</span>
      </div>
    </InterventionCard>
  );
}
