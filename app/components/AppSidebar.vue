<script setup lang="ts">
defineProps<{
  mobile?: boolean
}>()

const route = useRoute()

const navigationItems = [
  { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/dashboard", activePaths: ["/dashboard"] },
  { label: "Users", icon: "i-lucide-users", to: "/", activePaths: ["/", "/users"] },
  { label: "Company", icon: "i-lucide-building-2", to: "/company", activePaths: ["/company"] },
  { label: "Branch", icon: "i-lucide-building-2", to: "/branch", activePaths: ["/branch"] },
  { label: "Products", icon: "i-lucide-package", to: "/products", activePaths: ["/products"] },
  { label: "Orders", icon: "i-lucide-shopping-cart", to: "/orders", activePaths: ["/orders"] },
  { label: "Settings", icon: "i-lucide-settings", to: "/settings", activePaths: ["/settings"] },
]

function isNavigationItemActive(item: typeof navigationItems[number]) {
  return item.activePaths.some((path) => {
    if (path === "/") {
      return route.path === "/"
    }

    return route.path === path || route.path.startsWith(`${path}/`)
  })
}

async function handleLogout() {
  const accessCookie = useCookie("access_token")
  const refreshCookie = useCookie("refresh_token")
  const typeCookie = useCookie("token_type")

  accessCookie.value = null
  refreshCookie.value = null
  typeCookie.value = null
  
  const { clearUser } = useAuth()
  clearUser()

  await navigateTo("/login")
}
</script>

<template>
  <aside
    class="flex h-full w-sidebar-width flex-col bg-surface-container-lowest py-5 text-on-surface-variant shadow-sneat-card"
    :class="mobile ? '' : 'fixed left-0 top-0 z-20 hidden h-screen lg:flex'"
  >
    <NuxtLink
      to="/"
      class="mb-6 flex items-center gap-3 px-6"
    >
      <div class="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-on-primary shadow-sneat-primary">
        DC
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-normal text-on-surface">
          AdminConsole
        </h1>
        <p class="text-xs font-medium text-on-surface-variant">
          Enterprise Management
        </p>
      </div>
    </NuxtLink>

    <nav class="flex-1 overflow-y-auto">
      <p class="px-6 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
        Menu
      </p>
      <ul class="space-y-1 px-3">
        <li
          v-for="item in navigationItems"
          :key="item.label"
          class="relative"
          :class="isNavigationItemActive(item) ? 'before:absolute before:right-[-12px] before:top-1 before:h-10 before:w-1 before:rounded-l-md before:bg-primary' : ''"
        >
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] transition duration-200"
            :class="isNavigationItemActive(item)
              ? 'bg-primary/15 font-semibold text-primary'
              : 'font-medium text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface'"
          >
            <UIcon
              :name="item.icon"
              class="size-[21px] shrink-0"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="mt-auto border-t border-outline-variant px-3 pb-4 pt-4">
      <button
        class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium text-danger transition duration-200 hover:bg-danger/10"
        @click="handleLogout"
      >
        <UIcon
          name="i-lucide-log-out"
          class="size-[21px] shrink-0"
        />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>
