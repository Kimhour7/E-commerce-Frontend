<script setup lang="ts">
import type { DataTableColumn, DataTableRow } from "~/components/AppDataTable.vue"

definePageMeta({
  breadcrumbs: [
    { label: "Branch" },
  ],
})

interface BranchApiItem {
  id: string
  company_id: string
  name: string
  name_lc: string | null
  logo: string | null
  phone: string | null
  telegram: string | null
  country_id: string | null
  province_id: string | null
  district_id: string | null
  commune_id: string | null
  village_id: string | null
  street_no: string | null
  lat_long: string | null
  opening_date: string | null
  open_hours: string | null
  close_hours: string | null
  record_status: string
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

interface BranchApiResponse {
  success: boolean
  message: string
  total: number
  page: number
  size: number
  total_pages: number
  data: BranchApiItem[]
}

interface DeleteResponse {
  success: boolean
  message: string
}

interface BranchTableRow extends DataTableRow {
  id: string
  company_id: string
  name: string
  name_lc: string | null
  logo: string | null
  phone: string | null
  telegram: string | null
  country_id: string | null
  province_id: string | null
  district_id: string | null
  commune_id: string | null
  village_id: string | null
  street_no: string | null
  lat_long: string | null
  opening_date: string | null
  open_hours: string | null
  close_hours: string | null
  record_status: string
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

const columns: DataTableColumn[] = [
  { key: "id", label: "ID", minWidth: "140px", type: "mono" },
  { key: "logo", label: "Logo", imageAltKey: "name", imageSize: "md", minWidth: "120px", type: "image" },
  { key: "name", label: "Branch Name", maxWidth: "220px", minWidth: "180px", wrap: true },
  { key: "name_lc", label: "Local Name", maxWidth: "220px", minWidth: "180px", wrap: true },
  { key: "phone", label: "Phone", minWidth: "140px" },
  { key: "telegram", label: "Telegram", maxWidth: "180px", minWidth: "140px" },
  { key: "country_id", label: "Country", minWidth: "100px" },
  { key: "province_id", label: "Province", minWidth: "100px" },
  { key: "street_no", label: "Address", maxWidth: "200px", minWidth: "160px", wrap: true },
  { key: "opening_date", label: "Opening Date", minWidth: "120px", type: "mono" },
  { key: "open_hours", label: "Opens", minWidth: "100px", type: "mono" },
  { key: "close_hours", label: "Closes", minWidth: "100px", type: "mono" },
  { key: "record_status", label: "Status", minWidth: "120px", type: "badge" },
  { key: "created_at", label: "Created", align: "right", minWidth: "120px", type: "mono" },
  { key: "updated_at", label: "Updated", align: "right", minWidth: "120px", type: "mono" },
  { key: "actions", label: "Actions", align: "right" },
]

const { data: branchResponse, error, pending, refresh } = await useApiFetch<BranchApiResponse>("/branch/get")

const toast = useToast()
const isDeleting = ref(false)
const showDeleteDialog = ref(false)
const rowPendingDelete = ref<DataTableRow | null>(null)

function displayValue(value: string | null) {
  return value || "-"
}

function displayDate(value: string | null) {
  return value ? value.slice(0, 10) : "-"
}

function getErrorMessage(error: any): string {
  if (error?.data?.message) {
    return error.data.message
  }
  if (error?.message) {
    return error.message
  }
  if (error?.statusMessage) {
    return error.statusMessage
  }
  return "An unexpected error occurred. Please try again."
}

const branches = computed<BranchTableRow[]>(() =>
  branchResponse.value?.data.map(branch => ({
    id: branch.id,
    company_id: branch.company_id,
    name: branch.name,
    name_lc: displayValue(branch.name_lc),
    logo: displayValue(branch.logo),
    phone: displayValue(branch.phone),
    telegram: displayValue(branch.telegram),
    country_id: displayValue(branch.country_id),
    province_id: displayValue(branch.province_id),
    district_id: displayValue(branch.district_id),
    commune_id: displayValue(branch.commune_id),
    village_id: displayValue(branch.village_id),
    street_no: displayValue(branch.street_no),
    lat_long: displayValue(branch.lat_long),
    opening_date: displayDate(branch.opening_date),
    open_hours: displayValue(branch.open_hours),
    close_hours: displayValue(branch.close_hours),
    record_status: branch.record_status,
    created_by: displayValue(branch.created_by),
    updated_by: displayValue(branch.updated_by),
    created_at: displayDate(branch.created_at),
    updated_at: displayDate(branch.updated_at),
  })) ?? [],
)

function duplicateBranch(row: DataTableRow) {
  navigateTo({
    path: "/branch/add",
    query: {
      duplicateFrom: String(row.id),
    },
  })
}

// Step 1: clicking the delete icon ONLY opens the confirm dialog.
// No API call, no toast, no mutation happens here.
function deleteBranch(row: DataTableRow) {
  rowPendingDelete.value = row
  showDeleteDialog.value = true
}

// Step 2: clicking "Delete Branch" inside the dialog is the ONLY place
// that actually calls the API, shows a toast, and refreshes the table.
async function confirmDeleteBranch() {
  if (isDeleting.value || !rowPendingDelete.value) {
    return
  }

  const branchId = String(rowPendingDelete.value.id)
  const branchName = String(rowPendingDelete.value.name)

  isDeleting.value = true

  try {
    await useApiRequest<DeleteResponse>(`/branch/delete/${branchId}`, {
      method: "DELETE",
    })

    toast.add({
      title: "Branch deleted",
      description: `${branchName} was deleted successfully.`,
      color: "error",
      icon: "i-lucide-trash-2",
    })

    showDeleteDialog.value = false
    await refresh()
  }
  catch (error) {
    toast.add({
      title: "Failed to delete branch",
      description: getErrorMessage(error),
      color: "error",
      icon: "i-lucide-circle-alert",
    })

    console.error("Delete error:", error)
  }
  finally {
    isDeleting.value = false
    rowPendingDelete.value = null
  }
}

// Clicking "Keep Branch" or the backdrop — just closes the dialog, no toast.
function cancelDeleteBranch() {
  showDeleteDialog.value = false
  rowPendingDelete.value = null
}
</script>

<template>
  <div class="space-y-6">
    <section class="pt-2 sm:pt-4">
      <h2 class="mb-2 text-[28px] font-bold leading-tight tracking-tight text-on-surface">
        Branch Management
      </h2>
      <p class="text-base text-on-surface-variant">
        View and manage branch records from the API.
      </p>
    </section>

    <UAlert
      v-if="error"
      color="error"
      icon="i-lucide-circle-alert"
      title="Failed to load branches"
      :description="error.message"
      variant="subtle"
    />

    <div
      v-else-if="pending"
      class="rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-6 text-sm font-medium text-on-surface-variant"
    >
      Loading branches...
    </div>

    <AppDataTable
      v-else
      add-label="Add Branch"
      add-to="/branch/add"
      :columns="columns"
      :rows="branches"
      search-placeholder="Search branches by name, phone, or address..."
      title="Branches"
      view-path-prefix="/branch"
      :is-loading="isDeleting"
      @delete="deleteBranch"
      @duplicate="duplicateBranch"
    />

    <AppConfirmDialog
      v-model="showDeleteDialog"
      title="Delete this branch permanently?"
      :description="`This action will delete '${rowPendingDelete?.name}' and all associated data. This cannot be undone.`"
      cancel-label="Keep Branch"
      confirm-label="Delete Branch"
      :loading="isDeleting"
      @confirm="confirmDeleteBranch"
      @cancel="cancelDeleteBranch"
    />
  </div>
</template>