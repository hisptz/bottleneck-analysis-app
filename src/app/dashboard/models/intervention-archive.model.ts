import { Intervention } from './intervention.model';
import { Dashboard } from './dashboard.model';

export interface InterventionArchive {
  id: string;
  intervention: Dashboard;
  favorites: any[];
  analysticsList: any[];
}
