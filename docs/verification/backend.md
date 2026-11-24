# Backend and API verification profile

**Status:** Implementation guidance  
**Standard reference:** [Government Standard v0.3.0](../../standard/v0.3.0.md) (Controls `GS-AI-CODE-01`, `GS-AI-CODE-02`, `GS-AI-DATA-02`, `GS-AI-LOG-01`)  
**Applies to:** Backend services, APIs, microservices, and database layers developed or modified using AI tools  

This profile guides backend engineers in verifying that server-side logic, API endpoints, database interactions, and data-processing pipelines comply with government security, privacy, and architectural standards.

---

## 1. The backend verification problem

Generative AI coding tools frequently generate backend code that appears correct in happy-path testing but introduces severe vulnerabilities under adversarial conditions. Common defects include:

- Missing object-level authorisation checks (Broken Object Level Authorisation / IDOR), where users can access another citizen's records by altering an ID parameter.
- Dynamic SQL string interpolation instead of parameterised queries or prepared statements.
- Exposure of raw database exceptions, stack traces, or internal server paths in API responses.
- Insecure direct logging of sensitive personal data (PII), session tokens, or API secrets into application logs.
- Use of weak or deprecated cryptographic primitives (e.g. MD5, SHA-1, ECB mode, or non-cryptographic pseudo-random number generators).
- Lack of rate limiting, payload size limits, or timeout governance on public endpoints.

Under control `GS-AI-CODE-02`, an AI model's assertion that server code is secure is invalid without objective verification telemetry.

---

## 2. Government backend standard pillars

Server-side code processing public sector or citizen data must enforce five mandatory pillars:

### A. Authorisation and Data Isolation (RBAC / ABAC)
* **Explicit Object-Level Validation:** Every data request must verify that the authenticated identity is explicitly authorised to access the specific target resource record, preventing horizontal and vertical privilege escalation.
* **Fail-Closed Access:** Unauthenticated or unauthorised requests must be rejected immediately with standard HTTP 401 or 403 status codes.

### B. Input Validation and Injection Defence
* **Strict Type and Schema Validation:** Every incoming payload must be validated against a strict schema (e.g. Zod, Pydantic, JSON Schema) rejecting unknown fields.
* **Universal Parameterisation:** All SQL, NoSQL, and shell commands must use parameterised interfaces. Raw string concatenation or template literal execution against databases is strictly prohibited.

### C. Sensitive Data Handling and Log Hygiene
* **Data Minimisation:** Backend APIs must only query and return the specific fields required by the client, avoiding bulk database object dumping (`SELECT *`).
* **Zero Secret or PII Logging:** Passwords, tokens, national insurance numbers, and citizen identifiers must be masked or redacted before reaching logging pipelines, satisfying controls `GS-AI-DATA-02` and `GS-AI-LOG-01`.

### D. Cryptographic and Secret Hygiene
* **Approved Algorithms Only:** Enforce AES-GCM (256-bit), ChaCha20-Poly1305, or RSA/ECC with approved key lengths. Passwords must be hashed using Argon2id or bcrypt with appropriate cost factors.
* **Zero Ambient Credentials:** Database passwords and external API keys must be injected through secret managers or environment variables at runtime, never hardcoded in source files.

### E. Resilience, Timeouts, and Error Masking
* **Sanitised Error Responses:** Production API error responses must return generic status messages and correlation IDs, never exposing stack traces or database driver outputs.
* **Resource Governance:** All inbound requests, database pools, and outbound HTTP calls must enforce explicit timeouts and rate limits to prevent denial-of-service degradation.

---

## 3. Containerised backend verification battery

Backend engineers can execute the following automated security and verification battery directly against their services running in local containers:

### Test 1: Static Application Security Testing (SAST)
Scan backend source code for security vulnerabilities, dangerous sinks, and insecure functions:

```bash
# Run Semgrep with standard security-audit rules
npx semgrep --config "p/security-audit" --config "p/owasp-top-ten" --error

# Or for Python services:
bandit -r src/ -ll

# Or for Go services:
gosec -quiet ./...
```

### Test 2: Hardcoded Secret Detection
Scan the codebase, configuration files, and git history for accidentally committed secrets or tokens:

```bash
# Execute deep secret scan using Gitleaks
gitleaks detect --source . --verbose --no-git

# Or using TruffleHog
trufflehog filesystem . --exclude-paths=.gitignore
```

### Test 3: Automated API Security Fuzzing (Schemathesis)
Fuzz API endpoints against OpenAPI/Swagger specifications to detect crashes, unhandled 500 errors, and schema violations:

```bash
# Run property-based security tests against local container
npx schemathesis run http://localhost:8080/openapi.json \
  --checks all \
  --stateful=links \
  --hypothesis-suppress-health-check=too_slow
```

### Test 4: Dependency and Supply-Chain Vulnerability Audit
Verify that AI-suggested packages contain no known CVEs (`GS-AI-SUPPLY-01`):

```bash
# Node.js services
npm audit --audit-level=high

# Python services
pip-audit --desc on

# Universal multi-ecosystem scan
osv-scanner -r .
```

---

## 4. Common AI backend traps and remediations

| Defect category | AI hallucination / Anti-pattern | Remediated government standard pattern |
| --- | --- | --- |
| **SQL Queries** | `db.query(\`SELECT * FROM users WHERE id = ${userId}\`)` | `db.query('SELECT id, name, email FROM users WHERE id = $1', [userId])` |
| **Authorisation** | `SELECT * FROM claims WHERE id = :claimId` (No user check) | `SELECT id, amount, status FROM claims WHERE id = $1 AND user_id = $2` |
| **Error Handling** | `catch (e) { res.status(500).json({ error: e.message, stack: e.stack }); }` | `catch (e) { logger.error({ err: e, reqId }); res.status(500).json({ error: 'Internal service error', reqId }); }` |
| **Password Hashing** | `crypto.createHash('sha256').update(password).digest('hex')` | `await argon2.hash(password, { type: argon2.argon2id })` |
| **Logging** | `logger.info(\`User login: ${JSON.stringify(req.body)}\`)` | `logger.info({ event: 'login', userId: sanitise(user.id) })` (redacting credentials) |
| **Data Exposure** | Returning entire database models directly to clients | Transforming models through explicit DTOs (Data Transfer Objects) containing only permitted public fields |

---

## 5. Verification evidence checklist for `GS-AI-CODE-02`

Before accepting AI-assisted backend changes into staging or production, retain the following evidence:

- [ ] Zero critical or high severity SAST findings reported by Semgrep, Bandit, or Gosec.
- [ ] Clean secret scan verifying no credentials, tokens, or private keys in source code.
- [ ] Clean dependency audit confirming no known vulnerabilities in added libraries (`GS-AI-SUPPLY-01`).
- [ ] Automated integration tests asserting object-level authorisation (verifying that User A cannot read or mutate User B's resources).
- [ ] Verified sanitisation of error responses, ensuring zero stack traces or SQL details are exposed.
- [ ] Verified input validation rejecting malformed payloads and out-of-range parameters.
