<script setup lang="ts">
import type { RecordFormField } from "~/components/AppRecordForm.vue"

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
}

interface CompanyApiResponse {
  data: CompanyApiItem[]
}

interface CompanyUpdateResponse {
  success: boolean
  message: string
  data: CompanyApiItem | null
}

definePageMeta({
  breadcrumbs: [
    { label: "Company", to: "/company" },
    { label: "Edit Record" },
  ],
})

const route = useRoute()
const toast = useToast()

const { data: companyResponse, error, pending } = await useApiFetch<CompanyApiResponse>("/company/get")

const companyId = computed(() => String(route.params.id))
const company = computed(() => companyResponse.value?.data.find(item => item.id === companyId.value))

const companyFields: RecordFormField[] = [
  { name: "name", label: "Company Name", placeholder: "e.g. Mekong Digital Solutions", required: true, span: "full" },
  { name: "name_lc", label: "Local Name", placeholder: "Company local name" },
  { name: "email", label: "Email", placeholder: "contact@example.com" },
  { name: "phone", label: "Phone", placeholder: "+855-23-456-789" },
  { name: "telegram", label: "Telegram", placeholder: "t.me/company" },
  { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/company" },
  { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/@company" },
  { name: "logo", label: "Logo URL", placeholder: "https://example.com/logo.png" },
  { name: "banner", label: "Banner URL", placeholder: "https://example.com/banner.jpg" },
  { name: "country_id", label: "Country ID", placeholder: "CNT0000001" },
  { name: "province_id", label: "Province ID", placeholder: "PRV0000001" },
  { name: "district_id", label: "District ID", placeholder: "DST0000001" },
  { name: "commune_id", label: "Commune ID", placeholder: "COM0000001" },
  { name: "village_id", label: "Village ID", placeholder: "VIL0000001" },
  { name: "street_no", label: "Street No", placeholder: "Street 123" },
  { name: "lat_long", label: "Lat Long", placeholder: "11.5564,104.9282" },
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
  { name: "description", label: "Description", placeholder: "Add company description...", span: "full", type: "textarea" },
  { name: "description_lc", label: "Local Description", placeholder: "Add local description...", span: "full", type: "textarea" },
]

const initialValues = computed<Record<string, string>>(() => {
  if (!company.value) {
    return {}
  }

  return {
    banner: company.value.banner || "",
    commune_id: company.value.commune_id || "",
    country_id: company.value.country_id || "",
    description: company.value.description || "",
    description_lc: company.value.description_lc || "",
    district_id: company.value.district_id || "",
    email: company.value.email || "",
    facebook: company.value.facebook || "",
    lat_long: company.value.lat_long || "",
    logo: company.value.logo || "",
    name: company.value.name,
    name_lc: company.value.name_lc || "",
    phone: company.value.phone || "",
    province_id: company.value.province_id || "",
    record_status: company.value.record_status,
    street_no: company.value.street_no || "",
    telegram: company.value.telegram || "",
    village_id: company.value.village_id || "",
    youtube: company.value.youtube || "",
  }
})

const isSubmitting = ref(false)

function optionalValue(value: string) {
  return value.trim() || null
}

function requiredValue(value: string) {
  return value.trim()
}

function buildCompanyUpdatePayload(values: Record<string, string>) {
  return {
    banner: optionalValue(values.banner || ""),
    commune_id: optionalValue(values.commune_id || ""),
    country_id: requiredValue(values.country_id || ""),
    description: optionalValue(values.description || ""),
    description_lc: optionalValue(values.description_lc || ""),
    district_id: optionalValue(values.district_id || ""),
    email: optionalValue(values.email || ""),
    facebook: optionalValue(values.facebook || ""),
    lat_long: optionalValue(values.lat_long || ""),
    logo: optionalValue(values.logo || ""),
    name: requiredValue(values.name || ""),
    name_lc: requiredValue(values.name_lc || ""),
    phone: optionalValue(values.phone || ""),
    province_id: requiredValue(values.province_id || ""),
    record_status: requiredValue(values.record_status || ""),
    street_no: optionalValue(values.street_no || ""),
    telegram: optionalValue(values.telegram || ""),
    village_id: optionalValue(values.village_id || ""),
    youtube: optionalValue(values.youtube || ""),
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return "Please check the company details and try again."
}

async function updateCompany(values: Record<string, string>) {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await useApiRequest<CompanyUpdateResponse>(`/company/update/${companyId.value}`, {
      body: buildCompanyUpdatePayload(values),
      method: "PUT",
    })

    toast.add({
      title: "Company record updated",
      description: response.message || `${values.name || company.value?.name || "Company"} was updated successfully.`,
      color: "success",
      icon: "i-lucide-check-circle",
    })

    await navigateTo(`/company/${companyId.value}`)
  }
  catch (error) {
    toast.add({
      title: "Failed to update company",
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
      title="Failed to load company"
      :description="error.message"
      variant="subtle"
    />

    <div
      v-else-if="pending"
      class="rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-6 text-sm font-medium text-on-surface-variant"
    >
      Loading company...
    </div>

    <UAlert
      v-else-if="!company"
      color="warning"
      icon="i-lucide-triangle-alert"
      title="Company not found"
      :description="`No company record exists for ${companyId}.`"
      variant="subtle"
    />

    <AppRecordForm
      v-else
      title="Edit Company"
      description="Update this company record."
      :fields="companyFields"
      full-width
      :initial-values="initialValues"
      :submitting="isSubmitting"
      submit-label="Update Company"
      info-title="Company Edit Flow"
      info-description="This edit screen reuses the shared core form while loading the selected company values."
      @cancel="navigateTo(`/company/${company.id}`)"
      @submit="updateCompany"
    />
  </div>
</template>