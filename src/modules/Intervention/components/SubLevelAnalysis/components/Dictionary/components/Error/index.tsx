import { CenteredContent, IconError24 } from "@dhis2/ui";
import React from "react";

export default function Error({ error }: { error: { message?: string; details?: any } }) {
  return (
    <CenteredContent>
      <IconError24 />
      <p>{error.message ?? error.details}</p>
    </CenteredContent>
  );
}
