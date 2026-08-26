export interface UserProfile {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  phone: string
  user_role: string
  working_company_id: string
  working_branch_id: string
  created_at: string
  updated_at: string
}

export function useAuth() {
  const user = useState<UserProfile | null>("auth-user", () => null)

  async function fetchUser(token?: string) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await useApiRequest<{ success: boolean; data: UserProfile; message: string }>("/me", { 
        method: "GET",
        headers 
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
