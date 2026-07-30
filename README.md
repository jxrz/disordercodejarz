# Juan Antonio Ruiz Zavala — Portfolio

A Spanish portfolio optimized for recruiter scanning and direct contact, built as a static Astro site. The site serves two routes:

- `/` — a construction page (devkit boot console) announcing that the full site is still in assembly.
- `/portafolio/` — the preserved professional portfolio: semantic HTML, the original CSS visual system, and dependency-free classic browser JavaScript served as static assets.

Astro and Happy DOM are development-only dependencies; the production output in `dist/` is plain static files.

## Prerequisites

- **Build, checks, and tests:** Node.js `>=20.0.0` and npm `>=10.0.0`.
- **Production:** no Node.js runtime is required; the site is fully static.

## Quick start

1. Run `npm ci` once to install the development dependencies.
2. Run `npm run dev` for local development, or `npm run build` and `npm run preview` to inspect the production output.
3. Run `npm run check` before publishing. It builds the site, validates the built output, syntax-checks the classic scripts, and runs the behavior tests.

The portfolio page loads `public/portafolio/js/portfolio-data.js` and `public/portafolio/js/app.js` as classic scripts (not ES modules) through `is:inline` tags, preserving the original runtime behavior byte-for-byte.

## Update portfolio content

Use `public/portafolio/js/portfolio-data.js` as the source of truth for identity, contact details, visible professional facts, projects, and metadata values. Keep every claim aligned with the preserved DOCX or another explicit verified source.

The `routeAreas` collection drives both the screen-reader list and the decorative route labels. Each entry has a full semantic `label` and its corresponding concise `visualLabel`; update them together only in `public/portafolio/js/portfolio-data.js`.

Two static HTML fallbacks are intentional:

- Search/social metadata remains in the `<head>` of `src/pages/portafolio/index.astro` so crawlers that do not execute JavaScript receive it. `npm run check` enforces parity with the values in `portfolio-data.js`, and `app.js` also applies those values at runtime.
- The `<noscript>` CV link remains static so the document is downloadable without JavaScript. If the filename changes, update both locations as described below.

Generic interface labels and section headings stay in `src/pages/portafolio/index.astro`; they are presentation copy, not portfolio facts.

### Add a project

Add one object to the `projects` array:

```js
{
  name: "Verified project name",
  url: "https://verified-url.example/",
  description: "What was built and how.",
  role: "Verified role", // optional
  outcome: "Verified outcome without invented metrics.",
  technologies: ["Technology A", "Technology B"]
}
```

`name`, `url`, and `description` are required non-empty strings; `url` must use HTTPS. `role` and `outcome` are optional non-empty strings. `technologies` is optional and, when present, must be an array of non-empty strings. The renderer safely omits missing optional fields, rejects unsafe project-link protocols, skips entries missing required display content, and renders a neutral empty state when no usable projects remain.

The renderer automatically creates the next project entry. Do not edit `src/pages/portafolio/index.astro` or `public/portafolio/js/app.js` when adding a standard project.

### Add social profiles

LinkedIn and GitHub are intentionally absent because the source CV contains placeholders rather than URLs. After real URLs are confirmed:

1. Add a `socialLinks` array to `person` in `public/portafolio/js/portfolio-data.js`.
2. Extend `renderContact()` in `public/portafolio/js/app.js` to render those links.
3. Use `target="_blank"` behavior with `rel="noopener noreferrer"` for external destinations.

### Replace the CV

Keep the existing filename or update `person.cvPath`, the download link in the `<noscript>` block of `src/pages/portafolio/index.astro`, and the CV paths in `scripts/validate.mjs`. The CV lives at `public/portafolio/Juan_Antonio_Ruiz_Zavala_CV_Software_Automation_ES.docx` and is served from `/portafolio/`. Never modify the source document just to change website presentation.

### Verify claims against the DOCX

`npm run check` builds the site and validates files, links, metadata parity, every rendered data collection schema, safe project URLs, malformed-data rendering resilience, and user-visible interaction behavior. It does **not** automatically prove factual parity with the DOCX. Before publishing content changes, compare the site with the source document and confirm:

- name, location, email, phone, and role;
- employer, position, dates, and achievement wording;
- every number, currency, duration, and outcome;
- skill names and qualifiers, including implementation/support scope;
- degrees, institutions, dates, and language levels;
- project role, description, technologies, outcome, and destination URL;
- no placeholder or unverified social link was introduced.

## Structure

| Path | Purpose |
| --- | --- |
| `astro.config.mjs` | Static output with `trailingSlash: 'always'` |
| `src/pages/index.astro` | Root construction page (devkit boot console, links to `/portafolio/`) |
| `src/pages/portafolio/index.astro` | Portfolio page structure plus validated static metadata and no-script fallbacks |
| `public/portafolio/css/styles.css` | Visual system, responsive layout, accessibility, print, and motion |
| `public/portafolio/js/portfolio-data.js` | Source of truth for factual portfolio content and metadata values |
| `public/portafolio/js/app.js` | DOM rendering and navigation behavior |
| `public/disroderjarz.png` | Shared favicon for both routes |
| `public/portafolio/Juan_Antonio_Ruiz_Zavala_CV_Software_Automation_ES.docx` | Source-of-truth CV, served at `/portafolio/` |
| `scripts/validate.mjs` | Builds the site, then runs structural, schema, reference, and metadata-parity checks against `dist/` |
| `test/portfolio.behavior.test.mjs` | Deterministic Happy DOM rendering and interaction contracts, plus built-output smoke test |
| `package-lock.json` | Reproducible development-only dependencies |
| `PRODUCT.md` | Durable product truth and constraints |
| `DESIGN.md` | Durable visual and interaction decisions |

## Deploy

Publish the contents of `dist/` as a static site. Suitable hosts include GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any standard web server.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node runtime:** not required in production

After deployment, verify the root construction page, the email, telephone, CV download, project links, keyboard navigation, and mobile menu on the public URL. Add a canonical URL and absolute Open Graph image URL only after the final domain is known.
