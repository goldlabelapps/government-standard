# Government Standard

**Don't ask an organisation to trust your AI. Show them how you've constrained it.**

Government Standard is an independent, practical standard for governing AI-assisted software engineering in government and other security-conscious environments. It focuses on controls that can be enforced, observed and evidenced—not claims that a model is inherently safe.

The standard is a draft for public review. It is not government-endorsed, an accreditation scheme, or a substitute for law, contracts, an organisation's security policies, or formal assurance.

## Start here

- [Draft standard v0.1.0](standard/v0.1.0.md) — proposed requirements, implementation guidance and evidence expectations.
- [Documentation architecture](docs/architecture.md) — how the standard is organised and intended to evolve.
- [AI agent instruction support](docs/agent-tool-support.md) — supported instruction-file entry points and their limitations.
- [macOS execution profile](docs/platforms/macos.md) — a strict local reference profile and its limits.
- [Windows execution profile](docs/platforms/windows.md) — a strict Windows Sandbox profile and `.wsb` template.
- [Contributing](CONTRIBUTING.md) — how to comment on or propose changes.

## What it covers

The draft addresses approval and oversight, model and provider governance, information handling, tool permissions, agent execution boundaries, human approval gates, code verification, software supply chain, audit records, incident response and ongoing review.

It applies to AI used to perform or assist software engineering tasks, including chat-based assistants and agents able to access files, run commands, or use external tools. It governs AI use in the engineering process, not the lifecycle risks of AI systems deployed as product functionality.

## How to use it

Organisations should identify the applicable version, assess each requirement against their own legal, contractual, classification and security obligations, and retain evidence of implementation. Requirements in this standard do not authorise an activity that those obligations prohibit. A written exception to this draft cannot override them.

The standard uses **MUST** for a required control and **SHOULD** for a recommended control. The controls are proposals from this project, not requirements imposed by the frameworks cited in the standard.

## AI agents working in this repository

[`AGENTS.md`](AGENTS.md) is the canonical contributor instruction file. [`CLAUDE.md`](CLAUDE.md), [`GEMINI.md`](GEMINI.md) and [Copilot's repository instructions](.github/copilot-instructions.md) are discovery adapters for documented clients.

No set of files is readable or enforceable by every AI product. These instructions are not a security boundary: use sandboxing, least-privilege permissions, network controls and human approvals to enforce restrictions.

## Principles

- **Control, don't assume trust:** constrain capabilities and verify observable behaviour.
- **Least privilege:** limit data, filesystem, terminal, network and credential access to what is authorised.
- **Human accountability:** the responsible person remains accountable for AI-assisted work.
- **Evidence over assertion:** inspect changes and verify results independently of an agent's claims.
- **Data minimisation:** disclose only information authorised for the specific AI service and use.
- **Continuous review:** revisit controls as tools, models, threats and organisational requirements change.
