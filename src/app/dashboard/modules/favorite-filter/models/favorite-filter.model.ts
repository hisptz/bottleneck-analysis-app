export interface FavoriteFilter {
  id: string;
  name: string;
  type: string;
  user: { id: string; name: string };
}
