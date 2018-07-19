import { SharingItem } from './sharing-item.model';

export interface SharingFilter {
  id: string;
  type: string;
  user: any;
  loading?: boolean;
  updating?: boolean;
  loaded?: boolean;
  hasError?: boolean;
  error?: any;
}
