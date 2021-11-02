import "./full-page-loader.css";
import { CircularLoader } from "@dhis2/ui";
import React from "react";

export default function FullPageLoader() {
  return (
    <div className="loader-container">
      <CircularLoader />
    </div>
  );
}
