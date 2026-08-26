<script setup lang="ts">
import type { RecordDetailItem } from "~/components/AppRecordDetails.vue"

const route = useRoute()
const toast = useToast()
const { users, deleteUserRecord } = useUserRecords()

const userId = computed(() => Number(route.params.id))
const user = computed(() => users.value.find(item => item.id === userId.value) ?? users.value[0])

definePageMeta({
  breadcrumbs: [
    { label: "Users", to: "/" },
    { label: "Record Details" },
  ],
})

const userDetails = computed<RecordDetailItem[]>(() => [
  { label: "Name", value: user.value.name },
  { label: "Email", value: user.value.email },
  { label: "Role", value: user.value.role },
  { label: "Status", value: user.value.status },
  { label: "Joined Date", value: user.value.joinedDate },
  { label: "Notes", value: user.value.notes || "No notes added" },
  { label: "Record ID", value: String(user.value.id) },
])

function deleteUser() {
  deleteUserRecord(user.value.id)
  toast.add({
    title: "Delete selected",
    description: `${user.value.name} was selected for deletion.`,
    color: "error",
    icon: "i-lucide-trash-2",
  })
  navigateTo("/")
}
</script>

<template>
  <AppRecordDetails
    title="Record Details"
    :description="`Reviewing the specific entry data for ${user.name}.`"
    :details="userDetails"
    :edit-to="`/users/${user.id}/edit`"
    @delete="deleteUser"
  />
</template>
