export interface Determinant {
  id: string;
  name: string;
  code?: string;
  sortOrder: number;
  color: string;
  members: Array<{ id: string; name: string }>;
}
