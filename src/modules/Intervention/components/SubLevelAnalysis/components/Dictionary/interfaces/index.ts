export interface IndicatorType {
  id: string;
  displayName: string;
}

export interface Legend {
  id: string;
  displayName: string;
  startValue: string;
  endValue: string;
  color: string;
}

export interface LegendSet {
  id: string;
  name: string;
  legends: Legend[];
}

export interface LegendAnalysis {
  id: string;
  displayName: string;
  legendSets: Array<LegendSet>;
}

export interface IndicatorGroup {
  id: string;
  displayName: string;
  indicators?: Array<Indicator>;
}

export interface Indicator {
  id: string;
  name: string;
  displayDescription: string;
  href: string;
  numeratorDescription: string;
  denominatorDescription: string;
  indicatorType: IndicatorType;
}

export interface DataSet {
  id: string;
  displayName: string;
  periodType: string;
  timelyDays: string;
}

export interface DataSource {
  dataSets: Array<DataSet>;
}
