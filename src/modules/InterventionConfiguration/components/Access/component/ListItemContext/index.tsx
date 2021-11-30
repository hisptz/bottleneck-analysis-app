import { colors } from "@dhis2/ui";
import React from "react";
import { ACCESS_NONE, ACCESS_VIEW_ONLY, ACCESS_VIEW_AND_EDIT } from "../../../../../../constants/constants";

export default function ListItemContext({ access }) {
  let message;

  switch (access) {
    case ACCESS_NONE:
      message = "No access";
      break;
    case ACCESS_VIEW_ONLY:
      message = "Can view";
      break;
    case ACCESS_VIEW_AND_EDIT:
      message = "Can view and edit";
      break;
    default:
      message = "";
  }

  return (
    <p>
      {message}
      <style>{`
        p {
          font-size: 14px;
          color: ${colors.grey700};
          margin: 6px 0 0 0;
          padding: 0;
        }
      `}</style>
    </p>
  );
}
