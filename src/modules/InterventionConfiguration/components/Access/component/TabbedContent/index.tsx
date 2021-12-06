import { CircularLoader } from "@dhis2/ui";
import React, { Suspense } from "react";
import AccessAdd from "../Access-Add";
import AccessList from "../AccessList";

export default function TabbedContent(): React.ReactElement {
  return (
    <div>
      <AccessAdd />
      <Suspense
        fallback={
          <div style={{ minHeight: 300 }} className="column center align-items-center">
            <CircularLoader small />
          </div>
        }
      >
        <AccessList />
      </Suspense>
    </div>
  );
}
