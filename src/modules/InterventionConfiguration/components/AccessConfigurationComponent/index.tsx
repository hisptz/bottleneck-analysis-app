import React from "react";
import "./AccessConfigurationComponent.css";
import classes from "./AccessConfigurationComponent.module.css";
import TabbedContent from "./component/TabbedContent";

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
      <div>
        <p>Sharing & Access</p>
      </div>

      <div className="access-config-body">
        <TabbedContent />
      </div>
    </div>
  );
}
