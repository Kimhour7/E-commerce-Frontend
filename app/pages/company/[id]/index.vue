<script setup lang="ts">
import type { RecordDetailItem } from "~/components/AppRecordDetails.vue"

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
  data: CompanyApiItem[]
  message: string
  page: number
  size: number
  success: boolean
  total: number
  total_pages: number
}

definePageMeta({
  breadcrumbs: [
    { label: "Company", to: "/company" },
    { label: "Company Details" },
  ],
})

const route = useRoute()
const toast = useToast()

const { data: companyResponse, error, pending } = await useApiFetch<CompanyApiResponse>("/company/get")

const companyId = computed(() => String(route.params.id))
const company = computed(() => companyResponse.value?.data.find(item => item.id === companyId.value))

function displayValue(value: string | null | undefined) {
  return value || "-"
}

function displayDate(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "-"
}

const companyDetails = computed<RecordDetailItem[]>(() => {
  if (!company.value) {
    return []
  }

  return [
    { label: "ID", value: company.value.id },
    { label: "Name", value: company.value.name },
    { label: "Name LC", value: displayValue(company.value.name_lc) },
    { label: "Description", value: displayValue(company.value.description) },
    { label: "Description LC", value: displayValue(company.value.description_lc) },
    { label: "Logo", value: displayValue(company.value.logo) },
    { label: "Banner", value: displayValue(company.value.banner) },
    { label: "Phone", value: displayValue(company.value.phone) },
    { label: "Telegram", value: displayValue(company.value.telegram) },
    { label: "Email", value: displayValue(company.value.email) },
    { label: "Facebook", value: displayValue(company.value.facebook) },
    { label: "YouTube", value: displayValue(company.value.youtube) },
    { label: "Country ID", value: displayValue(company.value.country_id) },
    { label: "Province ID", value: displayValue(company.value.province_id) },
    { label: "District ID", value: displayValue(company.value.district_id) },
    { label: "Commune ID", value: displayValue(company.value.commune_id) },
    { label: "Village ID", value: displayValue(company.value.village_id) },
    { label: "Street No", value: displayValue(company.value.street_no) },
    { label: "Lat Long", value: displayValue(company.value.lat_long) },
    { label: "Status", value: company.value.record_status },
    { label: "Created By", value: displayValue(company.value.created_by) },
    { label: "Updated By", value: displayValue(company.value.updated_by) },
    { label: "Created At", value: displayDate(company.value.created_at) },
    { label: "Updated At", value: displayDate(company.value.updated_at) },
  ]
})

function deleteCompany() {
  toast.add({
    title: "Delete selected",
    description: `${company.value?.name || "Company"} was selected for deletion.`,
    color: "error",
    icon: "i-lucide-trash-2",
  })
  navigateTo("/company")
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

    <AppRecordDetails
      v-else
      title="Company Details"
      :description="`Reviewing the company record for ${company.name}.`"
      :details="companyDetails"
      :edit-to="`/company/${company.id}/edit`"
      @delete="deleteCompany"
    />
  </div>
</template>
