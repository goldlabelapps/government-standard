# Accessible Starter Template

A bare-metal, production-grade frontend starter designed to enforce UK public sector digital service standards. It provides an accessible, progressive-enhancement baseline compliant with WCAG 2.2 Level AA, semantic HTML5, and strict Content Security Policies (CSP).

---

## 1. Quickstart and local preview

You can preview the baseline immediately using any standard static file server:

```bash
# Option A: Python 3 built-in HTTP server
python3 -m http.server 3000 --directory template

# Option B: Node.js serve
npx serve template -l 3000
```

Open `http://localhost:3000` in your browser. Verify the initial state:
- Press the `Tab` key immediately after page load to confirm the skip-to-content link reveals itself.
- Test keyboard navigation across all interactive elements (skip link, input, select, and submit button).
- Disable JavaScript in your browser settings to verify that the core document structure and styling render without degradation.

---

## 2. Architectural anatomy

The template enforces strict landmark hierarchy, accessible forms, and defensive styling:

### A. Skip-to-content navigation (`.gov-skip-link`)
- **Location:** Immediate first child element inside `<body>`.
- **Target:** Directly references `<main id="main-content">`.
- **Behaviour:** Remains visually hidden off-screen until focused via keyboard navigation, at which point it displays a high-contrast focus indicator (`#ffdd00` background with a 3px black outline).

### B. Semantic landmark hierarchy
- **Banner landmark:** `<header role="banner" class="gov-header">` encapsulates the organisation brand mark, service title, and phase tag (`ALPHA`, `BETA`, or `LIVE`).
- **Main landmark:** `<main id="main-content" role="main" class="gov-main">` wraps primary page content using a responsive 2-column or two-thirds grid layout (`.gov-column-two-thirds`).
- **Contentinfo landmark:** `<footer role="contentinfo" class="gov-footer">` provides licensing metadata, Crown copyright attribution, and links to the Open Government Licence (OGL v3.0).

### C. Accessible form architecture
- **Groupings:** Form controls are grouped within a `<fieldset>` with an accessible `<legend>`.
- **Field hints:** Supplementary guidance uses `.gov-hint` bound to inputs via `aria-describedby="compliance-hint"`.
- **Explicit labels:** Every input declares a `<label for="field-id">` matching its input `id`. Placeholder text is never used as an alternative to labels.
- **Touch target geometry:** Interactive elements (`.gov-button`, `.gov-input`, `.gov-select`) maintain a minimum touch bounding box of 44x44 CSS px to satisfy WCAG 2.2 Success Criterion 2.5.8.

### D. Asynchronous status regions
- **Screen reader announcements:** Dynamic submission outcomes are injected into `<div id="status-region" aria-live="polite">`, allowing assistive technology to announce results without interrupting active speech synthesizers.

---

## 3. Real-world integration patterns

### Pattern 1: Server-rendered web applications (Express, Django, Flask, Rails, Laravel, Go)

When adopting the template within a server-rendered web application:

1. **Asset routing:**
   Copy `styles.css` into your application's public asset directory (for example, `public/css/styles.css`). Ensure brand assets from `assets/govmint/` are served from your public root (for example, `/assets/govmint/`). Update asset reference paths in your master layout:
   ```html
   <link rel="stylesheet" href="/css/styles.css">
   <link rel="icon" type="image/svg+xml" href="/assets/govmint/favicon.svg">
   ```

2. **Master layout extraction:**
   Extract the outer shell into your framework template (such as Jinja2, Blade, ERB, or EJS):
   - Keep the skip link, header, main landmark container, and footer in `base.html`.
   - Render page-specific content within child blocks inside `<main id="main-content">`.

