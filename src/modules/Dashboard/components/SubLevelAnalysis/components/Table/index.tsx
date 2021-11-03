import { DataTable } from "@dhis2/ui";
import React from "react";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import classes from "./Table.module.css";

export default function Table() {
  return (
    <DataTable width={"100%"} scrollWidth={"100%"} scrollHeight={"500px"} className={classes["table"]} bordered>
      <TableHeader />
      <TableBody />
    </DataTable>
  );
}
