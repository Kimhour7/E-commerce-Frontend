<script setup lang="ts">
export interface RecordFormOption {
  label: string
  value: string
}

export interface RecordFormField {
  name: string
  label: string
  type?: "text" | "date" | "textarea" | "select"
  placeholder?: string
  options?: RecordFormOption[]
  span?: "full" | "half"
  required?: boolean
}

const props = withDefaults(defineProps<{
  title: string
  description?: string
  fields: RecordFormField[]
  submitLabel?: string
  cancelLabel?: string
  initialValues?: Record<string, string>
  infoTitle?: string
  infoDescription?: string
  fullWidth?: boolean
  submitting?: boolean
}>(), {
  submitLabel: "Submit Record",
  cancelLabel: "Cancel",
  initialValues: () => ({}),
  fullWidth: false,
  submitting: false,
})

const emit = defineEmits<{
  cancel: []
  submit: [values: Record<string, string>]
}>()

const fieldControlClass = "peer block h-14 w-full rounded-md border border-outline bg-white px-3.5 py-4 text-[15px] font-normal leading-[1.53] text-on-surface outline-none transition-[border-color,box-shadow,padding] duration-150 ease-in-out placeholder:text-transparent focus:border-primary focus:pb-2 focus:pt-[1.625rem] focus:ring-0 disabled:bg-surface-container disabled:text-on-surface-variant disabled:opacity-100"
const textAreaClass = `${fieldControlClass} h-auto min-h-32 resize-y`
const selectClass = `${fieldControlClass} cursor-pointer pb-2 pt-[1.625rem] disabled:cursor-not-allowed`
const floatedControlClass = "pb-2 pt-[1.625rem]"
const floatingLabelClass = "pointer-events-none absolute left-0 top-0 h-full origin-[0_0] px-3.5 py-4 text-[15px] leading-[1.53] text-on-surface-variant transition-[opacity,transform] duration-200 ease-in-out peer-focus:-translate-y-2 peer-focus:translate-x-[0.15rem] peer-focus:scale-[0.85] peer-focus:opacity-75"
const floatingLabelActiveClass = "-translate-y-2 translate-x-[0.15rem] scale-[0.85] opacity-75"

const values = reactive<Record<string, string>>({})

watch(
  () => [props.fields, props.initialValues] as const,
  ([fields, initialValues]) => {
    for (const field of fields) {
      values[field.name] = initialValues[field.name] ?? ""
    }
  },
  { immediate: true },
)

function submitForm() {
  emit("submit", { ...values })
}

function isFloatingLabelActive(field: RecordFormField) {
  return field.type === "select" || field.type === "date" || Boolean(values[field.name])
}
</script>

<template>
  <section class="grid grid-cols-12 gap-gutter">
    <div :class="fullWidth ? 'col-span-12' : 'col-span-12 lg:col-span-8 lg:col-start-3'">
      <div class="overflow-hidden rounded-lg bg-surface-container-lowest shadow-sneat-card">
        <div class="bg-surface-container-lowest px-6 pb-0 pt-6 sm:px-8">
          <h2 class="text-xl font-medium leading-tight text-on-surface">
            {{ title }}
          </h2>
          <p
            v-if="description"
            class="mt-1 text-[15px] text-on-surface-variant"
          >
            {{ description }}
          </p>
        </div>

        <form
          class="space-y-6 p-6 sm:p-8 sm:pt-6"
          @submit.prevent="submitForm"
        >
          <div class="grid grid-cols-1 gap-x-gutter gap-y-4 md:grid-cols-2">
            <div
              v-for="field in fields"
              :key="field.name"
              :class="field.span === 'full' ? 'md:col-span-2' : ''"
              class="relative"
            >
              <label
                :for="field.name"
                :class="[
                  floatingLabelClass,
                  isFloatingLabelActive(field) ? floatingLabelActiveClass : '',
                ]"
              >
                {{ field.label }}<span
                  v-if="field.required"
                  class="text-error"
                > *</span>
              </label>

              <textarea
                v-if="field.type === 'textarea'"
                :id="field.name"
                v-model="values[field.name]"
                :name="field.name"
                placeholder=" "
                :required="field.required"
                rows="5"
                :disabled="submitting"
                :class="[
                  textAreaClass,
                  isFloatingLabelActive(field) ? floatedControlClass : '',
                ]"
              />

              <select
                v-else-if="field.type === 'select'"
                :id="field.name"
                v-model="values[field.name]"
                :name="field.name"
                :required="field.required"
                :disabled="submitting"
                :class="selectClass"
              >
                <option
                  value=""
                  disabled
                >
                  {{ field.placeholder || "Select an option..." }}
                </option>
                <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

              <input
                v-else
                :id="field.name"
                v-model="values[field.name]"
                :name="field.name"
                placeholder=" "
                :required="field.required"
                :type="field.type || 'text'"
                :disabled="submitting"
                :class="[
                  fieldControlClass,
                  isFloatingLabelActive(field) ? floatedControlClass : '',
                ]"
              >
            </div>
          </div>

          <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center">
            <UButton
              class="justify-center px-5"
              color="neutral"
              :disabled="submitting"
              :label="cancelLabel"
              size="md"
              type="button"
              variant="outline"
              @click="emit('cancel')"
            />
            <UButton
              class="justify-center px-5 shadow-sneat-primary"
              icon="i-lucide-check"
              :label="submitLabel"
              :loading="submitting"
              size="md"
              type="submit"
            />
          </div>
        </form>
      </div>

      <div
        v-if="infoTitle || infoDescription"
        class="mt-6 flex items-start gap-3 rounded-lg bg-primary-container/60 p-4 shadow-sneat-card"
      >
        <UIcon
          name="i-lucide-info"
          class="mt-0.5 size-5 shrink-0 text-primary"
        />
        <div>
          <p
            v-if="infoTitle"
            class="text-sm font-semibold text-primary"
          >
            {{ infoTitle }}
          </p>
          <p
            v-if="infoDescription"
            class="text-sm text-secondary"
          >
            {{ infoDescription }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
