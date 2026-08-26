<script setup lang="ts">
defineProps<{
  mobile?: boolean;
}>();

const route = useRoute();
const { user } = useAuth();

type SidebarCompanyApiItem = {
  id: string;
  name: string;
  logo: string | null;
};

type SidebarCompanyApiResponse = {
  data: SidebarCompanyApiItem[];
};

type SidebarBranchApiItem = {
  id: string;
  name: string;
};

type SidebarBranchApiResponse = {
  data: SidebarBranchApiItem[];
};

const { data: companyResponse } = useApiFetch<SidebarCompanyApiResponse>("/company/get");
const { data: branchResponse } = useApiFetch<SidebarBranchApiResponse>("/branch/get");

const navigationItems = [
  { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/dashboard", activePaths: ["/dashboard"] },
  { label: "Users", icon: "i-lucide-users", to: "/", activePaths: ["/", "/users"] },
  { label: "Products", icon: "i-lucide-package", to: "/products", activePaths: ["/products"] },
  { label: "Orders", icon: "i-lucide-shopping-cart", to: "/orders", activePaths: ["/orders"] },
];

const companyManagementNavigationItems = [
  { label: "Company", icon: "i-lucide-building-2", to: "/company", activePaths: ["/company"] },
  { label: "Branch", icon: "i-lucide-building-2", to: "/branch", activePaths: ["/branch"] },
];

const workingCompany = computed(() =>
  companyResponse.value?.data.find(company => company.id === user.value?.working_company_id),
);

const workingBranch = computed(() =>
  branchResponse.value?.data.find(branch => branch.id === user.value?.working_branch_id),
);

const workingCompanyName = computed(() =>
  workingCompany.value?.name || user.value?.working_company_id || "AdminConsole",
);

const workingBranchName = computed(() =>
  workingBranch.value?.name || user.value?.working_branch_id || "Enterprise Management",
);

const workingCompanyLogo = computed(() => workingCompany.value?.logo || null);

const workingCompanyInitials = computed(() => {
  const name = workingCompanyName.value.trim();
  const words = name.split(/\s+/).filter(Boolean);

  if (words.length > 1) {
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join("");
  }

  return name.slice(0, 2).toUpperCase() || "DC";
});

function isNavigationItemActive(item: typeof navigationItems[number]) {
  return item.activePaths.some((path) => {
    if (path === "/") {
      return route.path === "/";
    }

    return route.path === path || route.path.startsWith(`${path}/`);
  });
}

function openSwitchCompany() {
  // TODO
}

async function handleLogout() {
  const accessCookie = useCookie("access_token");
  const refreshCookie = useCookie("refresh_token");
  const typeCookie = useCookie("token_type");

  accessCookie.value = null;
  refreshCookie.value = null;
  typeCookie.value = null;

  const { clearUser } = useAuth();
  clearUser();

  await navigateTo("/login");
}
</script>

<template>
  <aside
    class="flex flex-col h-screen w-sidebar-width bg-surface-container-lowest text-on-surface-variant shadow-sneat-card"
    :class="mobile ? '' : 'fixed left-0 top-0 z-20 hidden lg:flex'"
  >
    <!-- Header - Fixed -->
    <div class="flex-shrink-0 px-6 py-5">
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="flex min-w-0 flex-1 items-center gap-3"
        >
          <div class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-on-primary shadow-sneat-primary">
            <img
              v-if="workingCompanyLogo"
              :src="workingCompanyLogo"
              :alt="workingCompanyName"
              class="size-full rounded-md object-cover"
            >
            <span v-else>{{ workingCompanyInitials }}</span>
          </div>
          <div class="min-w-0">
            <h1 class="truncate text-xl font-bold tracking-normal text-on-surface">
              {{ workingCompanyName }}
            </h1>
            <p class="truncate text-xs font-medium text-on-surface-variant">
              {{ workingBranchName }}
            </p>
          </div>
        </NuxtLink>

        <button
          type="button"
          title="Switch company"
          class="flex size-8 shrink-0 items-center justify-center rounded-md text-on-surface-variant/70 transition duration-200 hover:bg-on-surface/5 hover:text-primary"
          @click="openSwitchCompany"
        >
          <UIcon
            name="i-lucide-arrow-right-left"
            class="size-[18px]"
          />
        </button>
      </div>
    </div>

    <!-- Navigation Scroll -->
    <nav class="flex-1 min-h-0 overflow-y-auto sidebar-scroll">
      <!-- Main Menu -->
      <div>
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
      </div>

      <!-- Company Management Menu -->
      <div>
        <p class="px-6 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
          Company Management
        </p>
        <ul class="space-y-1 px-3">
          <li
            v-for="item in companyManagementNavigationItems"
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
      </div>
    </nav>

    <!-- Logout Button -->
    <div class="flex-shrink-0 border-t border-outline-variant px-3 pb-4 pt-4">
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

<style scoped>
.sidebar-scroll::-webkit-scrollbar {
  width: 0.375rem;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: rgb(203, 213, 225);
  border-radius: 0.25rem;
  transition-property: background-color;
  transition-duration: 300ms;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgb(148, 163, 184);
}
</style>
