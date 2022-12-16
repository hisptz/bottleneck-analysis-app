import "./card-loader.css";
import { CircularLoader } from "@dhis2/ui";
import React from "react";

export default function CardLoader() {
  return (
    <div className="loader-container">
      <CircularLoader small />
    </div>
  );
}
