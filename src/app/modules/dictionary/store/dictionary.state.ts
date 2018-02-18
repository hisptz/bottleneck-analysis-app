export interface DictionaryState {
  id: string;
  name: string;
  description: string;
  progress: {
    loading: boolean;
    loadingSucceeded: boolean;
    loadingFailed: boolean;
    loadingErrorMessage: any;
  };
}
