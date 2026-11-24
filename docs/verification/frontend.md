# Frontend verification profile and testing battery

**Status:** Implementation guidance  
**Standard reference:** [Government Standard v0.2.0](../../standard/v0.2.0.md) (Control `GS-AI-CODE-02`)  
**Applies to:** Frontend web applications, design systems, and user interfaces running locally in Docker or development environments  

This profile guides frontend engineers in verifying that web applications created or assisted by AI tools meet the rigorous standards mandated across government and public sector digital services.

---

## 1. The frontend verification problem

Generative AI coding assistants frequently output visually convincing user interfaces that fail fundamental government digital requirements. Common defects include:

- Generic container divisions (`<div>`) styled as clickable buttons without keyboard listeners or ARIA roles.
- Text with insufficient colour contrast when rendered in dark mode or dynamic themes.
- Missing or malformed skip-to-content links.
- Interactive controls smaller than the 44x44 CSS px touch target minimum.
- Form controls lacking explicit `<label>` element associations or error descriptions (`aria-describedby`).
- Total breakage when client-side JavaScript fails or is disabled.

Under control `GS-AI-CODE-02`, an AI assistant's assertion that a page is accessible or standards-compliant does not constitute evidence. Verification must be demonstrated through observable, automated, and manual test telemetry.

---

## 2. Government standard pillars

Web interfaces delivered in public sector environments must satisfy five mandatory pillars:

### A. Accessibility (WCAG 2.2 Level AA)
* **Contrast:** Minimum 4.5:1 for normal text; 3.0:1 for large typography and graphical controls.
* **Keyboard Navigation:** Every interactive element must be reachable and operable using the Tab and Enter/Space keys alone. Tab order must follow natural logical reading order.
* **Focus States:** High-visibility `:focus-visible` indicators must never be suppressed (`outline: none` is forbidden unless replaced with an equally distinct outline).
* **Touch Targets:** Interactive targets must measure at least 44x44 CSS px (WCAG 2.2 Success Criterion 2.5.8).
* **Screen Reader Semantics:** Explicit landmarks (`<header role="banner">`, `<main id="main-content">`, `<footer role="contentinfo">`, `<nav aria-label="...">`) must structure the page.

### B. Semantic HTML5 Validity
* Strict compliance with W3C HTML5 syntax.
* Correct heading hierarchy (`<h1>` followed by `<h2>`, `<h3>` without skipping levels).
* Avoidance of monolithic container wrappers or div-soup where native semantic elements (`<article>`, `<section>`, `<aside>`, `<figure>`) apply.

### C. Progressive Enhancement
* Core reading, navigation, and form submission journeys must function reliably without client-side JavaScript.
* Client-side frameworks must enhance, rather than replace, native browser capabilities.

### D. Performance and Asset Budgets
* First Contentful Paint (FCP) under 1.8s and Largest Contentful Paint (LCP) under 2.5s on simulated 3G mobile networks.
* Zero unoptimised images. Responsive delivery via modern formats (AVIF/WebP) with explicit width and height dimensions to prevent layout shifts (CLS < 0.1).

### E. Defensive Security and Content Security Policy (CSP)
* Pages must declare a strict Content Security Policy denying `unsafe-inline` and `unsafe-eval`.
* No external third-party tracking scripts, unapproved CDNs, or ambient analytics.

---

## 3. Containerised local verification battery

Frontend engineers can execute the following automated battery directly against their local application running in Docker (e.g. at `http://localhost:3000` or `:8080`):

### Test 1: Automated Accessibility Audit (`axe-core` & `pa11y-ci`)
Run automated accessibility scanners in headless Chromium to catch obvious WCAG violations:

```bash
# Execute deep component-level accessibility scan
npx @axe-core/cli http://localhost:3000

# Execute CI-grade pa11y scan with zero-error threshold
npx pa11y-ci --threshold 0 http://localhost:3000
```

### Test 2: W3C HTML5 Semantic Validation
Verify markup validity and detect broken tag nesting or missing accessibility attributes:

```bash
# Fetch rendered container HTML and pipe through HTML-Validate
curl -s http://localhost:3000 | npx html-validate --stdin
```

### Test 3: Automated Keyboard and Focus Testing (Playwright)
Run headless end-to-end assertions ensuring focus visibility and skip-link functionality:

```typescript
// tests/a11y.spec.ts
import { test, expect } from '@playwright/test';

test('Skip link reaches main content', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Tab into the page
  await page.keyboard.press('Tab');
  const skipLink = page.locator('a[href="#main-content"]');
  await expect(skipLink).toBeVisible();
  
  // Activate skip link
  await page.keyboard.press('Enter');
  const main = page.locator('#main-content');
  await expect(main).toBeFocused();
});

test('Touch targets satisfy minimum 44x44 CSS px', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const buttons = page.locator('button, a[role="button"]');
  const count = await buttons.count();
  
  for (let i = 0; i < count; i++) {
    const box = await buttons.nth(i).boundingBox();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  }
});
```

### Test 4: Lighthouse Performance and Best Practices
Verify performance budgets, Core Web Vitals, and security headers:

```bash
npx lhci autorun --collect.url=http://localhost:3000 --upload.target=temporary-public-storage
```

---

## 4. Common AI frontend traps and remediations

| Defect category | AI hallucination / Anti-pattern | Remediated government standard pattern |
| --- | --- | --- |
| **Buttons** | `<div onClick={handleClick} className="btn">Submit</div>` | `<button type="submit" class="govuk-button">Submit</button>` |
| **Focus rings** | `*:focus { outline: none; }` | High-visibility focus indicators with offset: `*:focus-visible { outline: 3px solid #ffdd00; outline-offset: 2px; }` |
| **Skip navigation** | Completely omitted from generated templates | `<a href="#main-content" class="govuk-skip-link">Skip to main content</a>` anchored at the top of `<body>` |
| **Form inputs** | `<input placeholder="Enter your email" />` | Explicit `<label for="email">` paired with `id="email"`, hint text, and error binding |
| **Heading order** | Jumping from `<h1>` directly to `<h4>` for font-size aesthetics | Sequential hierarchy (`<h1>` to `<h2>` to `<h3>`); style font size using CSS classes, not semantic tags |
| **Touch targets** | Compact 24px icon links with no padding | Minimum 44x44px clickable target surface using padding or CSS `min-height` / `min-width` |

---

## 5. Verification evidence checklist for `GS-AI-CODE-02`

Before accepting AI-generated frontend deliverables into production branches, retain the following evidence:

- [ ] Zero WCAG 2.2 Level AA violations reported by `axe-core` and `pa11y-ci`.
- [ ] Clean W3C HTML5 validation output with no structural or element nesting errors.
- [ ] Verified manual keyboard walkthrough with clearly visible `:focus-visible` states across all viewports.
- [ ] Confirmed operation of core user journeys with JavaScript disabled in browser settings.
- [ ] Verified touch target geometry (>= 44x44 CSS px) on simulated mobile viewports.
- [ ] Lighthouse audit scores exceeding 90 for Performance, 100 for Accessibility, and 100 for Best Practices.
