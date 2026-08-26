<script setup lang="ts">
export interface PageBreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: PageBreadcrumbItem[]
}>()
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="mb-5 flex items-center gap-2 text-[13px] font-medium text-on-surface-variant"
  >
    <template
      v-for="(item, index) in items"
      :key="`${item.label}-${index}`"
    >
      <NuxtLink
        v-if="item.to && index < items.length - 1"
        :to="item.to"
        class="transition-colors hover:text-primary"
      >
        {{ item.label }}
      </NuxtLink>
      <span
        v-else
        class="text-on-surface-variant/80"
      >
        {{ item.label }}
      </span>

      <UIcon
        v-if="index < items.length - 1"
        name="i-lucide-chevron-right"
        class="size-4 text-on-surface-variant/70"
      />
    </template>
  </nav>
</template>
