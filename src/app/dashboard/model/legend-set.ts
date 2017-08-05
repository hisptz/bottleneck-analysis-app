import {LegendClass} from "./legend-class";
export interface LegendSet {
  id: string;
  name: string;
  description: string;
  hidden: boolean;
  opened: boolean;
  pinned: boolean;
  isEvent:boolean;
  useIcons: boolean;
  opacity: number;
  classes: Array<LegendClass>;
  change: Array<Object>;
}
