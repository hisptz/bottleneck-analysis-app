export interface TableListItem {
  value: string | number;
  style: {
    [styleName: string]: string | number;
  };
  colSpan?: number;
}
