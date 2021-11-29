import { SharingDialog } from "@dhis2/ui";
import React from "react";
import "./Access.css";
import classes from "./AccessConfiguration.module.css";

export default function AccessConfiguration() {
  return (
    <div className="accessConfig">
      <p>Sharing & Access</p>
      <div className="access-config-body">
        <SharingDialog className={classes["root"]} id="sharing-test" onClose={() => {}} />
      </div>
    </div>
  );
}
