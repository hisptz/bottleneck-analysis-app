import i18n from "@dhis2/d2-i18n";
import { isEmpty } from "lodash";
import React from "react";
import { useRecoilValue } from "recoil";
import { DataSet } from "../../interfaces";
import { DictionaryIndicatorSelector } from "../../state";

export default function DataSource({ id }: { id: string }) {
  const dataSets: Array<DataSet> = useRecoilValue(DictionaryIndicatorSelector({ id, path: ["dataSets"] }));

  if (isEmpty(dataSets)) {
    return <div />;
  }

  return (
    <div>
      <h3>{i18n.t("Data sources (Datasets/Programs)")}</h3>
      <p>{i18n.t("Indicator is captured from the following sources,")}</p>
      <h5>{i18n.t("Datasets")}</h5>
      <ul>
        {dataSets.map((dataSet) => {
          return (
            <li key={dataSet?.id}>
              <b>{dataSet?.displayName}</b>{" "}
              {i18n.t("submitting {{variables1}} after every {{variables2}} days", {
                variables1: dataSet?.periodType,
                variables2: dataSet?.timelyDays,
              })}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
