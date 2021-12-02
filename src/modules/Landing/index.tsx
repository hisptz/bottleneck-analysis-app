import { CircularLoader } from "@dhis2/ui";
import React from "react";
import { useAppInit } from "./hooks";

export default function Landing() {
  useAppInit();

  return (
    <div className="w-100 h-100 column center align-center">
      <CircularLoader />
    </div>
  );
}
