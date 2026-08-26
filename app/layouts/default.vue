<script setup lang="ts">
import type { PageBreadcrumbItem } from "~/components/AppPageBreadcrumb.vue"

const route = useRoute()

const breadcrumbs = computed(() => (route.meta.breadcrumbs ?? []) as PageBreadcrumbItem[])
const { user, fetchUser } = useAuth()
const accessToken = useCookie("access_token")

if (accessToken.value && !user.value) {
  await fetchUser(accessToken.value)
}

const userDisplayName = computed(() => {
  if (!user.value) return "User profile"
  const first = user.value.first_name || ""
  const last = user.value.last_name || ""
  const fullName = `${first} ${last}`.trim()
  return fullName || user.value.username || "User profile"
})

const userInitials = computed(() => {
  if (!user.value) return "AD"
  const first = user.value.first_name?.charAt(0) || ""
  const last = user.value.last_name?.charAt(0) || ""
  const initials = `${first}${last}`.toUpperCase()
  return initials || (user.value.username?.charAt(0).toUpperCase() || "AD")
})

const topBarActions = [
  { label: "Notifications", icon: "i-lucide-bell" },
  { label: "Help", icon: "i-lucide-circle-help" },
]
</script>

<template>
  <div class="min-h-screen bg-background text-on-background">
    <AppSidebar />

    <div class="min-h-screen lg:pl-sidebar-width">
      <header class="sticky top-3 z-10 mx-4 mt-3 flex h-16 items-center justify-between rounded-lg bg-surface-container-lowest/95 px-4 shadow-sneat-navbar backdrop-blur-md sm:mx-gutter sm:px-6">
        <div class="flex min-w-0 items-center gap-3">
          <USlideover side="left">
            <UButton
              aria-label="Open navigation"
              class="lg:hidden"
              color="neutral"
              icon="i-lucide-menu"
              square
              variant="ghost"
            />

            <template #content>
              <AppSidebar mobile />
            </template>
          </USlideover>

          <div class="hidden min-w-0 items-center gap-2 text-on-surface-variant sm:flex">
            <UIcon
              name="i-lucide-search"
              class="size-5 shrink-0"
            />
            <span class="truncate text-[15px]">Search</span>
          </div>
          <span class="min-w-0 truncate text-base font-semibold text-on-surface sm:hidden">Management Suite</span>
        </div>

        <div class="flex items-center justify-end gap-2">
          <UButton
            v-for="action in topBarActions"
            :key="action.label"
            :aria-label="action.label"
            :icon="action.icon"
            color="neutral"
            square
            variant="ghost"
          />

          <div class="mx-1 h-6 w-px bg-outline-variant/50" />

          <UAvatar
            :alt="userDisplayName"
            size="sm"
            :text="userInitials"
            class="bg-primary-container text-primary ring-2 ring-surface"
          />
        </div>
      </header>

      <main class="min-h-[calc(100vh-5.75rem)] p-4 pt-6 sm:p-gutter sm:pt-6">
        <div class="mx-auto w-full max-w-container-max">
          <AppPageBreadcrumb
            v-if="breadcrumbs.length"
            :items="breadcrumbs"
          />
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
