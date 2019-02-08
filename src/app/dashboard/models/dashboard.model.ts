import { DashboardAccess } from './dashboard-access.model';
import { User } from '../../models';

export interface Dashboard {
  id: string;
  name: string;
  created?: string;
  lastUpdated?: string;
  description?: string;
  bookmarked?: boolean;
  bookmarkPending?: boolean;
  supportBookmark?: boolean;
  access?: DashboardAccess;
  addingItem?: boolean;
  hasNewUnsavedFavorite?: boolean;
  creating?: boolean;
  updating?: boolean;
  showDeleteDialog?: boolean;
  deleting?: boolean;
  saving?: boolean;
  updatedOrCreated?: boolean;
  error?: any;
  namespace?: string;
  unSaved?: boolean;
  globalSelections?: any[];
  publicAccess: string;
  externalAccess: boolean;
  userGroupAccesses: any[];
  dashboardItems?: any[];
  userAccesses: any[];
  user: {
    id: string;
    name: string;
  };
}
