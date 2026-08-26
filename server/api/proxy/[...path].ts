import { joinURL } from 'ufo'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = event.context.params?.path
  const endpoint = Array.isArray(path) ? path.join("/") : path

  if (!endpoint) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing API endpoint",
    })
  }

  const target = joinURL(config.apiUrl, endpoint)
  const query = getRequestURL(event).search

  // proxyRequest correctly handles method, headers, and body stream natively
  return proxyRequest(event, target + query)
})
