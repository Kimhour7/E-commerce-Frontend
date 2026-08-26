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

interface BranchCreatePayload {
  name: string
  name_lc: string
  logo: string | null
  phone: string | null
  telegram: string | null
  country_id: string
  province_id: string
  district_id: string | null
  commune_id: string | null
  village_id: string | null
  street_no: string | null
  lat_long: string | null
  opening_date: string | null
  open_hours: string | null
  close_hours: string | null
}

interface BranchCreateResponse {
  success: boolean
  message: string
  data: BranchApiItem | null
}

definePageMeta({
  breadcrumbs: [
    { label: "Branch", to: "/branch" },
    { label: "Add New Record" },
  ],
})

const route = useRoute()
const toast = useToast()
const isSubmitting = ref(false)

const { data: branchResponse } = await useApiFetch<BranchApiResponse>("/branch/get")

const branchFields: RecordFormField[] = [
  { name: "name", label: "Branch Name", placeholder: "e.g. Mekong Riverside Cafe", required: true, span: "full" },
  { name: "name_lc", label: "Local Name", placeholder: "Branch local name", required: true, span: "full" },
  { name: "phone", label: "Phone", placeholder: "+855-12-345-678" },
  { name: "telegram", label: "Telegram", placeholder: "@branch_handle" },
  { name: "logo", label: "Logo URL", placeholder: "https://example.com/logo.png" },
  { name: "country_id", label: "Country ID", placeholder: "KH", required: true },
  { name: "province_id", label: "Province ID", placeholder: "12", required: true },
  { name: "district_id", label: "District ID", placeholder: "1201" },
  { name: "commune_id", label: "Commune ID", placeholder: "120101" },
  { name: "village_id", label: "Village ID", placeholder: "12010101" },
  { name: "street_no", label: "Street Address", placeholder: "Street 21" },
  { name: "lat_long", label: "Latitude, Longitude", placeholder: "11.5564, 104.9282" },
  { name: "opening_date", label: "Opening Date", placeholder: "2026-07-10", type: "date" },
  { name: "open_hours", label: "Opening Hours", placeholder: "00:00:00", type: "time" },
  { name: "close_hours", label: "Closing Hours", placeholder: "14:00:00", type: "time" },
]

const duplicatedBranch = computed(() => {
  const duplicateFrom = String(route.query.duplicateFrom || "")

  if (!duplicateFrom) {
    return undefined
  }

  return branchResponse.value?.data.find(branch => branch.id === duplicateFrom)
})

const initialValues = computed<Record<string, string>>(() => {
  if (!duplicatedBranch.value) {
    return {}
  }

  return {
    close_hours: duplicatedBranch.value.close_hours || "",
    commune_id: duplicatedBranch.value.commune_id || "",
    country_id: duplicatedBranch.value.country_id || "",
    district_id: duplicatedBranch.value.district_id || "",
    lat_long: duplicatedBranch.value.lat_long || "",
    logo: duplicatedBranch.value.logo || "",
    name: duplicatedBranch.value.name,
    name_lc: duplicatedBranch.value.name_lc || "",
    open_hours: duplicatedBranch.value.open_hours || "",
    opening_date: duplicatedBranch.value.opening_date || "",
    phone: duplicatedBranch.value.phone || "",
    province_id: duplicatedBranch.value.province_id || "",
    street_no: duplicatedBranch.value.street_no || "",
    telegram: duplicatedBranch.value.telegram || "",
    village_id: duplicatedBranch.value.village_id || "",
  }
})

function optionalValue(value: string) {
  return value.trim() || null
}

function requiredValue(value: string) {
  return value.trim()
}

function buildBranchPayload(values: Record<string, string>): BranchCreatePayload {
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

async function submitBranch(values: Record<string, string>) {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await useApiRequest<BranchCreateResponse>("/branch/create", {
      body: buildBranchPayload(values),
      method: "POST",
    })

    toast.add({
      title: "Branch record created",
      description: response.message || `${values.name || "Branch"} was added successfully.`,
      color: "success",
      icon: "i-lucide-check-circle",
    })

    await navigateTo("/branch")
  }
  catch (error) {
    toast.add({
      title: "Failed to create branch",
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
  <AppRecordForm
    :title="duplicatedBranch ? 'Duplicate Branch' : 'Add Branch'"
    :description="duplicatedBranch ? `Create a new branch using ${duplicatedBranch.name}'s record as a starting point.` : 'Create a new branch record.'"
    :fields="branchFields"
    full-width
    :initial-values="initialValues"
    :submitting="isSubmitting"
    submit-label="Create Branch"
    info-title="Branch Add Flow"
    info-description="This form creates branch records through the API."
    @cancel="navigateTo('/branch')"
    @submit="submitBranch"
  />
</template>