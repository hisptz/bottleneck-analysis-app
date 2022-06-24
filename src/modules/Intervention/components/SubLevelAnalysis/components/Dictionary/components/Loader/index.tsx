import { CenteredContent, CircularLoader } from "@dhis2/ui";
import React from "react";

export default function Loader() {
  return (
    <CenteredContent>
      <CircularLoader small />
    </CenteredContent>
  );
}
