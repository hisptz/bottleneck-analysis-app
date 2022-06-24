import i18n from "@dhis2/d2-i18n";
import { DataTable, DataTableColumnHeader, DataTableRow, TableBody, TableHead } from "@dhis2/ui";
import { isEmpty } from "lodash";
import React from "react";
import { useRecoilValue } from "recoil";
import { IndicatorGroup } from "../../interfaces";
import { DictionaryIndicatorSelector } from "../../state";
import IndicatorGroupRow from "./indicatorGroupRow";

export default function IndicatorFacts({ id }: { id: string }) {
  const indicatorGroups: Array<IndicatorGroup> = useRecoilValue<Array<IndicatorGroup>>(
    DictionaryIndicatorSelector({
      id,
      path: ["indicatorGroups"],
    })
  );

  if (isEmpty(indicatorGroups)) {
    return <div />;
  }

  let count = 0;
  return (
    <div>
      <h3>{i18n.t("Indicator facts")}</h3>

      <p>{i18n.t("Belongs to the following groups of indicators")}</p>

      <div>
        <DataTable>
          <TableHead>
            <DataTableRow>
              <DataTableColumnHeader>#</DataTableColumnHeader>
              <DataTableColumnHeader>{i18n.t("Name")}</DataTableColumnHeader>
              <DataTableColumnHeader>{i18n.t("Code")}</DataTableColumnHeader>
              <DataTableColumnHeader>{i18n.t("Indicators")}</DataTableColumnHeader>
            </DataTableRow>
          </TableHead>
          <TableBody>
            {indicatorGroups?.map((group) => {
              count++;
              return <IndicatorGroupRow key={group?.id} no={count} name={group?.displayName} code={group?.id} indicators={group?.indicators} />;
            })}
          </TableBody>
        </DataTable>
      </div>
    </div>
  );
}
