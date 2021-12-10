import { InterventionConfig } from "./interventionConfig";

export interface Archive {
  id: string;
  remarks: string;
  user: string;
  config: InterventionConfig;
  chartData: any;
  subLevelData: any;
  rootCauseData: any;
  dateCreated: string;
  orgUnit: string;
  period: string;
}
