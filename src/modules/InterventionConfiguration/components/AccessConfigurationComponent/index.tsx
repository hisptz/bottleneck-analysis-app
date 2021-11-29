import { SharingDialog } from "@dhis2/ui";
import React from "react";
import "./AccessConfigurationComponent.css";
import classes from "./AccessConfigurationComponent.module.css";

// export default function AccessConfigurationComponent() {
//   return (
//     <div className="accessConfig">
//       <p>Sharing & Access</p>

//       <div className="access-config-body">
//         <SharingDialog className={classes["root"]} id="sharing-test" onClose={() => {}} />
//       </div>
//     </div>
//   );
// }
export default function AccessConfigurationComponent() {
  return (
    <div className="accessConfig">
      <p>Sharing & Access</p>

      <div className="access-config-body">
        <h5>Access config body</h5>
      </div>
    </div>
  );
}
