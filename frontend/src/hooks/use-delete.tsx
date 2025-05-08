"use client"

import { env } from "@/environment"
import { useState, useCallback } from "react"

interface UseDeleteResult<T, P> {
    data: T | null
    isLoading: boolean
    error: Error | null
    execute: (payload: P) => Promise<T | null>
    reset: () => void
}

/**
 * Custom hook for making POST requests
 * @param url The URL to which the request is made
 * @param options Fetch request options (optional)
 * @returns An object containing data, loading state, errors, and a function to execute the request
 */
export function useDelete<T = any, P = any>(
    url: string,
    options?: Omit<RequestInit, "method" | "body">,
): UseDeleteResult<T, P> {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    const execute = useCallback(
        async (payload: P): Promise<T | null> => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`${env.VITE_API_URL || ""}/api${url}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        ...(options?.headers || {}),
                    },
                    body: JSON.stringify(payload),
                    ...options,
                })

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`)
                }

                const result = await response.json()
                setData(result)
                return result
            } catch (err) {
                const errorObj = err instanceof Error ? err : new Error(String(err))
                setError(errorObj)
                setData(null)
                return null
            } finally {
                setIsLoading(false)
            }
        },
        [url, options],
    )

    const reset = useCallback(() => {
        setData(null)
        setError(null)
        setIsLoading(false)
    }, [])

    return { data, isLoading, error, execute, reset }
}
