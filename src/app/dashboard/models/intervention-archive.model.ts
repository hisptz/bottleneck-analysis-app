import { Intervention } from './intervention.model';

export interface InterventionArchive {
  id: string;
  intervention: Intervention;
  favorites: any[];
  analysticsList: any[];
}
