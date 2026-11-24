<p align="left">
  <img src="../assets/govmint/favicon.svg" alt="Government Standard Crown Badge" width="48" height="48">
</p>

# Conformance and audit checklist

**Version:** 0.2.0-draft  
**Standard reference:** [Government Standard v0.2.0](../standard/v0.2.0.md)  
**Status:** Audit worksheet template  

This checklist provides an evaluation framework for organisations assessing AI-assisted software engineering practices against the Government Standard.

---

## Assessment metadata

| Field | Detail |
| --- | --- |
| Organisation / Programme | |
| Assessed Team or System | |
| Accountable Owner | |
| Assessor Name / Role | |
| Date of Assessment | |
| AI Services in Scope | |

---

## Assessment criteria and control matrix

Status definitions:
- **Conforming:** The requirement is fully implemented with current, verifiable evidence.
- **Exception:** A documented, risk-assessed, and approved deviation is active with compensating controls and an expiry date.
- **Non-Conforming:** The requirement is not satisfied and no approved exception exists.
- **N/A:** The control is explicitly non-applicable based on documented rationale.

### 1. Governance and approval (GOV)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-GOV-01` | Authorise each use | MUST | Is there an accountable organisational sign-off for the specific use case, team, models, tasks, and data classes? | Dated approval record; entry in central AI inventory. | [ ] | |
| `GS-AI-GOV-02` | Assess provider and service | MUST | Has the provider's contractual terms, data retention, model training policy, and access controls been formally evaluated? | Assessment record; signed enterprise terms; service configuration review. | [ ] | |

### 2. Information handling (DATA)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-DATA-01` | Classify and minimise inputs | MUST | Are inputs classified before submission? Is data minimised and redacted to what is strictly necessary? | Data classification policy; prompt handling guidelines; redaction rules. | [ ] | |
| `GS-AI-DATA-02` | Protect restricted data and secrets | MUST | Are credentials, tokens, private keys, and restricted records systematically excluded from agent context? | Exclusion rules in workspace config; git secret scanner results. | [ ] | |

### 3. Service and tool configuration (TOOL)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-TOOL-01` | Record the deployed configuration | MUST | Are deployed models, versions, extensions, plugins, and security settings recorded and tracked? | Inventory snapshot; pinned configuration files; change review logs. | [ ] | |
| `GS-AI-TOOL-02` | Review extensions and integrations | MUST | Are connected plugins, MCP servers, and tool integrations reviewed and approved before activation? | Tool approval logs; permission manifests; data-flow diagrams. | [ ] | |

### 4. Identity and least privilege (ACCESS)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-ACCESS-01` | Limit access to task scope | MUST | Is filesystem, repo, and service access constrained strictly to the required task directory? | Sandbox/container mount configuration; directory permission checks. | [ ] | |
| `GS-AI-ACCESS-02` | Constrain network access | MUST | Is outbound internet access disabled by default or restricted to explicit provider endpoints? | Firewall/proxy rules; network namespace config; egress connection logs. | [ ] | |
| `GS-AI-ACCESS-03` | Do not grant ambient credentials | MUST | Are long-lived, ambient host credentials excluded from agent-accessible files and environment variables? | Environment variable audit; absence of secrets in shell history and working directories. | [ ] | |

### 5. Execution boundaries (EXEC)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-EXEC-01` | Isolate execution | MUST | Does command execution and file modification occur within an isolated sandbox, container, or VM? | Hypervisor/container profiles (e.g. WSB, microVM, rootless Podman configs). | [ ] | |
| `GS-AI-EXEC-02` | Treat content and tool output as untrusted | MUST | Are retrieved content, documentation, tool outputs, and issue descriptions treated as untrusted data? | Tool permission limits; prompt injection handling procedures. | [ ] | |

### 6. Human oversight and approvals (HUMAN)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-HUM-01` | Require human authorisation for consequential actions | MUST | Do external transmissions, deployments, security modifications, or destructive operations mandate human approval? | Approval gate records; audit trail showing human authorization before action. | [ ] | |
| `GS-AI-HUM-02` | Retain accountable human ownership | MUST | Is a named individual held professionally responsible for every AI-assisted code commit or deliverable? | Work item or issue ticket recording the responsible human owner. | [ ] | |

### 7. Software integrity and verification (CODE)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-CODE-01` | Review AI-generated changes | MUST | Is AI-generated code subjected to line-by-line human review with special scrutiny on auth, crypto, and data flows? | Pull request review logs; signed commit approvals. | [ ] | |
| `GS-AI-CODE-02` | Verify changes with project controls | MUST | Are changes verified through automated test suites, linters, and security checks prior to acceptance? | Test run telemetry; CI execution records; static analysis outputs. | [ ] | |
| `GS-AI-CODE-03` | Preserve review and build protections | MUST | Are repository protections, branch restrictions, and CI/CD controls enforced externally to prevent agent bypass? | Protected branch configurations; repository access policies. | [ ] | |

### 8. Dependencies and external components (SUPPLY)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-SUPPLY-01` | Assess suggested dependencies and tools | MUST | Are AI-suggested packages and libraries vetted for authenticity, maintainer hygiene, and vulnerabilities? | Dependency review records; lockfile inspection; vulnerability scan results. | [ ] | |

### 9. Records and audit (LOG)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-LOG-01` | Keep proportionate activity records | MUST | Are records retained showing who used which service, approved models, tool settings, and verification outcomes? | Work management links; configuration snapshots; audit logs without secret exposure. | [ ] | |

### 10. Incident response (INCIDENT)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-INC-01` | Respond to AI-related incidents | MUST | Does the security incident procedure cover data disclosures, unsafe tool actions, and model compromise? | Security incident response plan; post-incident review logs where applicable. | [ ] | |

### 11. Ongoing assurance (REVIEW)

| Control ID | Control title | Level | Verification checkpoint | Evidence required | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `GS-AI-REVIEW-01` | Reassess continued use | MUST | Is each approved AI use formally re-evaluated at least annually and whenever models, terms, or scopes change? | Annual review sign-off; trigger-based reassessment records. | [ ] | |
| `GS-AI-REVIEW-02` | Review and version the standard | SHOULD | Does the organisation maintain version-controlled alignment with standard updates and threat landscape changes? | Documented standard revision checks and internal policy reviews. | [ ] | |

---

## Approved exception log template

Where a MUST control cannot be met due to operational constraints, complete and retain an exception record prior to commencing work:

```text
Exception ID:           EXC-2026-XXXX
Affected Control:       GS-AI-[DOMAIN]-[NN]
Target System / Team:   [System or Team Name]
Accountable Owner:      [Full Name and Role]
Operational Rationale:  [Technical or operational reason why strict control cannot be enforced]
Risk Assessment:        [Evaluated risk and likelihood of impact]
Compensating Controls:  [Specific technical or procedural mitigations active during the exception]
Approval Date:          YYYY-MM-DD
Expiry Date:            YYYY-MM-DD (Maximum 12 months)
Authorising Authority:  [Signature / Approval Reference]
```
