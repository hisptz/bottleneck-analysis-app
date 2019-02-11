export interface LegendSet {
  id: string;
  name: string;
  dimensionItemId: string;
  visualizationLayerId: string;
  legendSetType?: string;
  legends: Legend[];
}

export interface Legend {
  id: string;
  endValue: any;
  color: string;
  pattern?: string;
  name: string;
  startValue: any;
}
