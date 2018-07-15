import { DashboardAccess } from './dashboard-access.model';

export interface Dashboard {
  id: string;
  name: string;
  created: string;
  lastUpdated: string;
  description?: string;
  bookmarked: boolean;
  access: DashboardAccess;
}
