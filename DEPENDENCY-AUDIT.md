# Dependency advisory remediation

## Method and results

Scanned `package-lock.json` before and after `npm audit fix` (without `--force`).
OSV Scanner 2.7.1 used `scan source --lockfile package-lock.json --format json`.
OSV counts below deduplicate by package name and advisory ID, including duplicate
installed versions only once. npm counts affected packages, including parent
packages affected through their dependencies, so its totals differ from OSV.

| Scanner | High before / after | Medium before / after | Low before / after | Critical |
| --- | --- | --- | --- | --- |
| OSV | 20 / 1 | 12 / 3 | 3 / 1 | 0 / 0 |
| npm audit | 19 / 7 | 16 / 12 | 1 / 0 | 0 / 0 |

All 35 baseline OSV package/advisory pairs are transitive. npm also flags the
direct dependencies `@astrojs/netlify`, `@swup/astro`, and
`@tailwindcss/typography` because of their transitive dependencies; there is no
separate advisory against those three direct packages in this scan.

## Baseline inventory and changes

H/M/L counts are advisory counts from OSV, not npm's highest severity per package.
"Prod" means installed by the production dependency graph according to the
lockfile, **not** confirmed execution in deployed application code. Most of these
packages serve build/development tooling despite being production dependencies
of integrations. This is not an exhaustive exploitability/reachability audit.

| Transitive package | H/M/L | Installation / purpose | Vulnerable version(s) -> installed fix |
| --- | --- | --- | --- |
| `@babel/core` | 0/0/1 | Prod / compiler tooling | 7.23.9 -> 7.29.13 |
| `@babel/helpers` | 0/1/0 | Prod / compiler tooling | 7.23.9 -> 7.29.14 |
| `@babel/plugin-transform-modules-systemjs` | 1/0/0 | Prod / compiler tooling | 7.23.9 -> 7.29.8 |
| `@babel/runtime` | 0/1/0 | Prod / helpers used by Babel tooling dependencies | 7.23.9 -> 7.29.14 |
| `brace-expansion` | 5/2/1 | Prod / build/dev globbing | 1.1.11, 2.0.1 -> 1.1.22, 2.1.8 |
| `browserslist` | 2/0/0 | Prod / browser-target build tooling | 4.23.0 -> 4.29.6 |
| `colord` | 0/1/0 | Prod / CSS optimizer | 2.9.3 -> 2.14.0 |
| `cross-spawn` | 1/0/0 | Prod / tooling process launcher | 7.0.3 -> 7.0.6 |
| `ejs` | 0/1/0 | Prod / Microbundle worker template tooling | 3.1.9 -> 3.1.10 |
| `glob` | 0/1/0 | Prod / Netlify dev/function packaging | 13.0.7 remains; see below |
| `minimatch` | 3/1/0 | Prod / build/dev globbing | 3.1.2, 5.1.6 -> 3.1.5, 5.1.9; 10.2.6 remains |
| `path-to-regexp` | 1/0/0 | Prod / Swup browser routing | 6.2.1 -> 6.3.0 |
| `picomatch` | 1/1/0 | Prod / build/dev globbing | 2.3.1 -> 2.3.2 |
| `postcss-selector-parser` | 0/1/0 | Dev-only Typography copy; Prod CSS tooling copy | 6.0.15 -> 6.1.6; pinned 6.0.10 remains |
| `rollup` | 2/0/0 | Prod / bundling tooling | 2.79.1, 4.12.0 -> 2.80.0, 4.68.7 |
| `serialize-javascript` | 1/0/1 | Prod / inherited Microbundle build tool | 4.0.0 remains; see below |
| `svgo` | 3/1/0 | Prod / SVG build optimizer | 2.8.0 -> 2.8.4 |
| `yaml` | 0/1/0 | Prod / CSS/build configuration parsers | 1.10.2 -> 1.10.3 |

The current direct dependencies are already at their latest published versions,
except TypeScript 7, which is outside `@astrojs/check`'s supported TypeScript 5/6
peer range and is not implicated in these advisories. No direct dependency
changes or overrides were necessary for the compatible updates. In particular,
no override was added across an upstream exact pin or incompatible major range.

## Every remaining advisory

| Package | OSV severity | Advisory | Reason left |
| --- | --- | --- | --- |
| `glob@13.0.7` | Medium | [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4): cancellation bypass | Netlify's pinned `@vercel/nft@1.3.1` requires `glob ^13.0.0`; first patched version is 14.0.2, outside that range. No compatible 13.x patch published. |
| `minimatch@10.2.6` | Medium | [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249): globparts amplification DoS | Netlify packaging, glob 13, and readdir-glob require 10.x; patched 11.0.1 is outside their ranges. No compatible 10.x patch published. |
| `postcss-selector-parser@6.0.10` | Medium | [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf): quadratic selector parsing | Latest `@tailwindcss/typography@0.5.20` pins exactly 6.0.10. Patched 6.1.5+ is the same major but does not satisfy that exact requirement. This copy is dev-only. |
| `serialize-javascript@4.0.0` | High | [GHSA-5c6j-r48x-rmvq](https://github.com/advisories/GHSA-5c6j-r48x-rmvq): RCE via RegExp/Date serialization | Swup's older plugin dependencies include Microbundle -> rollup-plugin-terser -> serialize-javascript `^4.0.0`. Patched 7.0.3 is outside that range; no compatible 4.x patch published. |
| `serialize-javascript@4.0.0` | Low | [GHSA-m5mm-p8h7-m29v](https://github.com/advisories/GHSA-m5mm-p8h7-m29v): serialized-function XSS | Same tooling chain; first patched version is 7.1.3, outside `^4.0.0`. |

The Netlify findings are inherited development/function-packaging dependencies,
not direct imports in the app's request handlers. The serializer is a dependency
of Microbundle's Terser plugin; Swup's published browser plugin entrypoint does
not import Microbundle. Those facts are not grounds to suppress the advisories:
these packages remain installed in the production dependency graph.

`npm audit fix --force` proposes major adapter/integration downgrades. These were
not applied. Resolving the remaining findings requires upstream releases that
relax/update these constraints, or a separately approved out-of-range override
or integration replacement; none meets this task's compatible-override rule.

## Verification artifacts

- Baseline and final npm/OSV JSON: `~/shots/cm-vulns-{before,after}-{npm,osv}.json`.
- Final clean-install build log: `~/shots/cm-vulns-build.log`.
- Full-page fixture screenshots: `~/shots/cm-vulns-{before,after}-*.png`.
- Route/console records: `~/shots/cm-vulns-{before,after}-results.json`.
- Fixture data and browser scripts are outside the repository; no secrets or
  production data are required for these comparisons.
