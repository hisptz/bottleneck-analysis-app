export interface LegendSet {
  id: string;
  name: string;
  legends: Legend[];
}

export interface Legend {
  id: string;
  endValue: number;
  color: string;
  name: string;
  startValue: number;
}
