import React, { Suspense } from "react";
import TabbedContent from "./component/TabbedContent";
import "./Access.css";

export default function AccessConfiguration(): React.ReactElement {
  return (
    <div className="accessConfig">
      <div className="access-config-body">
        <Suspense fallback={<div>Loading...</div>}>
          <TabbedContent />
        </Suspense>
      </div>
    </div>
  );
}
