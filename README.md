<p align="center">
  <img src="assets/govmint/logo.svg" alt="GOV.MINT Government Standard Logo" width="320">
</p>

# Government Standard

**Don't ask an organisation to trust your AI. Show them how you've constrained it.**

Government Standard is an independent, practical standard and bare-metal developer harness for governing AI-assisted software engineering in government and security-conscious environments. It focuses on controls that can be enforced, observed, and evidenced, not claims that a model is inherently safe.

The standard is a draft for public review. It is not government-endorsed, an accreditation scheme, or a substitute for law, contracts, an organisation's security policies, or formal assurance.

---

## Developer Harness

This repository provides an executable verification harness and accessible baseline template:

- **Universal verification CLI:** `./bin/gov-verify` scans for unprotected credentials and tokens (C-07), validates markdown link integrity (C-16), and evaluates repository conformance.
- **Git pre-commit gate:** `make setup` activates local hooks to prevent credentials or broken references from reaching commit history.
- **Accessible starter template:** [`template/`](template/) provides a WCAG 2.2 Level AA and semantic HTML5 starter layout.
- **Quickstart commands:**
  ```bash
  make setup   # Activate git pre-commit security gates
  make verify  # Execute full verification battery (secrets, links, conformance)
  make audit   # Emit machine-readable JSON conformance telemetry
  ```

---

## Start Here

- [Draft standard v0.3.0](standard/v0.3.0.md): proposed requirements, implementation guidance, and evidence expectations (previous: [v0.2.0](standard/v0.2.0.md), [v0.1.0](standard/v0.1.0.md)).
- [Documentation architecture](docs/architecture.md): how the standard is organised and intended to evolve.
- [Threat model and risk matrix](docs/threat-model.md): core attack vectors, failure modes, and control mapping.
- [Conformance checklist](docs/conformance-checklist.md): structured evaluation worksheet for the 21 controls.
- Domain verification profiles:
  - [Frontend verification](docs/verification/frontend.md): automated WCAG 2.2 AA and container testing battery.
  - [Backend & API verification](docs/verification/backend.md): SAST, injection defence, and object-level authorisation.
  - [DevOps & Platform verification](docs/verification/devops.md): IaC policy-as-code, container hardening, and supply-chain pinning.
  - [Full-stack verification](docs/verification/fullstack.md): boundary isolation, secret leak prevention, and end-to-end contracts.
- Platform execution profiles:
  - [Linux execution profile](docs/platforms/linux.md): disposable microVM and rootless container isolation guidance.
  - [macOS execution profile](docs/platforms/macos.md): a strict local reference profile and its limits.
  - [Windows execution profile](docs/platforms/windows.md): a strict Windows Sandbox profile and `.wsb` template.
- [AI agent instruction support](docs/agent-tool-support.md): verified instruction-file entry points and their limitations.
- [Contributing](CONTRIBUTING.md): how to comment on or propose changes.

---

## What It Covers

The draft addresses approval and oversight, model and provider governance, information handling, tool permissions, agent execution boundaries, human approval gates, code verification, software supply chain, audit records, incident response, and ongoing review.

It applies to AI used to perform or assist software engineering tasks, including chat-based assistants and agents able to access files, run commands, or use external tools. It governs AI use in the engineering process, not the lifecycle risks of AI systems deployed as product functionality.

---

## How to Use It

Organisations should identify the applicable version, assess each requirement against their own legal, contractual, classification, and security obligations, and retain evidence of implementation. Requirements in this standard do not authorise an activity that those obligations prohibit. A written exception to this draft cannot override them.

The standard uses **MUST** for a required control and **SHOULD** for a recommended control. The controls are proposals from this project, not requirements imposed by the frameworks cited in the standard.

---

## AI Agents Working in This Repository

[`AGENTS.md`](AGENTS.md) is the canonical contributor instruction file. [`CLAUDE.md`](CLAUDE.md), [`GEMINI.md`](GEMINI.md), and [Copilot repository instructions](.github/copilot-instructions.md) are discovery adapters for documented clients.

No set of files is readable or enforceable by every AI product. These instructions are not a security boundary: use sandboxing, least-privilege permissions, network controls, and human approvals to enforce restrictions.

---

## Principles

- **Control, don't assume trust:** constrain capabilities and verify observable behaviour.
- **Least privilege:** limit data, filesystem, terminal, network, and credential access to what is authorised.
- **Human accountability:** the responsible person remains accountable for AI-assisted work.
- **Evidence over assertion:** inspect changes and verify results independently of an agent's claims.
- **Data minimisation:** disclose only information authorised for the specific AI service and use.
- **Continuous review:** revisit controls as tools, models, threats, and organisational requirements change.

---

## Licence

<img src="assets/govmint/ogl-symbol-41px-retina-black.png" alt="Open Government Licence" width="41" height="17">

Released under the [MIT Licence](LICENSE). Public sector baseline documentation and templates follow the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
