<script setup lang="ts">
export interface DataTableColumn {
  key: string
  label: string
  align?: "left" | "right"
  type?: "text" | "badge" | "mono" | "image" | "url"
  width?: string
  minWidth?: string
  maxWidth?: string
  wrap?: boolean
  truncateLength?: number
  imageAltKey?: string
  imageSize?: "sm" | "md" | "lg"
}

export interface DataTableRow {
  id: number | string
  [key: string]: unknown
}

const props = withDefaults(defineProps<{
  columns: DataTableColumn[]
  rows: DataTableRow[]
  title?: string
  addLabel?: string
  addTo?: string
  searchPlaceholder?: string
  showControls?: boolean
  viewPathPrefix?: string
  rowLabelKey?: string
}>(), {
  title: "Table Basic",
  addLabel: "Add User",
  searchPlaceholder: "Search users by name or email...",
  showControls: true,
  rowLabelKey: "name",
})

const emit = defineEmits<{
  add: []
  open: [row: DataTableRow]
  duplicate: [row: DataTableRow]
  delete: [row: DataTableRow]
}>()

const toast = useToast()
const lastTapRowId = ref<DataTableRow["id"] | null>(null)
const lastTapTime = ref(0)
const doubleTapDelayMs = 350

const actionColumn = computed(() => props.columns.find(column => column.key === "actions"))
const dataColumns = computed(() => props.columns.filter(column => column.key !== "actions"))

const imageSizeClasses = {
  sm: "h-10 w-10",
  md: "h-16 w-24",
  lg: "h-20 w-36",
}

function getCellValue(row: DataTableRow, column: DataTableColumn) {
  const value = row[column.key]
  return value == null ? "" : String(value)
}

function hasCellValue(value: string) {
  return Boolean(value && value !== "-")
}

function getDisplayValue(row: DataTableRow, column: DataTableColumn) {
  const value = getCellValue(row, column)

  if (!column.truncateLength || value.length <= column.truncateLength) {
    return value
  }

  return `${value.slice(0, column.truncateLength)}...`
}

function getImageAlt(row: DataTableRow, column: DataTableColumn) {
  if (!column.imageAltKey) {
    return getRowLabel(row)
  }

  const value = row[column.imageAltKey]
  return value == null ? getRowLabel(row) : String(value)
}

function getColumnStyle(column: DataTableColumn) {
  return {
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  }
}

function getCellClasses(column: DataTableColumn) {
  return [
    column.align === "right" ? "text-right" : "text-left",
    column.type === "mono" ? "font-mono text-[13px] text-on-surface-variant" : "text-[15px] text-on-surface-variant",
    "align-middle",
    column.wrap ? "whitespace-normal break-words leading-5" : "whitespace-nowrap",
  ]
}

function getRowLabel(row: DataTableRow) {
  const value = row[props.rowLabelKey]
  return value == null ? "Record" : String(value)
}

function getStatusBadgeClasses(value: string) {
  const normalizedValue = value.toLowerCase()

  if (normalizedValue === "active") {
    return "bg-primary-container text-primary"
  }

  if (normalizedValue === "completed") {
    return "bg-[#e8fadf] text-[#71dd37]"
  }

  if (normalizedValue === "scheduled") {
    return "bg-[#d7f5fc] text-[#03c3ec]"
  }

  if (normalizedValue === "pending" || normalizedValue === "draft") {
    return "bg-[#fff2d6] text-[#ffab00]"
  }

  if (normalizedValue === "inactive" || normalizedValue === "archived") {
    return "bg-error-container text-error"
  }

  return "bg-secondary-container text-secondary"
}

function duplicateRow(row: DataTableRow) {
  emit("duplicate", row)
  // toast.add({
  //   title: "User duplicated",
  //   description: `${row.name} is ready to duplicate.`,
  //   color: "success",
  //   icon: "i-lucide-copy",
  // })
}

function deleteRow(row: DataTableRow) {
  emit("delete", row)
  // toast.add({
  //   title: "Record deleted",
  //   description: `${getRowLabel(row)} was selected for deletion.`,
  //   color: "error",
  //   icon: "i-lucide-trash-2",
  // })
}

function addRow() {
  if (!props.addTo) {
    emit("add")
  }
}

function openRow(row: DataTableRow) {
  emit("open", row)

  if (props.viewPathPrefix) {
    navigateTo(`${props.viewPathPrefix}/${row.id}`)
  }
}

function handleRowTap(row: DataTableRow, event: PointerEvent) {
  if (event.pointerType !== "touch") {
    return
  }

  const now = Date.now()
  const isDoubleTap = lastTapRowId.value === row.id && now - lastTapTime.value <= doubleTapDelayMs

  lastTapRowId.value = row.id
  lastTapTime.value = now

  if (isDoubleTap) {
    openRow(row)
  }
}

