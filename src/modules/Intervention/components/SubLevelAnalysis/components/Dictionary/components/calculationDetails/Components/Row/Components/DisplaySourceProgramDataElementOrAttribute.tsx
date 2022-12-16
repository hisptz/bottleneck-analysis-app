import i18n from "@dhis2/d2-i18n";
import React from "react";

export default function DisplaySourceProgramDataElementOrAttribute({ data }: { data: Array<any> }): React.ReactElement {
  return (
    <>
      <ul>
        {data.map((el) => {
          return (
            <li key={el.id}>
              <b>{el?.val} </b> {i18n.t("source:")} {el?.sources}
            </li>
          );
        })}
      </ul>
    </>
  );
}
