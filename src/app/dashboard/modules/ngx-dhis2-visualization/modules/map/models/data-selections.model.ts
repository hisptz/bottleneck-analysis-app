export interface DataSelections {
  config?: any;
  parentLevel?: number;
  completedOnly?: boolean;
  translations?: any[];
  interpretations?: any[];
  attributeValues?: any[];
  program?: {
    id: string;
    name?: string;
    displayName?: string;
  };
  programStage?: {
    id: string;
    name?: string;
    displayName?: string;
  };
  legendSet?: any;
  columns: Dimension[];
  filters: Dimension[];
  rows: Dimension[];
  endDate?: string;
  startDate?: string;
  aggregationType: string;
  organisationUnitGroupSet?: {
    id: string;
  };
}

export interface Dimension {
  dimension?: string;
  filters?: string;
  items?: DimensionItem[];
}

export interface DimensionItem {
  id: string;
  name?: string;
  dimensionItemType?: string;
  dimensionItem?: string;
}
