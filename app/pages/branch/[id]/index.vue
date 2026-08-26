<script setup lang="ts">
import type { RecordDetailItem } from "~/components/AppRecordDetails.vue"

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
  data: BranchApiItem[]
  message: string
  page: number
  size: number
  success: boolean
  total: number
  total_pages: number
}

interface DeleteResponse {
  success: boolean
  message: string
}

definePageMeta({
  breadcrumbs: [
    { label: "Branch", to: "/branch" },
    { label: "Branch Details" },
  ],
})

const route = useRoute()
const toast = useToast()

const { data: branchResponse, error, pending } = await useApiFetch<BranchApiResponse>("/branch/get")

const branchId = computed(() => String(route.params.id))
const branch = computed(() => branchResponse.value?.data.find(item => item.id === branchId.value))

const isDeleting = ref(false)
const showDeleteDialog = ref(false)

function displayValue(value: string | null | undefined) {
  return value || "-"
}

function displayDate(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "-"
}

function displayTime(value: string | null | undefined) {
  return value ? value.slice(0, 8) : "-"
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

const branchDetails = computed<RecordDetailItem[]>(() => {
  if (!branch.value) {
    return []
  }

  return [
    { label: "ID", value: branch.value.id },
    { label: "Company ID", value: displayValue(branch.value.company_id) },
    { label: "Name", value: branch.value.name },
    { label: "Local Name", value: displayValue(branch.value.name_lc) },
    { label: "Logo", value: displayValue(branch.value.logo) },
    { label: "Phone", value: displayValue(branch.value.phone) },
    { label: "Telegram", value: displayValue(branch.value.telegram) },
    { label: "Country ID", value: displayValue(branch.value.country_id) },
    { label: "Province ID", value: displayValue(branch.value.province_id) },
    { label: "District ID", value: displayValue(branch.value.district_id) },
    { label: "Commune ID", value: displayValue(branch.value.commune_id) },
    { label: "Village ID", value: displayValue(branch.value.village_id) },
    { label: "Street Address", value: displayValue(branch.value.street_no) },
    { label: "Coordinates", value: displayValue(branch.value.lat_long) },
    { label: "Opening Date", value: displayDate(branch.value.opening_date) },
    { label: "Opening Hours", value: displayTime(branch.value.open_hours) },
    { label: "Closing Hours", value: displayTime(branch.value.close_hours) },
    { label: "Status", value: branch.value.record_status },
    { label: "Created By", value: displayValue(branch.value.created_by) },
    { label: "Updated By", value: displayValue(branch.value.updated_by) },
    { label: "Created At", value: displayDate(branch.value.created_at) },
    { label: "Updated At", value: displayDate(branch.value.updated_at) },
  ]
})

// Step 1: clicking delete on the record ONLY opens the confirm dialog.
function deleteBranch() {
  showDeleteDialog.value = true
}

// Step 2: clicking "Delete Branch" inside the dialog is the ONLY place
// that actually calls the API, shows a toast, and navigates away.
async function confirmDeleteBranch() {
  if (isDeleting.value || !branch.value) {
    return
  }

  isDeleting.value = true

  try {
    await useApiRequest<DeleteResponse>(`/branch/delete/${branch.value.id}`, {
      method: "DELETE",
    })

    toast.add({
      title: "Branch deleted",
      description: `${branch.value.name} was deleted successfully.`,
      color: "error",
      icon: "i-lucide-trash-2",
    })

    showDeleteDialog.value = false
    navigateTo("/branch")
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
  }
}

// Clicking "Keep Branch" or the backdrop — just closes the dialog, no toast.
function cancelDeleteBranch() {
  showDeleteDialog.value = false
}
</script>

<template>
  <div class="space-y-6">
    <UAlert
      v-if="error"
      color="error"
      icon="i-lucide-circle-alert"
      title="Failed to load branch"
      :description="error.message"
      variant="subtle"
    />

    <div
      v-else-if="pending"
      class="rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-6 text-sm font-medium text-on-surface-variant"
    >
      Loading branch...
    </div>

    <UAlert
      v-else-if="!branch"
      color="warning"
      icon="i-lucide-triangle-alert"
      title="Branch not found"
      :description="`No branch record exists for ${branchId}.`"
      variant="subtle"
    />

    <AppRecordDetails
      v-else
      title="Branch Details"
      :description="`Reviewing the branch record for ${branch.name}.`"
      :details="branchDetails"
      :edit-to="`/branch/${branch.id}/edit`"
      @delete="deleteBranch"
    />

    <AppConfirmDialog
      v-model="showDeleteDialog"
      title="Delete this branch permanently?"
      :description="`This action will delete '${branch?.name}' and all associated data. This cannot be undone.`"
      cancel-label="Keep Branch"
      confirm-label="Delete Branch"
      :loading="isDeleting"
      @confirm="confirmDeleteBranch"
      @cancel="cancelDeleteBranch"
    />
  </div>
</template>