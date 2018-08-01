import { AnalyticsHeader } from './analytics-header.model';
import { AnalyticsMetadata } from './analytics-metadata.model';
export interface AnalyticsObject {
  headers: Array<AnalyticsHeader>;
  metaData: AnalyticsMetadata;
  rows: any[];
}
