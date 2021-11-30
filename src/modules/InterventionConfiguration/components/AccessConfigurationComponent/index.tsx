import React from "react";
import { ACCESS_NONE } from "../../../../constants/constants";
import "./AccessConfigurationComponent.css";
import TabbedContent from "./component/TabbedContent";

export default function AccessConfigurationComponent() {
  return (
    <div className="accessConfig">
      <p>Sharing & Access</p>

      <div className="access-config-body">
        <TabbedContent
          id={""}
          users={[]}
          groups={[]}
          publicAccess={ACCESS_NONE}
          allowPublicAccess={true}
          type={""}
          onAdd={() => {}}
          onChange={() => {}}
          onRemove={() => {}}
        />
      </div>
    </div>
  );
}
