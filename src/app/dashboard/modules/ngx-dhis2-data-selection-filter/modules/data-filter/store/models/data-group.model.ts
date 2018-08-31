export interface DataGroup {
  id: string;
  name: string;
  color: string;
  members: Array<{ id: string; name: string }>;
}