3. **Server-side form handling (Progressive enhancement baseline):**
   Update the form to support direct HTTP POST submissions before introducing client-side JavaScript:
   ```html
   <form class="gov-form" method="POST" action="/verify" novalidate id="compliance-form">
     <!-- Include CSRF token as mandated by server controls -->
     <input type="hidden" name="csrf_token" value="{{ csrf_token }}">
     ...
   </form>
   ```
   If JavaScript fails to load or is disabled by the user, the browser performs a standard POST request. The server validates input, renders errors using standard server templates, and returns the response.

### Pattern 2: Component-based modern frameworks (Next.js, React, Vue, SvelteKit, Astro)

When converting this baseline into modular frontend components:

1. **Retain semantic HTML elements:**
   Do not replace semantic landmarks (`<header>`, `<main>`, `<footer>`, `<fieldset>`, `<legend>`) with generic `<div>` wrappers. Doing so destroys assistive technology accessibility trees.

2. **Component breakdown structure:**
   ```text
   components/
   ├── layout/
   │   ├── SkipLink.tsx        # Accessible skip navigation anchor
   │   ├── Header.tsx          # Banner landmark with logo and phase tag
   │   ├── Footer.tsx          # Contentinfo landmark with OGL crest
   │   └── Layout.tsx          # Root container wrapping children in <main>
   └── form/
       ├── FormField.tsx       # Label, hint, input, and error message
       └── StatusRegion.tsx    # Live aria region container
   ```

3. **Server components and hydration:**
   In Next.js App Router, keep layout and static presentation as React Server Components. Isolate client-side event listeners (`app.js` logic) to dedicated client components using `'use client'` only where interactive event binding is strictly required.

---

## 4. Defensive security and Content Security Policy (CSP)

Public sector digital services require strict HTTP headers to prevent Cross-Site Scripting (XSS), clickjacking, and content sniffing.

### Production CSP header contract

Deliver this template with the following Content Security Policy:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
```

### Scripting invariants
- **Zero inline event handlers:** Never use `onclick`, `onsubmit`, or `javascript:` URLs in markup.
- **Zero dynamic code execution:** Do not call `eval()` or use `new Function()`.
- **Safe DOM manipulation:** When updating the live status region, sanitise all user input using text node conversion (as implemented in `app.js` via `escapeHtml` or `element.textContent`) to eliminate DOM-based XSS vulnerabilities.

---

## 5. Automated verification battery

Under Control `GS-AI-CODE-02`, code must be verified with automated tools rather than relying on assertions. Run this verification battery locally before submitting pull requests:

### Step 1: Automated accessibility testing (`axe-core` & `pa11y-ci`)
```bash
# Run headless accessibility scan
npx @axe-core/cli http://localhost:3000

# Run pa11y with a zero-threshold policy
npx pa11y-ci --threshold 0 http://localhost:3000
```

### Step 2: W3C HTML5 markup validation
```bash
curl -s http://localhost:3000 | npx html-validate --stdin
```

### Step 3: Keyboard and focus assertions (Playwright)
Ensure focus navigation, skip-to-content links, and 44x44 CSS px touch targets are verified automatically. Refer to [Frontend Verification Profile](../docs/verification/frontend.md) for full test specifications.

### Step 4: Repository security checks
Run the repository verification CLI to confirm secret hygiene and internal reference integrity:
```bash
make verify
```

---

## 6. Pre-production launch checklist

Before releasing a service derived from this template, confirm:

- [ ] Skip link is visible and functional on initial keyboard `Tab` press.
- [ ] Every input has an explicitly associated `<label>` using the `for` attribute.
- [ ] All interactive buttons and controls measure at least 44x44 CSS px.
- [ ] High-contrast focus indicators (`:focus-visible`) are active and clearly visible.
- [ ] Form works reliably with client-side JavaScript disabled.
- [ ] Production CSP header is configured with zero `unsafe-inline` or `unsafe-eval` directives.
- [ ] Zero WCAG 2.2 AA violations reported by `axe-core` or `pa11y-ci`.
- [ ] Brand assets and Open Government Licence attributions are present and accurate.
