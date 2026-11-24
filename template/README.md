# Accessible Starter Template

This directory provides a bare-metal, standards-compliant starter template designed to satisfy the core frontend requirements of UK public sector digital services:

* **WCAG 2.2 Level AA Accessibility:** Fully navigable by keyboard, minimum 4.5:1 text contrast ratio, explicit skip-to-content anchor, and minimum 44x44 CSS px touch targets.
* **Semantic HTML5:** Strict landmark structure (`<header role="banner">`, `<main id="main-content">`, `<footer role="contentinfo">`) and accessible form controls.
* **Progressive Enhancement:** Fully operable with client-side JavaScript disabled; enhanced gracefully when present.
* **Defensive Security & CSP:** No inline script handlers, no `eval()`, and compatible with strict `default-src 'self'` Content Security Policies.

## Usage

Copy this directory into your project as the presentation baseline, or preview it locally:

```bash
# Preview using any local static file server
python3 -m http.server 3000 --directory template
```
