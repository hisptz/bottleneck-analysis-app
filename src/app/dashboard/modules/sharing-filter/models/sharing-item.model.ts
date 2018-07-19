export interface SharingItem {
  id: string;
  name: string;
  displayName: string;
  access?: string | boolean;
  isExternal?: boolean;
  isPublic?: boolean;
  type?: string;
  sharingFilterId: string;
}
