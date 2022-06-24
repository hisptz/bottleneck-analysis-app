export interface Error {
  message?: string;
  details?: any;
}

export interface ErrorBoundaryComponentProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

export interface FormError {
  message: string;
}
