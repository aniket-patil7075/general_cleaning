import { AxiosError } from "axios"

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return error.response.data.message || "An error occurred with the API response"
    } else if (error.request) {
      // The request was made but no response was received
      return "No response received from the server"
    } else {
      // Something happened in setting up the request that triggered an Error
      return error.message || "An error occurred while setting up the request"
    }
  }
  return "An unknown error occurred"
}

export function formatApiResponse<T>(data: T): T {
  // You can add any common formatting logic here
  return data
}

