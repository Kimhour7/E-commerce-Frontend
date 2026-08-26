<script setup lang="ts">
import type { DataTableColumn, DataTableRow } from "~/components/AppDataTable.vue"

definePageMeta({
  breadcrumbs: [
    { label: "Products" },
  ],
})

interface ProductTableRow extends DataTableRow {
  id: number
  name: string
  sku: string
  category: string
  status: string
  updated: string
}

const columns: DataTableColumn[] = [
  { key: "name", label: "Product" },
  { key: "sku", label: "SKU", type: "mono" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status", type: "badge" },
  { key: "updated", label: "Updated", align: "right", type: "mono" },
]

const products: ProductTableRow[] = [
  {
    id: 1,
    name: "Express Delivery Box",
    sku: "PRD-1001",
    category: "Packaging",
    status: "Active",
    updated: "2026-07-18",
  },
  {
    id: 2,
    name: "Cold Chain Pouch",
    sku: "PRD-1002",
    category: "Temperature Control",
    status: "Active",
    updated: "2026-07-20",
  },
  {
    id: 3,
    name: "Return Label Pack",
    sku: "PRD-1003",
    category: "Documents",
    status: "Draft",
    updated: "2026-07-21",
  },
]
</script>

<template>
  <div class="space-y-6">
    <section class="pt-2 sm:pt-4">
      <h2 class="mb-2 text-[28px] font-bold leading-tight tracking-tight text-on-surface">
        Product Management
      </h2>
      <p class="text-base text-on-surface-variant">
        View product records and add new delivery catalog items.
      </p>
    </section>

    <AppDataTable
      add-label="Add Product"
      add-to="/products/add"
      :columns="columns"
      :rows="products"
      search-placeholder="Search products by name or SKU..."
      title="Products"
    />
  </div>
</template>
