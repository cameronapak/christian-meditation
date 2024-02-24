/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import * as htmx from 'htmx.org';

declare global {
  interface Window {
    Alpine: import('alpinejs').Alpine;
    htmx: typeof htmx;
  }
}

// https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript
interface ImportMetaEnv {
  /** https://docs.sentry.io/platforms/javascript/guides/astro/#configure */
  readonly SENTRY_DSN: string;
  /** https://docs.sentry.io/platforms/javascript/guides/astro/#configure */
  readonly SENTRY_AUTH_TOKEN: string;
  /** https://docs.sentry.io/platforms/javascript/guides/astro/#configure */
  readonly SENTRY_PROJECT: string;
  /** Christian Meditation App Baserow.io API key */
  readonly BASEROW_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
