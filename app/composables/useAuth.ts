export interface UserProfile {
  id: string
  username: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  user_role: string
  working_company_id: string
  working_branch_id: string
  access_company_id: string[]
  access_branch_id: string[]
  created_at: string
  updated_at: string
}

interface CurrentUserResponse {
  success: boolean
  message: string
  data: UserProfile
}

export function useAuth() {
  const user = useState<UserProfile | null>("auth-user", () => null)

  async function fetchUser(token?: string) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await useApiRequest<CurrentUserResponse>("/me", {
        method: "GET",
        headers,
      })
      if (res && res.data) {
        user.value = res.data
      }
    } catch (e) {
      console.error("Failed to fetch user profile", e)
      user.value = null
    }
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    fetchUser,
    clearUser,
  }
}
