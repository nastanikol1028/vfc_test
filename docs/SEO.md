# SEO and publishing

Canonical service pages use `/services/<id>/`. The four historical root service routes redirect to those pages: the portable preview, nginx configuration and static host `_redirects` contain matching 301 rules. Alias HTML files remain as a safe fallback with the destination canonical; they are excluded from sitemap. Internal links and SPA navigation resolve to canonical destinations. Verify production HTTP redirects after hosting changes: local success does not establish the public server response.

Draft privacy and consent pages use `noindex,follow` and are excluded from sitemap until their infrastructure details are approved. Downloaded draft documents have an X-Robots-Tag rule in `_headers` and nginx. Do not remove draft status or claim Russian data localisation without verified processing details.

The build prerenders the approved pages with Organization/WebSite/BreadcrumbList, social metadata and responsive images. At the owner's request, /articles/, its six publications, /cases/, /reviews/ and /service-terms/ were removed. Do not recreate these pages or add editorial/service content in response to audit checklists without an explicit user request. Preserve homepage card proportions, typography and layout. The service dropdown polish is specifically authorised.

After building, use `npm run test:seo` with preview running, as well as the existing checks. SEO tests cover canonical title/description uniqueness, sitemap, noindex documents, headings/schema, redirects, ordinary service links, mobile image selection and page overflow at 320/1280 px. Formspree is mocked or blocked during browser tests.

IndexNow has a public ownership-validation file and matching `scripts/indexnow-key.json`. After a successful deployment run `npm run indexnow`. Preview the request with `npm run indexnow -- --dry-run`. The script notifies URLs in the canonical sitemap; 200 or 202 means accepted, not indexed. This is an explicit deployment step, not a running background scheduler.

Yandex Metrika is deliberately not installed: the owner currently has no counter. Add their real counter ID only after agreeing the applicable data-processing/consent setup; do not invent an ID or load tracking silently. Prices and service conditions are described as individually agreed; payment schedules, refund promises and fixed prices must come from the company.

Assets are minified with esbuild, targeted to ES2017 and UTF-8, with content-hashed CSS/JS filenames. Unversioned fallbacks remain for older cached HTML. Header manifests configure nosniff, Referrer-Policy and cache policy; actual platform headers require live verification. Framing/HSTS policies, mail configuration, RKN, server-side upload validation and tracking integrations are not silently asserted or changed.

Separate print styles hide navigation, helper widgets and empty map regions. Form contact errors have aria-invalid, an associated live description and preserve entered data. Native dialog fallback and class-based CSS selectors improve older-engine support but do not replace real Safari/Firefox testing.
