import { DashboardAccess } from './dashboard-access.model';
import { Legend } from 'src/app/models/legend.model';
import { VisualizationDataSelection } from '../modules/ngx-dhis2-visualization/models';

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
  hasError?: boolean;
  namespace?: string;
  unSaved?: boolean;
  globalSelections?: VisualizationDataSelection[];
  publicAccess: string;
  externalAccess: boolean;
  userGroupAccesses: any[];
  dashboardItems?: any[];
  userAccesses: any[];
  bottleneckPeriodType: string;
  user: {
    id: string;
    name: string;
  };
}
