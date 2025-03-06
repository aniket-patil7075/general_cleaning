"use client"

import { useState, useCallback } from "react"
import axios, { type AxiosRequestConfig, type AxiosError } from "axios"
import { API_ENDPOINTS, type ApiEndpoint } from "./config"

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (params?: Record<string, any>, body?: any) => Promise<T>
}

export function useApi<T>(endpointKey: keyof typeof API_ENDPOINTS): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (params?: Record<string, any>, body?: any): Promise<T> => {
      const endpoint: ApiEndpoint = API_ENDPOINTS[endpointKey]
      setLoading(true)
      setError(null)

      try {
        console.log(`Executing API call to ${endpointKey}:`, { params, body })
        const config: AxiosRequestConfig = {
          url: endpoint.url,
          method: endpoint.method,
          params: params,
          data: body,
        }

        const response = await axios(config)
        console.log(`API response from ${endpointKey}:`, response.data)
        setData(response.data)
        return response.data
      } catch (err) {
        console.error(`API error in ${endpointKey}:`, err)
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError<T>
          if (axiosError.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error response:", axiosError.response.data)
            setData(axiosError.response.data)
            return axiosError.response.data
          } else if (axiosError.request) {
            // The request was made but no response was received
            console.error("No response received:", axiosError.request)
            throw new Error("No response received from the server")
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", axiosError.message)
            throw new Error(`Error setting up request: ${axiosError.message}`)
          }
        } else {
          console.error("Unexpected error:", err)
          throw new Error("An unexpected error occurred")
        }
      } finally {
        setLoading(false)
      }
    },
    [endpointKey],
  )

  return { data, loading, error, execute }
}

