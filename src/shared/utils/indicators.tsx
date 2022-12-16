import { IconDimensionIndicator16, IconDimensionProgramIndicator16 } from "@dhis2/ui";
import React from "react";

export function getIcon(dataType: string) {
  switch (dataType) {
    case "INDICATOR":
      return <IconDimensionIndicator16 />;

    case "PROGRAM_INDICATOR":
      return <IconDimensionProgramIndicator16 />;
  }
}
