export interface FavoriteFilter {
  id: string;
  name: string;
  type: string;
  icon?: string;
  headerName?: string;
  user: { id: string; name: string };
}
