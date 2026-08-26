<script setup lang="ts">
definePageMeta({
  layout: false,
})

import { useApiRequest } from "~/composables/useApiFetch"

const credentials = reactive({
  login: "",
  password: "",
  remember: false,
})

const route = useRoute()
const errorMessage = ref<string | null>(null)

const showPassword = ref(false)
const submitting = ref(false)

async function submitLogin() {
  submitting.value = true

  try {
    errorMessage.value = null

    console.debug("Credentials at submit:", {
      login: credentials.login,
      password: credentials.password,
      loginEmpty: !credentials.login,
      passwordEmpty: !credentials.password,
    })

    const formData = new FormData()
    formData.append("username", credentials.login)
    formData.append("password", credentials.password)

    let res: any = null
    try {
      // debug: log payload being sent
      // eslint-disable-next-line no-console
      console.debug("Login payload sent as FormData:", { username: credentials.login })
      res = await useApiRequest<any>("/login", { method: "POST", body: formData })
    } catch (e: any) {
      // If backend returns validation errors (422), surface them
      const data = e?.data || e?.response?.data || e?.body || null
      const status = e?.status || e?.statusCode || e?.response?.status || null
      // eslint-disable-next-line no-console
      console.warn("Login attempt failed", { status, data })

      if (status === 422 || (data && (data.detail || data.errors || data.message))) {
        // prefer a clear message from backend
        let msg = data?.detail || data?.message || (Array.isArray(data?.errors) ? JSON.stringify(data.errors) : null) || "Validation error"
        if (Array.isArray(msg) && msg.length > 0 && msg[0].msg) {
          msg = msg[0].msg // usually FastAPI returns [{loc, msg, type}] for 422
        }
        errorMessage.value = String(msg)
      }
      res = null
    }

    if (res && (res.access_token || res.token)) {
      const tokenVal = res.access_token || res.token
      const refreshVal = res.refresh_token || res.refreshToken || null
      const tokenType = res.token_type || res.tokenType || "bearer"

      const maxAge = credentials.remember ? 60 * 60 * 24 * 30 : undefined // 30 days or session
      const accessCookie = useCookie("access_token", { maxAge })
      const refreshCookie = useCookie("refresh_token", { maxAge })

      accessCookie.value = tokenVal
      if (refreshVal) refreshCookie.value = refreshVal

      const typeCookie = useCookie("token_type")
      typeCookie.value = tokenType

      // Fetch the user's profile and role now that we have the token
      const { fetchUser } = useAuth()
      await fetchUser(tokenVal)

      // redirect back if present
      const redirect = (route.query.redirect as string) || "/"
      await navigateTo(redirect)
    } else {
      errorMessage.value = "Invalid username or password"
      // eslint-disable-next-line no-console
      console.error("Login failed, response:", res)
    }
  } catch (err) {
    errorMessage.value = "Network or server error"
    // eslint-disable-next-line no-console
    console.error("Login error", err)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-on-background sm:px-6">
    <section class="w-full max-w-[400px]">
      <div class="rounded-lg bg-surface-container-lowest shadow-sneat-card">
        <div class="p-6 sm:p-8">
          <NuxtLink
            to="/"
            class="mb-10 flex items-center justify-center gap-2 text-on-surface"
          >
            <span class="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-on-primary shadow-sneat-primary">
              DC
            </span>
            <span class="text-2xl font-semibold leading-none text-primary">
              AdminConsole
            </span>
          </NuxtLink>

          <div class="mb-6">
            <h1 class="text-2xl font-medium leading-snug text-on-surface">
              Welcome to AdminConsole
            </h1>
            <p class="mt-1 text-[15px] text-on-surface-variant">
              Please sign in to your account and continue managing records.
            </p>
          </div>

          <form
            class="space-y-4"
            @submit.prevent="submitLogin"
          >
            <p v-if="errorMessage" class="text-sm text-danger">{{ errorMessage }}</p>
            <div>
              <label
                for="login"
                class="mb-2 block text-[15px] font-normal text-on-surface"
              >
                Email or Username
              </label>
              <input
                id="login"
                v-model="credentials.login"
                autocomplete="username"
                autofocus
                class="block w-full rounded-md border border-outline bg-white px-3.5 py-2 text-[15px] font-normal leading-[1.53] text-on-surface outline-none transition-[border-color,box-shadow] duration-150 ease-in-out placeholder:text-[#b4bdc6] focus:border-primary focus:ring-0 disabled:bg-surface-container disabled:text-on-surface-variant disabled:opacity-100"
                name="login"
                placeholder="Enter your email or username"
                required
                type="text"
                :disabled="submitting"
              >
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between gap-3">
                <label
                  for="password"
                  class="block text-[15px] font-normal text-on-surface"
                >
                  Password
                </label>
                <NuxtLink
                  to="/forgot-password"
                  class="text-[13px] font-normal text-primary hover:text-primary/80"
                >
                  Forgot Password?
                </NuxtLink>
              </div>
              <div class="flex rounded-md border border-outline bg-white focus-within:border-primary">
                <input
                  id="password"
                  v-model="credentials.password"
                  autocomplete="current-password"
                  class="min-w-0 flex-1 rounded-l-md border-0 bg-transparent px-3.5 py-2 text-[15px] font-normal leading-[1.53] text-on-surface outline-none placeholder:text-[#b4bdc6] focus:ring-0 disabled:text-on-surface-variant disabled:opacity-100"
                  name="password"
                  placeholder="............"
                  required
                  :type="showPassword ? 'text' : 'password'"
                  :disabled="submitting"
                >
                <button
                  type="button"
                  class="flex w-11 shrink-0 items-center justify-center rounded-r-md text-on-surface-variant hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="submitting"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <UIcon
                    :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    class="size-4"
                  />
                </button>
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="credentials.remember"
                class="size-4 rounded border-outline text-primary focus:ring-primary/20"
                name="remember"
                type="checkbox"
                :disabled="submitting"
              >
              <label
                for="remember-me"
                class="ml-2 text-[15px] font-normal text-on-surface-variant"
              >
                Remember Me
              </label>
            </div>

            <UButton
              block
              class="justify-center shadow-sneat-primary"
              color="primary"
              :loading="submitting"
              size="lg"
              type="submit"
            >
              Sign in
            </UButton>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>
