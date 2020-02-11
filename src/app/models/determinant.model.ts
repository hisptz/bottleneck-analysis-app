export interface Determinant {
  id: string;
  name: string;
  sortOrder: number;
  color: string;
  members: Array<{ id: string; name: string }>;
}
