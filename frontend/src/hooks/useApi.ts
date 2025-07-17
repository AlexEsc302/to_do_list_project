import { useState } from 'react';

interface ApiError {
  message: string;
  errorCode?: string;
}

interface UseApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(apiFunction: (...args: any[]) => Promise<T>): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
    } catch (err: any) {
      setError({
        message: err.message || 'An unexpected error occurred',
        errorCode: err.errorCode,
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, error, loading, execute, reset };
}
