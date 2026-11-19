import { defineConfig } from 'astro/config';
import tailwind from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";
import netlify from "@astrojs/netlify";
import sentry from "@sentry/astro/integration";
import swup from '@swup/astro';

const SENTRY_DSN = import.meta.env.SENTRY_DSN;
const SENTRY_AUTH_TOKEN = import.meta.env.SENTRY_AUTH_TOKEN;
const SENTRY_PROJECT = import.meta.env.SENTRY_PROJECT;

const integrations = [
  // This entrypoint file is where Alpine plugins are registered.
  alpinejs({ entrypoint: '/src/entrypoint' }),
  swup()
]

// To enable Sentry monitoring, add the following environment variables.
// Learn more at https://docs.sentry.io/platforms/javascript/guides/astro/#prerequisites.
if (SENTRY_DSN && SENTRY_AUTH_TOKEN && SENTRY_PROJECT) {
  integrations.push(sentry({
    authToken: SENTRY_AUTH_TOKEN,
    project: SENTRY_PROJECT
  }));
}

// https://astro.build/config
export default defineConfig({
  integrations,
  output: "server",
  adapter: netlify({
    devFeatures: { images: true, environmentVariables: false, edgeFunctions: false },
  }),
  compressHTML: true,
  vite: {
    plugins: [tailwind()],
    define: {
      'import.meta.env.PUBLIC_SENTRY_DSN': JSON.stringify(SENTRY_DSN || ''),
    },
  },
  prefetch: true
});