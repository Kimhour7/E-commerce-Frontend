import type { UseFetchOptions } from "nuxt/app"

export function useApiFetch<T>(endpoint: string | (() => string), options: UseFetchOptions<T> = {}) {
  const token = useCookie("access_token").value
  const existingHeaders = (options.headers as Record<string, string> | undefined) || {}
  const headers = {
    ...existingHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  return useFetch<T>(endpoint, {
    baseURL: "/api/proxy",
    ...options,
    headers,
  })
}

export function useApiRequest<T>(endpoint: string, options: Parameters<typeof $fetch<T>>[1] = {}) {
  const token = useCookie("access_token").value
  const existingHeaders = (options.headers as Record<string, string> | undefined) || {}
  const headers = {
    ...existingHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // IMPORTANT: Stringify body if it's an object, but leave FormData and URLSearchParams intact
  let body = options.body
  if (
    body &&
    typeof body === "object" &&
    typeof body !== "string" &&
    !(body instanceof FormData) &&
    !(body instanceof URLSearchParams)
  ) {
    body = JSON.stringify(body)
  }

  // Destructure body from options to prevent it from being spread
  const { body: _, ...restOptions } = options

  return $fetch<T>(endpoint, {
    baseURL: "/api/proxy",
    ...restOptions,
    headers,
    body, // Use the stringified body (not from spread)
  })
}