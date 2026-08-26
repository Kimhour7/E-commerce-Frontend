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

interface CompanyCreatePayload {
  name: string
  name_lc: string
  description: string | null
  description_lc: string | null
  logo: string | null
  banner: string | null
  phone: string | null
  telegram: string | null
  email: string | null
  facebook: string | null
  youtube: string | null
  country_id: string
  province_id: string
  district_id: string | null
  commune_id: string | null
  village_id: string | null
  street_no: string | null
  lat_long: string | null
}

interface CompanyCreateResponse {
  success: boolean
  message: string
  data: CompanyApiItem | null
}

definePageMeta({
  breadcrumbs: [
    { label: "Company", to: "/company" },
    { label: "Add New Record" },
  ],
})

const route = useRoute()
const toast = useToast()
const isSubmitting = ref(false)

const { data: companyResponse } = await useApiFetch<CompanyApiResponse>("/company/get")

const companyFields: RecordFormField[] = [
  { name: "name", label: "Company Name", placeholder: "e.g. Mekong Digital Solutions", required: true, span: "full" },
  { name: "name_lc", label: "Local Name", placeholder: "Company local name", required: true },
  { name: "email", label: "Email", placeholder: "contact@example.com" },
  { name: "phone", label: "Phone", placeholder: "+855-23-456-789" },
  { name: "telegram", label: "Telegram", placeholder: "t.me/company" },
  { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/company" },
  { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/@company" },
  { name: "logo", label: "Logo URL", placeholder: "https://example.com/logo.png" },
  { name: "banner", label: "Banner URL", placeholder: "https://example.com/banner.jpg" },
  { name: "country_id", label: "Country ID", placeholder: "CNT0000001", required: true },
  { name: "province_id", label: "Province ID", placeholder: "PRV0000001", required: true },
  { name: "district_id", label: "District ID", placeholder: "DST0000001" },
  { name: "commune_id", label: "Commune ID", placeholder: "COM0000001" },
  { name: "village_id", label: "Village ID", placeholder: "VIL0000001" },
  { name: "street_no", label: "Street No", placeholder: "Street 123" },
  { name: "lat_long", label: "Lat Long", placeholder: "11.5564,104.9282" },
  { name: "description", label: "Description", placeholder: "Add company description...", span: "full", type: "textarea" },
  { name: "description_lc", label: "Local Description", placeholder: "Add local description...", span: "full", type: "textarea" },
]

const duplicatedCompany = computed(() => {
  const duplicateFrom = String(route.query.duplicateFrom || "")

  if (!duplicateFrom) {
    return undefined
  }

  return companyResponse.value?.data.find(company => company.id === duplicateFrom)
})

const initialValues = computed<Record<string, string>>(() => {
  if (!duplicatedCompany.value) {
    return {}
  }

  return {
    banner: duplicatedCompany.value.banner || "",
    commune_id: duplicatedCompany.value.commune_id || "",
    country_id: duplicatedCompany.value.country_id || "",
    description: duplicatedCompany.value.description || "",
    description_lc: duplicatedCompany.value.description_lc || "",
    district_id: duplicatedCompany.value.district_id || "",
    email: duplicatedCompany.value.email || "",
    facebook: duplicatedCompany.value.facebook || "",
    lat_long: duplicatedCompany.value.lat_long || "",
    logo: duplicatedCompany.value.logo || "",
    name: duplicatedCompany.value.name,
    name_lc: duplicatedCompany.value.name_lc || "",
    phone: duplicatedCompany.value.phone || "",
    province_id: duplicatedCompany.value.province_id || "",
    street_no: duplicatedCompany.value.street_no || "",
    telegram: duplicatedCompany.value.telegram || "",
    village_id: duplicatedCompany.value.village_id || "",
    youtube: duplicatedCompany.value.youtube || "",
  }
})

function optionalValue(value: string) {
  return value.trim() || null
}

function requiredValue(value: string) {
  return value.trim()
}

function buildCompanyPayload(values: Record<string, string>): CompanyCreatePayload {
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

async function submitCompany(values: Record<string, string>) {
  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    const response = await useApiRequest<CompanyCreateResponse>("/company/create", {
      body: buildCompanyPayload(values),
      method: "POST",
    })

    toast.add({
      title: "Company record created",
      description: response.message || `${values.name || "Company"} was added successfully.`,
      color: "success",
      icon: "i-lucide-check-circle",
    })

    await navigateTo("/company")
  }
  catch (error) {
    toast.add({
      title: "Failed to create company",
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
    :title="duplicatedCompany ? 'Duplicate Company' : 'Add Company'"
    :description="duplicatedCompany ? `Create a new company using ${duplicatedCompany.name}'s record as a starting point.` : 'Create a new company record.'"
    :fields="companyFields"
    full-width
    :initial-values="initialValues"
    :submitting="isSubmitting"
    submit-label="Create Company"
    info-title="Company Add Flow"
    info-description="This form creates company records through the API."
    @cancel="navigateTo('/company')"
    @submit="submitCompany"
  />
</template>
