export interface Intervention {
  id: string;
  name: string;
  showEditForm?: boolean;
  showDeleteDialog?: boolean;
  deleting?: boolean;
  dashboardItems: any[];
}
