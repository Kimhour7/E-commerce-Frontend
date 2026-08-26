<script setup lang="ts">
import type { RecordFormField } from "~/components/AppRecordForm.vue"

const route = useRoute()
const toast = useToast()
const { users, updateUserRecord } = useUserRecords()

const userId = computed(() => Number(route.params.id))
const user = computed(() => users.value.find(item => item.id === userId.value) ?? users.value[0])

definePageMeta({
  breadcrumbs: [
    { label: "Users", to: "/" },
    { label: "Edit Record" },
  ],
})

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

const initialValues = computed<Record<string, string>>(() => ({
  name: user.value.name,
  email: user.value.email,
  role: user.value.role.toLowerCase(),
  status: user.value.status.toLowerCase(),
  joinedDate: user.value.joinedDate,
  notes: user.value.notes || "",
}))

function updateUser(values: Record<string, string>) {
  const updatedUser = updateUserRecord(user.value.id, values)

  toast.add({
    title: "User record updated",
    description: `${updatedUser?.name || user.value.name} was updated with the new data.`,
    color: "success",
    icon: "i-lucide-check-circle",
  })

  navigateTo(`/users/${user.value.id}`)
}
</script>

<template>
  <AppRecordForm
    title="Edit User"
    :description="`Update this user record for the management workspace.`"
    :fields="userFields"
    full-width
    :initial-values="initialValues"
    submit-label="Update User"
    info-title="Core Edit Flow"
    info-description="This edit screen reuses the shared core form while loading the selected record values."
    @cancel="navigateTo(`/users/${user.id}`)"
    @submit="updateUser"
  />
</template>
