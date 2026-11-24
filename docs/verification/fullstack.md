# Full-stack engineering verification profile

**Status:** Implementation guidance  
**Standard reference:** [Government Standard v0.3.0](../../standard/v0.3.0.md) (Controls `GS-AI-CODE-01`, `GS-AI-CODE-02`, `GS-AI-DATA-01`, `GS-AI-DATA-02`, `GS-AI-HUM-01`)  
**Applies to:** Full-stack frameworks (Next.js, Remix, Nuxt, SvelteKit), Server Actions, API routes, and client-server shared codebases  

This profile guides full-stack engineers in verifying that modern web applications unifying client and server execution maintain strict security boundaries, prevent secret leakage, and enforce end-to-end data integrity.

---

## 1. The full-stack verification problem

Modern full-stack frameworks blur the line between server and client execution. Generative AI tools frequently misunderstand these runtime boundaries, introducing severe security vulnerabilities. Common defects include:

- Accidental inclusion of server-only secrets (API keys, database connection strings) in client-side bundles by omitting prefix conventions or server-only guards (`GS-AI-DATA-02`).
- Exposing Server Actions or API handlers without proper session validation, assuming the client-side UI gate is sufficient.
- Client-side validation without matching server-side validation, allowing malicious actors to bypass input checks by calling server endpoints directly.
- Cross-Site Request Forgery (CSRF) vulnerabilities on state-changing Server Actions or POST handlers.
- Hydration mismatches causing layout thrashing or brief flashes of sensitive citizen data on unauthenticated screens.
- Misconfigured Cross-Origin Resource Sharing (CORS) headers granting ambient access to external domains.

Under control `GS-AI-CODE-02`, full-stack applications require end-to-end integration and bundle verification before release.

---

## 2. Government full-stack standard pillars

Full-stack applications processing public sector transactions must enforce five mandatory pillars:

### A. Strict Boundary Isolation and Zero Secret Ingestion
* **Server-Only Isolation:** Server logic, database queries, and private API keys must be isolated in server-only modules (e.g. using `import 'server-only'` in Next.js).
* **Bundle Sanitisation:** Client-facing JavaScript bundles must be audited to verify that no environment variables outside explicit public allowlists (e.g. `NEXT_PUBLIC_*`) are bundled into client code.

### B. Dual-Layer Validation (Client and Server)
* **Shared Schema Enforcement:** Validation schemas (such as Zod, Yup, or Valibot) must be defined once and enforced synchronously on both the client (for interactive user feedback) and the server (for immutable security enforcement).
* **Never Trust the Client:** The server must re-validate all parameters, permissions, and data constraints independently of any client-side assertions.

### C. Robust Session and Cookie Governance
* **Secure Cookie Attributes:** Authentication session cookies must declare `HttpOnly; Secure; SameSite=Lax` (or `SameSite=Strict` for sensitive operations).
* **CSRF Defence:** State-changing requests must enforce anti-CSRF token verification or standard origin header checks.

### D. End-to-End Type and Contract Safety
* **Synchronised Contracts:** Client data queries and server mutations must be bound by strong static typing (e.g. via tRPC, OpenAPI-generated types, or GraphQL codegen) to eliminate runtime parameter drift.

### E. Unified Accessibility and Error Boundaries
* **Graceful Degradation:** When asynchronous server operations or client hydration fails, the application must display accessible, semantic error boundaries rather than unhandled white screens.

---

## 3. Local full-stack verification battery

Full-stack engineers can execute the following automated testing battery directly against their local development container:

### Test 1: Client Bundle Secret Leak Audit
Inspect compiled client-side JavaScript bundles to ensure no private environment variables or server keys leaked into the build:

```bash
# Build the production bundle
npm run build

# Scan client build output for accidental secret inclusion
grep -rE "(SECRET|API_KEY|PRIVATE|DATABASE_URL|PASSWORD)" .next/static/ || echo "Client bundle clean"
```

### Test 2: End-to-End Integration and Authorisation Testing (Playwright)
Execute automated end-to-end tests validating session lifecycle, form submissions, and data boundaries:

```typescript
// tests/e2e-auth.spec.ts
import { test, expect } from '@playwright/test';

test('Unauthenticated user cannot execute server mutation', async ({ request }) => {
  // Directly trigger server endpoint without session cookie
  const response = await request.post('http://localhost:3000/api/mutate-record', {
    data: { recordId: '123', value: 'malicious' }
  });
  
  // Must reject with 401 or 403
  expect(response.status()).toBe(401);
});

test('Session cookies have strict security attributes', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  // Fill login credentials and submit...
  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(c => c.name === 'session');
  
  expect(sessionCookie?.httpOnly).toBe(true);
  expect(sessionCookie?.secure).toBe(true);
  expect(sessionCookie?.sameSite).toBe('Lax');
});
```

### Test 3: Dual Validation Schema Verification
Verify that server endpoints reject payloads that bypass client-side form controls:

```bash
# Submit payload with unexpected or out-of-bounds fields directly to the server action
curl -X POST http://localhost:3000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{"name": "Valid Name", "role": "admin", "__proto__": {"polluted": true}}' \
  -i
```

---

## 4. Common AI full-stack traps and remediations

| Defect category | AI hallucination / Anti-pattern | Remediated government standard pattern |
| --- | --- | --- |
| **Server Secrets** | Accessing `process.env.PRIVATE_KEY` directly inside a client component (`"use client"`) | Enforcing `import 'server-only'` in data modules; exposing only sanitised public variables |
| **Server Actions** | Defining an unauthenticated `"use server"` function that updates database state directly | Invoking session validation at the beginning of the action: `const session = await getSession(); if (!session) throw new Error('Unauthorised');` |
| **Form Validation** | Only validating email and input length via client HTML attributes or React state | Validating with a shared Zod schema inside both the client component and the server handler |
| **Cookie Storage** | Storing JWTs or authentication tokens in `localStorage` | Storing session identifiers strictly in `HttpOnly; Secure; SameSite=Lax` cookies |
| **Error Handling** | Rendering full server error objects directly into the DOM | Displaying human-readable user guidance with error codes, logging internal stack traces securely on the server |

---

## 5. Verification evidence checklist for `GS-AI-CODE-02`

Before deploying AI-generated full-stack features into government environments, retain the following evidence:

- [ ] Client bundle audit confirming zero private environment variables or server keys in `.next/static/` or client chunks.
- [ ] Automated end-to-end tests verifying that unauthenticated direct API or Server Action requests are rejected.
- [ ] Verified server-side validation on every input field, ensuring client validation cannot be bypassed.
- [ ] Confirmed secure cookie attributes (`HttpOnly`, `Secure`, `SameSite`) across all authentication endpoints.
- [ ] Verified that sensitive citizen data is masked in client bundles and SSR initial state payloads.
