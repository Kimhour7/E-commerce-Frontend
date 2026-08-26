export default defineNuxtRouteMiddleware((to) => {
  // allow unauthenticated access to these routes
  const publicPaths = new Set(["/login", "/forgot-password", "/public"])

  // allow static/_nuxt assets and public paths
  if (to.path.startsWith("/_") || to.path.startsWith("/api")) return
  if (publicPaths.has(to.path) || to.path.startsWith("/public")) return

  const token = useCookie("access_token").value

  if (!token) {
    // redirect to login and preserve original destination
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
