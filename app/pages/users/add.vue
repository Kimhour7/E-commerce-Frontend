<script setup lang="ts">
import type { RecordFormField } from "~/components/AppRecordForm.vue"

definePageMeta({
  breadcrumbs: [
    { label: "Users", to: "/" },
    { label: "Add New Record" },
  ],
})

const toast = useToast()
const route = useRoute()
const { addUserRecord, findUser } = useUserRecords()

const userFields: RecordFormField[] = [
  {
    name: "name",
    label: "Full Name",
    placeholder: "e.g. Maya Chen",
    span: "full",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "maya.chen@example.com",
    required: true,
  },
  {
    name: "role",
    label: "Role",
    type: "select",
    placeholder: "Select role...",
    required: true,
    options: [
      { label: "Admin", value: "admin" },
      { label: "Editor", value: "editor" },
      { label: "Viewer", value: "viewer" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select status...",
    required: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    name: "joinedDate",
    label: "Joined Date",
    type: "date",
    required: true,
  },
  {
    name: "notes",
    label: "Notes",
    type: "textarea",
    placeholder: "Add account setup notes or access context...",
    span: "full",
  },
]

const duplicatedUser = computed(() => {
  const duplicateFrom = Number(route.query.duplicateFrom)

  if (!duplicateFrom) {
    return undefined
  }

  return findUser(duplicateFrom)
})

const initialValues = computed<Record<string, string>>(() => {
  if (!duplicatedUser.value) {
    return {}
  }

  return {
    name: duplicatedUser.value.name,
    email: duplicatedUser.value.email,
    role: duplicatedUser.value.role.toLowerCase(),
    status: duplicatedUser.value.status.toLowerCase(),
    joinedDate: duplicatedUser.value.joinedDate,
    notes: duplicatedUser.value.notes || "",
  }
})

function submitUser(values: Record<string, string>) {
  const user = addUserRecord(values)

  toast.add({
    title: "User record created",
    description: `${user.name} was added to the user list.`,
    color: "success",
    icon: "i-lucide-check-circle",
  })

  navigateTo(`/users/${user.id}`)
}
</script>

<template>
  <AppRecordForm
    :title="duplicatedUser ? 'Duplicate User' : 'Add User'"
    :description="duplicatedUser ? `Create a new user using ${duplicatedUser.name}'s record as a starting point.` : 'Create a new user record for the management workspace.'"
    :fields="userFields"
    full-width
    :initial-values="initialValues"
    submit-label="Create User"
    info-title="Core Add Flow"
    info-description="This form uses the shared add-record UI so future entities can reuse the same layout, validation surface, and action area."
    @cancel="navigateTo('/')"
    @submit="submitUser"
  />
</template>
