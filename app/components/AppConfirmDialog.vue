<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  description: string
  cancelLabel?: string
  confirmLabel?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cancelLabel: "Cancel",
  confirmLabel: "Delete",
  loading: false,
})

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  confirm: []
  cancel: []
}>()

function close() {
  if (props.loading) return
  emit("update:modelValue", false)
  emit("cancel")
}

function confirm() {
  emit("confirm")
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="close"
        />

        <!-- Dialog -->
        <div
          class="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
          role="alertdialog"
          aria-modal="true"
        >
          <!-- Icon with concentric rings -->
          <div class="mb-6 flex items-center justify-center">
            <div class="relative flex h-24 w-24 items-center justify-center">
              <div class="absolute h-24 w-24 rounded-full bg-red-500/5" />
              <div class="absolute h-16 w-16 rounded-full bg-red-500/10" />
              <div class="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-500 bg-white">
                <UIcon name="i-lucide-info" class="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>

          <!-- Text -->
          <div class="mb-8 text-center">
            <h3 class="mb-2 text-xl font-bold text-gray-900">
              {{ title }}
            </h3>
            <p class="text-sm leading-relaxed text-gray-500">
              {{ description }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              type="button"
              :disabled="loading"
              class="flex-1 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              @click="close"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              :disabled="loading"
              class="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              @click="confirm"
            >
              <UIcon
                v-if="loading"
                name="i-lucide-loader-2"
                class="h-4 w-4 animate-spin"
              />
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}
</style>