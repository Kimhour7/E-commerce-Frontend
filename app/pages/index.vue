<script setup lang="ts">
import type { DataTableColumn, DataTableRow } from "~/components/AppDataTable.vue"

definePageMeta({
  breadcrumbs: [
    { label: "Users" },
  ],
})

const columns: DataTableColumn[] = [
  { key: "user", label: "User" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status", type: "badge" },
  { key: "joinedDate", label: "Joined Date", type: "mono" },
  { key: "actions", label: "Actions", align: "right" },
]

const { users } = useUserRecords()

function duplicateUser(row: DataTableRow) {
  navigateTo({
    path: "/users/add",
    query: {
      duplicateFrom: String(row.id),
    },
  })
}
</script>

<template>
  <div class="space-y-6">
    <section class="pt-2 sm:pt-4">
      <h2 class="mb-2 text-[28px] font-bold leading-tight tracking-tight text-on-surface">
        User Management
      </h2>
      <p class="text-base text-on-surface-variant">
        View and manage system users, roles, and statuses.
      </p>
    </section>

    <AppDataTable
      add-label="Add User"
      add-to="/users/add"
      :columns="columns"
      :rows="users"
      title="Users"
      view-path-prefix="/users"
      @duplicate="duplicateUser"
    >
      <template #cell-user="{ row }">
        <div class="flex items-center gap-3.5">
          <div
            class="flex size-9 items-center justify-center rounded-full text-sm font-bold shadow-sm ring-1"
            :class="row.status === 'Active'
              ? 'bg-primary/10 text-primary ring-primary/20'
              : 'bg-surface-variant text-on-surface-variant ring-outline/20'"
          >
            {{ row.initials }}
          </div>
          <span class="text-sm font-semibold text-on-surface">{{ row.name }}</span>
        </div>
      </template>
    </AppDataTable>
  </div>
</template>
