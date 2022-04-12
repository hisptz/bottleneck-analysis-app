import { colors } from "@dhis2/ui";
import React from "react";

export default function Title({ title }) {
  return (
    <>
      <h2>{title}</h2>
      <style>
        {`
          h2 {
            font-size: 16px;
            color: ${colors.grey900};
          }
        `}
      </style>
    </>
  );
}
