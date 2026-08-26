export type UserStatus = "Active" | "Inactive"

export interface UserRecord {
  id: number
  name: string
  initials: string
  email: string
  role: string
  status: UserStatus
  joinedDate: string
  notes?: string
}

const initialUsers: UserRecord[] = [
  {
    id: 1,
    name: "John Doe",
    initials: "JD",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    joinedDate: "2023-10-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    initials: "JS",
    email: "jane.smith@example.com",
    role: "Editor",
    status: "Active",
    joinedDate: "2023-11-02",
  },
  {
    id: 3,
    name: "Robert Jones",
    initials: "RJ",
    email: "robert.jones@example.com",
    role: "Viewer",
    status: "Inactive",
    joinedDate: "2024-01-20",
  },
  {
    id: 4,
    name: "Alice Lee",
    initials: "AL",
    email: "alice.lee@example.com",
    role: "Editor",
    status: "Active",
    joinedDate: "2024-02-15",
  },
]

function formatOptionValue(value: string) {
  return value
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("") || "UR"
}

function normalizeStatus(value: string): UserStatus {
  return value.toLowerCase() === "inactive" ? "Inactive" : "Active"
}

export function useUserRecords() {
  const users = useState<UserRecord[]>("user-records", () => [...initialUsers])

  function findUser(id: number) {
    return users.value.find(user => user.id === id)
  }

  function addUserRecord(values: Record<string, string>) {
    const nextId = Math.max(0, ...users.value.map(user => user.id)) + 1
    const name = values.name || "New User"

    const user: UserRecord = {
      id: nextId,
      name,
      initials: getInitials(name),
      email: values.email || "",
      role: formatOptionValue(values.role || "viewer"),
      status: normalizeStatus(values.status || "active"),
      joinedDate: values.joinedDate || new Date().toISOString().slice(0, 10),
      notes: values.notes || "",
    }

    users.value = [...users.value, user]
    return user
  }

  function updateUserRecord(id: number, values: Record<string, string>) {
    let updatedUser: UserRecord | undefined

    users.value = users.value.map((user) => {
      if (user.id !== id) {
        return user
      }

      updatedUser = {
        ...user,
        name: values.name || user.name,
        initials: getInitials(values.name || user.name),
        email: values.email || user.email,
        role: formatOptionValue(values.role || user.role),
        status: normalizeStatus(values.status || user.status),
        joinedDate: values.joinedDate || user.joinedDate,
        notes: values.notes || user.notes || "",
      }

      return updatedUser
    })

    return updatedUser
  }

  function deleteUserRecord(id: number) {
    users.value = users.value.filter(user => user.id !== id)
  }

  return {
    users,
    findUser,
    addUserRecord,
    updateUserRecord,
    deleteUserRecord,
  }
}
