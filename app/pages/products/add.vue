<script setup lang="ts">
import type { RecordFormField } from "~/components/AppRecordForm.vue"

definePageMeta({
  breadcrumbs: [
    { label: "Products", to: "/products" },
    { label: "Add New Record" },
  ],
})

const toast = useToast()

const productFields: RecordFormField[] = [
  {
    name: "name",
    label: "Product Name",
    placeholder: "e.g. Express Delivery Box",
    span: "full",
    required: true,
  },
  {
    name: "sku",
    label: "SKU",
    placeholder: "PRD-1004",
    required: true,
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    placeholder: "Select category...",
    required: true,
    options: [
      { label: "Packaging", value: "packaging" },
      { label: "Temperature Control", value: "temperature-control" },
      { label: "Documents", value: "documents" },
      { label: "Equipment", value: "equipment" },
    ],
  },
  {
    name: "availableDate",
    label: "Available Date",
    type: "date",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status...",
    required: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
      { label: "Archived", value: "archived" },
    ],
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Provide product specifications, handling rules, or catalog notes...",
    span: "full",
  },
]

function submitProduct(values: Record<string, string>) {
  toast.add({
    title: "Product record ready",
    description: `${values.name || "New product"} can now be connected to the save API.`,
    color: "success",
    icon: "i-lucide-check-circle",
  })
}
</script>

<template>
  <AppRecordForm
    title="Add Product"
    description="Populate the fields below to create a new product record."
    :fields="productFields"
    submit-label="Create Product"
    info-title="Product Data Integrity"
    info-description="New products use the shared core add UI, keeping entity creation consistent across the admin workspace."
    @cancel="navigateTo('/products')"
    @submit="submitProduct"
  />
</template>
