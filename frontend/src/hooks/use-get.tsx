import { env } from '@/environment';
import { useState, useEffect } from 'react';

interface UseGetResult<T> {
    data: T | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

/**
 * Custom hook to perform GET requests
 * @param url The URL to make the request to
 * @param options Fetch request options (optional)
 * @returns An object containing data, loading state, errors, and a function to retry the request
 */
export function useGet<T = any>(url: string, options?: RequestInit): UseGetResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [refreshIndex, setRefreshIndex] = useState<number>(0);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const fetchData = async () => {
            try {
                const response = await fetch(`${env.VITE_API_URL || ""}/api${url}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(options?.headers || {})
                    },
                    ...options
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const result = await response.json();

                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error(String(err)));
                    setData(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, refreshIndex, options]);

    const refetch = () => {
        setRefreshIndex(prev => prev + 1);
    };

    return { data, isLoading, error, refetch };
}
