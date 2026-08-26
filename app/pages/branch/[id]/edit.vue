<script setup lang="ts">
import type { RecordFormField } from "~/components/AppRecordForm.vue"

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
}

interface BranchApiResponse {
  data: BranchApiItem[]
}

definePageMeta({
  breadcrumbs: [
    { label: "Branch", to: "/branch" },
    { label: "Edit Record" },
  ],
})

const route = useRoute()
const toast = useToast()

const { data: branchResponse, error, pending } = await useApiFetch<BranchApiResponse>("/branch/get")

const branchId = computed(() => String(route.params.id))
const branch = computed(() => branchResponse.value?.data.find(item => item.id === branchId.value))

const branchFields: RecordFormField[] = [
  { name: "name", label: "Branch Name", placeholder: "e.g. Mekong Riverside Cafe", required: true, span: "full" },
  { name: "name_lc", label: "Local Name", placeholder: "Branch local name", span: "full" },
  { name: "phone", label: "Phone", placeholder: "+855-12-345-678" },
  { name: "telegram", label: "Telegram", placeholder: "@branch_handle" },
  { name: "logo", label: "Logo URL", placeholder: "https://example.com/logo.png" },
  { name: "country_id", label: "Country ID", placeholder: "KH" },
  { name: "province_id", label: "Province ID", placeholder: "12" },
  { name: "district_id", label: "District ID", placeholder: "1201" },
  { name: "commune_id", label: "Commune ID", placeholder: "120101" },
  { name: "village_id", label: "Village ID", placeholder: "12010101" },
  { name: "street_no", label: "Street Address", placeholder: "Street 21" },
  { name: "lat_long", label: "Latitude, Longitude", placeholder: "11.5564, 104.9282" },
  { name: "opening_date", label: "Opening Date", placeholder: "2026-07-10", type: "date" },
  { name: "open_hours", label: "Opening Hours", placeholder: "00:00:00", type: "time" },
  { name: "close_hours", label: "Closing Hours", placeholder: "14:00:00", type: "time" },
  {
    name: "record_status",
    label: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
      { label: "Archived", value: "ARCHIVED" },
    ],
    placeholder: "Select status...",
    required: true,
    type: "select",
  },
]

const initialValues = computed<Record<string, string>>(() => {
  if (!branch.value) {
    return {}
  }

  return {
    close_hours: branch.value.close_hours || "",
    commune_id: branch.value.commune_id || "",
    country_id: branch.value.country_id || "",
    district_id: branch.value.district_id || "",
    lat_long: branch.value.lat_long || "",
    logo: branch.value.logo || "",
    name: branch.value.name,
    name_lc: branch.value.name_lc || "",
    open_hours: branch.value.open_hours || "",
    opening_date: branch.value.opening_date || "",
    phone: branch.value.phone || "",
    province_id: branch.value.province_id || "",
    record_status: branch.value.record_status,
    street_no: branch.value.street_no || "",
    telegram: branch.value.telegram || "",
    village_id: branch.value.village_id || "",
  }
})

interface BranchUpdateResponse {
  success: boolean
  message: string
  data: BranchApiItem | null
}

const isSubmitting = ref(false)

function optionalValue(value: string) {
  return value.trim() || null
}

function requiredValue(value: string) {
  return value.trim()
}

function buildBranchUpdatePayload(values: Record<string, string>) {
  return {
    close_hours: optionalValue(values.close_hours || ""),
    commune_id: optionalValue(values.commune_id || ""),
    country_id: requiredValue(values.country_id || ""),
    district_id: optionalValue(values.district_id || ""),
    lat_long: optionalValue(values.lat_long || ""),
    logo: optionalValue(values.logo || ""),
    name: requiredValue(values.name || ""),
    name_lc: requiredValue(values.name_lc || ""),
    open_hours: optionalValue(values.open_hours || ""),
    opening_date: optionalValue(values.opening_date || ""),
    phone: optionalValue(values.phone || ""),
    province_id: requiredValue(values.province_id || ""),
    record_status: requiredValue(values.record_status || ""),
    street_no: optionalValue(values.street_no || ""),
    telegram: optionalValue(values.telegram || ""),
    village_id: optionalValue(values.village_id || ""),
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return "Please check the branch details and try again."
}

async function updateBranch(values: Record<string, string>) {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await useApiRequest<BranchUpdateResponse>(`/branch/update/${branchId.value}`, {
      body: buildBranchUpdatePayload(values),
      method: "PUT",
    })

    toast.add({
      title: "Branch record updated",
      description: response.message || `${values.name || branch.value?.name || "Branch"} was updated successfully.`,
      color: "success",
      icon: "i-lucide-check-circle",
    })

    await navigateTo(`/branch/${branchId.value}`)
  }
  catch (error) {
    toast.add({
      title: "Failed to update branch",
      description: getErrorMessage(error),
      color: "error",
      icon: "i-lucide-circle-alert",
    })
  }
  finally {
    isSubmitting.value = false
  }
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

    <AppRecordForm
      v-else
      title="Edit Branch"
      description="Update this branch record."
      :fields="branchFields"
      full-width
      :initial-values="initialValues"
      :submitting="isSubmitting"
      submit-label="Update Branch"
      info-title="Branch Edit Flow"
      info-description="This edit screen reuses the shared core form while loading the selected branch values."
      @cancel="navigateTo(`/branch/${branch.id}`)"
      @submit="updateBranch"
    />
  </div>
</template>