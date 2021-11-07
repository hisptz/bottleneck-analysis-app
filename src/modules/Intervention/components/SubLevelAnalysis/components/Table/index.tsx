import { DataTable } from "@dhis2/ui";
import React, { Suspense } from "react";
import CardLoader from "../../../../../../shared/components/loaders/CardLoader";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import classes from "./Table.module.css";

export default function Table() {
  return (
    <Suspense fallback={<CardLoader />}>
      <DataTable width={"100%"} scrollWidth={"100%"} scrollHeight={"500px"} className={classes["table"]} bordered>
        <TableHeader />
        <TableBody />
      </DataTable>
    </Suspense>
  );
}