function getRowActions(row: DataTableRow) {
  return [
    [
      {
        label: "Duplicate",
        icon: "i-lucide-copy",
        onSelect: () => duplicateRow(row),
      },
      {
        label: "Delete",
        icon: "i-lucide-trash-2",
        color: "error" as const,
        onSelect: () => deleteRow(row),
      },
    ],
  ]
}
</script>

<style scoped>
  .table-scroll::-webkit-scrollbar {
    height: 0.375rem;
    width: 0.375rem;
  }

  .table-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .table-scroll::-webkit-scrollbar-thumb {
    background-color: rgb(203, 213, 225);
    border-radius: 0.25rem;
    transition-property: background-color;
    transition-duration: 300ms;
  }

  .table-scroll::-webkit-scrollbar-thumb:hover {
    background-color: rgb(148, 163, 184);
  }
</style>

<template>
  <section class="overflow-hidden rounded-lg bg-surface-container-lowest shadow-sneat-card">
    <div class="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <h3 class="text-xl font-medium leading-tight text-on-surface">
        {{ title }}
      </h3>

      <div
        v-if="showControls"
        class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
      >
        <UInput
          aria-label="Search table"
          class="w-full sm:w-64"
          color="neutral"
          icon="i-lucide-search"
          :placeholder="searchPlaceholder"
          size="md"
          variant="outline"
        />
        <UButton
          class="justify-center"
          :to="addTo"
          icon="i-lucide-plus"
          :label="addLabel"
          size="md"
          @click="addRow"
        />
      </div>
    </div>

    <div class="overflow-x-auto table-scroll">
      <table class="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr class="bg-surface-container-lowest">
            <th
              v-for="column in dataColumns"
              :key="column.key"
              class="border-b border-outline px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
              :class="column.align === 'right' ? 'text-right' : 'text-left'"
              :style="getColumnStyle(column)"
            >
              {{ column.label }}
            </th>
            <th
              v-if="actionColumn"
              class="border-b border-outline px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant"
              :class="actionColumn.align === 'right' ? 'text-right' : 'text-left'"
            >
              {{ actionColumn.label }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-outline">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="group bg-surface-container-lowest transition-colors hover:bg-surface-container-low"
            :class="viewPathPrefix ? 'cursor-pointer' : ''"
            tabindex="0"
            @click="openRow(row)"
            @keyup.enter="openRow(row)"
            @pointerup="handleRowTap(row, $event)"
          >
            <td
              v-for="column in dataColumns"
              :key="column.key"
              class="px-6 py-3.5"
              :class="getCellClasses(column)"
              :style="getColumnStyle(column)"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getCellValue(row, column)"
              >
                <span
                  v-if="column.type === 'badge'"
                  class="inline-flex rounded px-2 py-1 text-xs font-semibold uppercase leading-none"
                  :class="getStatusBadgeClasses(getCellValue(row, column))"
                >
                  {{ getCellValue(row, column) }}
                </span>
                <img
                  v-else-if="column.type === 'image' && hasCellValue(getCellValue(row, column))"
                  :alt="getImageAlt(row, column)"
                  class="rounded-md border border-outline-variant bg-surface-container-low object-cover"
                  :class="imageSizeClasses[column.imageSize || 'md']"
                  loading="lazy"
                  :src="getCellValue(row, column)"
                >
                <div
                  v-else-if="column.type === 'image'"
                  class="flex items-center justify-center rounded-md border border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant/60"
                  :class="imageSizeClasses[column.imageSize || 'md']"
                >
                  <UIcon
                    name="i-lucide-image"
                    class="size-5"
                  />
                </div>
                <a
                  v-else-if="column.type === 'url' && hasCellValue(getCellValue(row, column))"
                  class="block max-w-full truncate font-medium text-primary hover:underline"
                  :href="getCellValue(row, column)"
                  rel="noreferrer"
                  target="_blank"
                >
                  {{ getCellValue(row, column) }}
                </a>
                <span
                  v-else
                  class="block max-w-full"
                  :class="[
                    column.key === rowLabelKey || column.key === dataColumns[0]?.key ? 'font-semibold text-on-surface' : '',
                    column.wrap || column.type === 'mono' ? '' : 'truncate',
                  ]"
                >
                  {{ getDisplayValue(row, column) }}
                </span>
              </slot>
            </td>
            <td
              v-if="actionColumn"
              class="px-6 py-3.5 text-right"
              @click.stop
              @dblclick.stop
              @pointerup.stop
            >
              <UDropdownMenu
                :items="getRowActions(row)"
                :content="{ align: 'end' }"
              >
                <template #default="{ open }">
                  <UButton
                    aria-label="Open row actions"
                    class="text-on-surface-variant transition-colors hover:text-on-surface"
                    :class="open ? 'text-on-surface' : ''"
                    color="neutral"
                    icon="i-lucide-ellipsis-vertical"
                    square
                    variant="ghost"
                  />
                </template>
              </UDropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>