import i18n from "@dhis2/d2-i18n";
import { isEmpty } from "lodash";
import React from "react";
import { useRecoilValue } from "recoil";
import { LegendSet } from "../../interfaces";
import { DictionaryIndicatorSelector } from "../../state";
import Legend from "./legend";

export default function LegendsAnalysis({ id }: { id: string }) {
  const legendSets = useRecoilValue<Array<LegendSet>>(DictionaryIndicatorSelector({ id, path: ["legendSets"] }));

  if (isEmpty(legendSets)) {
    return <div />;
  }

  return (
    <div>
      <h3>{i18n.t("Legends for analysis")}</h3>
      <p>
        {i18n.t("Uses {{variables}} legends for for analysis, spread across multiple cut-off points of interest, existing legends are:", {
          variables: legendSets ? legendSets.length : "",
        })}{" "}
      </p>
      <ul>
        {legendSets?.map((legendSet) => {
          return <Legend key={legendSet?.id} legendSet={legendSet} />;
        })}
      </ul>
    </div>
  );
}
