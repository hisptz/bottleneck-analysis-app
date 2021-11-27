import i18n from "@dhis2/d2-i18n";
import { DataTable, DataTableColumnHeader, DataTableRow, TableBody, TableHead } from "@dhis2/ui";
import { isEmpty } from "lodash";
import React from "react";
import { useRecoilValue } from "recoil";
import { DataStateDictionary, DictionaryIndicatorSelector } from "../../state";
import { dataTypes, dataTypesInitials } from "../../utils/models";
import Row from "./row";

export default function DataElementsIndicator({ id }: { id: string }) {
  const numerator = useRecoilValue(DictionaryIndicatorSelector({ id, path: ["numerator"] }));
  const denominator = useRecoilValue(DictionaryIndicatorSelector({ id, path: ["denominator"] }));

  const numeratorDataElements: Array<any> = useRecoilValue(
    DataStateDictionary({
      location: "numerator",
      formula: numerator,
      dataType: dataTypes.DATA_ELEMENT,
      dataFormulaType: dataTypesInitials.DATA_ELEMENT,
    })
  );

  const denominatorDataElements: Array<any> = useRecoilValue(
    DataStateDictionary({
      location: "denominator",
      formula: denominator,
      dataType: dataTypes.DATA_ELEMENT,
      dataFormulaType: dataTypesInitials.DATA_ELEMENT,
    })
  );

  const dataElements = [...numeratorDataElements, ...denominatorDataElements];

  if (isEmpty(dataElements)) {
    return <div />;
  }

  return (
    <div>
      <h3>{i18n.t("Data elements in indicator")} </h3>
      <p> {i18n.t("The following is the summary of the data elements used in calculations:")} </p>

      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader bordered>{i18n.t("Data Element")}</DataTableColumnHeader>
            <DataTableColumnHeader bordered>{i18n.t("Expression part (Numerator/ Denominator)")}</DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t("Value Type")}</DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t("Zero Significance")}</DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t("Categories")}</DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t("Datasets/ Programs")}</DataTableColumnHeader>
            <DataTableColumnHeader>{i18n.t("Groups")}</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>
          {dataElements?.map((dataElement: any) => {
            return <Row key={dataElement?.id} dataElement={dataElement} />;
          })}
        </TableBody>
      </DataTable>
    </div>
  );
}
