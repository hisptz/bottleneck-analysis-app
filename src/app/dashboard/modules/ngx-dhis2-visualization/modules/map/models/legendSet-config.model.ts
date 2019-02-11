export interface LegendSet {
  id: string;
  name: string;
  hidden?: boolean;
  legends: Legend[];
}

export interface Legend {
  id: string;
  endValue: number;
  color: string;
  name: string;
  startValue: number;
}
