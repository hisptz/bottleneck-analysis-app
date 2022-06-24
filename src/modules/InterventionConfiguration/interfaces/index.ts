import React from "react";

export interface ConfigStep {
  label: string;
  component: React.ReactNode | any;
  helpSteps: Array<string | React.ReactNode>;
  validationKeys?: Array<string>;
}
