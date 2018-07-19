import { SharingFilter } from './sharing-filter.model';
import { SharingItem } from './sharing-item.model';

// TODO Find best way to extends interfaces
export interface SharingFilterVm {
  id: string;
  type: string;
  user: any;
  loading?: boolean;
  updating?: boolean;
  loaded?: boolean;
  hasError?: boolean;
  error?: any;
  sharingItems: SharingItem[];
}
