import { CircularLoader } from "@dhis2/ui";
import React from "react";
import { useAppInit } from "./hooks";
import { useAutoMigration } from "./hooks/auto-migration";

export default function Landing(): React.ReactElement {
  useAppInit();
  useAutoMigration();

  return (
    <div className="w-100 h-100 column center align-center">
      <CircularLoader />
    </div>
  );
}
