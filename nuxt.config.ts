// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
  ],
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    // eslint-disable-next-line node/no-process-env
    apiUrl: process.env.API_URL || "http://localhost:8000/api",
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",

  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },

    proxy: {
      "/api/proxy/": {
        target: "http://localhost:8000",
        changeOrigin: true,
        pathRewrite: {
          "^/api/proxy": "", // Remove /api/proxy prefix when forwarding to backend
        },
      },
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  fonts: {
    provider: "none",
  },
});
