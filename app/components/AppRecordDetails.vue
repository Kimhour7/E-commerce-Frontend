<script setup lang="ts">
export interface RecordDetailItem {
  label: string
  value: string
}

const props = defineProps<{
  title: string
  description: string
  details: RecordDetailItem[]
  editTo?: string
  editLabel?: string
  deleteLabel?: string
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()

function handleEdit() {
  if (!props.editTo) {
    emit("edit")
  }
}
</script>

<template>
  <div class="space-y-6">
    <section class="flex flex-col gap-5 pt-2 lg:flex-row lg:items-center lg:justify-between">
      <div class="min-w-0">
        <h2 class="break-words text-[32px] font-semibold leading-tight tracking-normal text-on-surface">
          {{ title }}
        </h2>
        <p class="mt-1 break-words text-[15px] text-on-surface-variant">
          {{ description }}
        </p>
      </div>

      <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
        <UButton
          class="h-11 justify-center px-5 text-sm font-semibold"
          color="neutral"
          icon="i-lucide-pencil"
          :label="editLabel || 'Edit'"
          size="lg"
          :to="editTo"
          variant="outline"
          @click="handleEdit"
        />
        <UButton
          class="h-11 justify-center px-5 text-sm font-semibold"
          color="error"
          icon="i-lucide-trash-2"
          :label="deleteLabel || 'Delete'"
          size="lg"
          variant="solid"
          @click="emit('delete')"
        />
      </div>
    </section>

    <section class="overflow-hidden rounded-lg bg-surface-container-lowest shadow-sneat-card">
      <dl class="grid grid-cols-1 divide-y divide-outline-variant md:grid-cols-2 md:divide-x md:divide-y-0">
        <div
          v-for="item in details"
          :key="item.label"
          class="min-w-0 px-6 py-5"
        >
          <dt class="text-xs font-semibold uppercase tracking-wide text-on-surface-variant/85">
            {{ item.label }}
          </dt>
          <dd class="mt-2 min-w-0 break-words text-[15px] font-semibold text-on-surface [overflow-wrap:anywhere]">
            {{ item.value }}
          </dd>
        </div>
      </dl>
    </section>
  </div>
</template>
