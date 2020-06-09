export interface MetadataDictionary {
  id: string;
  name: string;
  category: string;
  description: string;
  data: any;
  progress: {
    loading: boolean;
    loadingSucceeded: boolean;
    loadingFailed: boolean;
  };
}
