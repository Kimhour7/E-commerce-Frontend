<script setup lang="ts">
import type { DataTableColumn, DataTableRow } from "~/components/AppDataTable.vue"

definePageMeta({
  breadcrumbs: [
    { label: "Company" },
  ],
})

interface CompanyApiItem {
  id: string
  name: string
  name_lc: string | null
  description: string | null
  description_lc: string | null
  logo: string | null
  banner: string | null
  phone: string | null
  telegram: string | null
  email: string | null
  facebook: string | null
  youtube: string | null
  country_id: string | null
  province_id: string | null
  district_id: string | null
  commune_id: string | null
  village_id: string | null
  street_no: string | null
  lat_long: string | null
  record_status: string
  created_by: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

interface CompanyApiResponse {
  success: boolean
  message: string
  total: number
  page: number
  size: number
  total_pages: number
  data: CompanyApiItem[]
}

interface DeleteResponse {
  success: boolean
  message: string
}

interface CompanyTableRow extends DataTableRow {
  id: string
  name: string
  name_lc: string
  description: string
  description_lc: string
  logo: string
  banner: string
  email: string
  phone: string
  telegram: string
  facebook: string
  youtube: string
  country_id: string
  province_id: string
  district_id: string
  commune_id: string
  village_id: string
  street_no: string
  lat_long: string
  record_status: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

const columns: DataTableColumn[] = [
  { key: "id", label: "ID", minWidth: "140px", type: "mono" },
  { key: "logo", label: "Logo", imageAltKey: "name", imageSize: "md", minWidth: "120px", type: "image" },
  { key: "banner", label: "Banner", imageAltKey: "name", imageSize: "md", minWidth: "120px", type: "image" },
  { key: "name", label: "Company", maxWidth: "220px", minWidth: "180px", wrap: true },
  { key: "description", label: "Description", maxWidth: "280px", minWidth: "240px", truncateLength: 40, wrap: true },
  { key: "email", label: "Email", maxWidth: "260px", minWidth: "220px" },
  { key: "phone", label: "Phone", minWidth: "140px" },
  { key: "telegram", label: "Telegram", maxWidth: "180px", minWidth: "140px" },
  { key: "record_status", label: "Status", minWidth: "120px", type: "badge" },
  { key: "created_at", label: "Created", align: "right", minWidth: "120px", type: "mono" },
  { key: "updated_at", label: "Updated", align: "right", minWidth: "120px", type: "mono" },
  { key: "actions", label: "Actions", align: "right" },
]

const { data: companyResponse, error, pending, refresh } = await useApiFetch<CompanyApiResponse>("/company/get")

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

const companies = computed<CompanyTableRow[]>(() =>
  companyResponse.value?.data.map(company => ({
    id: company.id,
    name: company.name,
    name_lc: displayValue(company.name_lc),
    description: displayValue(company.description),
    description_lc: displayValue(company.description_lc),
    logo: displayValue(company.logo),
    banner: displayValue(company.banner),
    email: displayValue(company.email),
    phone: displayValue(company.phone),
    telegram: displayValue(company.telegram),
    facebook: displayValue(company.facebook),
    youtube: displayValue(company.youtube),
    country_id: displayValue(company.country_id),
    province_id: displayValue(company.province_id),
    district_id: displayValue(company.district_id),
    commune_id: displayValue(company.commune_id),
    village_id: displayValue(company.village_id),
    street_no: displayValue(company.street_no),
    lat_long: displayValue(company.lat_long),
    record_status: company.record_status,
    created_by: displayValue(company.created_by),
    updated_by: displayValue(company.updated_by),
    created_at: displayDate(company.created_at),
    updated_at: displayDate(company.updated_at),
  })) ?? [],
)

function duplicateCompany(row: DataTableRow) {
  navigateTo({
    path: "/company/add",
    query: {
      duplicateFrom: String(row.id),
    },
  })
}

// Step 1: clicking the delete icon ONLY opens the confirm dialog.
// No API call, no toast, no mutation happens here.
function deleteCompany(row: DataTableRow) {
  rowPendingDelete.value = row
  showDeleteDialog.value = true
}

// Step 2: clicking "Delete Company" inside the dialog is the ONLY place
// that actually calls the API, shows a toast, and refreshes the table.
async function confirmDeleteCompany() {
  if (isDeleting.value || !rowPendingDelete.value) {
    return
  }

  const companyId = String(rowPendingDelete.value.id)
  const companyName = String(rowPendingDelete.value.name)

  isDeleting.value = true

  try {
    await useApiRequest<DeleteResponse>(`/company/delete/${companyId}`, {
      method: "DELETE",
    })

    toast.add({
      title: "Record deleted",
      description: `${companyName} was selected for deletion.`,
      color: "error",
      icon: "i-lucide-trash-2",
    })

    showDeleteDialog.value = false
    await refresh()
  }
  catch (error) {
    toast.add({
      title: "Failed to delete company",
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

// Clicking "Keep Company" or the backdrop — just closes the dialog, no toast.
function cancelDeleteCompany() {
  showDeleteDialog.value = false
  rowPendingDelete.value = null
}
</script>

<template>
  <div class="space-y-6">
    <section class="pt-2 sm:pt-4">
      <h2 class="mb-2 text-[28px] font-bold leading-tight tracking-tight text-on-surface">
        Company Management
      </h2>
      <p class="text-base text-on-surface-variant">
        View company records from the API.
      </p>
    </section>

    <UAlert
      v-if="error"
      color="error"
      icon="i-lucide-circle-alert"
      title="Failed to load companies"
      :description="error.message"
      variant="subtle"
    />

    <div
      v-else-if="pending"
      class="rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-6 text-sm font-medium text-on-surface-variant"
    >
      Loading companies...
    </div>

    <AppDataTable
      v-else
      add-label="Add Company"
      add-to="/company/add"
      :columns="columns"
      :rows="companies"
      search-placeholder="Search companies by name, email, or phone..."
      title="Companies"
      view-path-prefix="/company"
      :is-loading="isDeleting"
      @delete="deleteCompany"
      @duplicate="duplicateCompany"
    />

    <AppConfirmDialog
      v-model="showDeleteDialog"
      title="Delete this company permanently?"
      :description="`This action will delete '${rowPendingDelete?.name}' and all associated data. This cannot be undone.`"
      cancel-label="Keep Company"
      confirm-label="Delete Company"
      :loading="isDeleting"
      @confirm="confirmDeleteCompany"
      @cancel="cancelDeleteCompany"
    />
  </div>
</template>