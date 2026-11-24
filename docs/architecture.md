# Documentation architecture

This repository separates normative requirements from explanatory material so readers can tell what the standard requires and what it recommends as a way to implement it.

## Proposed structure

```text
README.md                    Project purpose and entry points
AGENTS.md                    Canonical instructions for AI contributors
CLAUDE.md, GEMINI.md         Provider discovery adapters
.github/copilot-instructions.md
                             Copilot discovery adapter
standard/v<version>.md       Versioned, normative control set
docs/architecture.md         Document roles and evolution
docs/threat-model.md         Threat model and attack vector analysis
docs/conformance-checklist.md
                             Evaluation and audit worksheet
docs/agent-tool-support.md   Verified instruction-file formats and caveats
docs/platforms/               Platform-specific implementation profiles
docs/verification/           Domain verification profiles (frontend, backend, devops, fullstack)
CONTRIBUTING.md              Review and change process
```

Keep the initial control set in one versioned document. Split it into domain files only when that makes review or maintenance clearer. Each published version is immutable; corrections or changed requirements belong in a new version, with a change record.

## Control format

Each control has a persistent identifier, a short title, a normative statement, implementation guidance and expected evidence. Identifiers remain stable across versions; retired identifiers are not reused. A material change to a requirement is documented in the version history.

Use **MUST** for a required control and **SHOULD** for a recommended control. Control statements are this project's proposals. External frameworks are references and do not become requirements through citation.

## AI contributor instructions

`AGENTS.md` is the single canonical instruction source for agents working in this repository. Provider-specific files exist only to help documented clients discover it; they should point to or import the canonical file, not duplicate its rules. The support list is deliberately limited to clients whose current official documentation has been checked.

Instruction discovery is not enforcement. Restrictions on filesystem, commands, network, credentials and consequential actions require technical controls outside Markdown files. A client that does not load or follow an instruction file is not constrained by it.

Platform profiles provide implementation guidance for a specific environment. They must state their scope, assumptions, verification evidence and limitations, and must not imply that a platform feature automatically enforces a control.

## Evidence and applicability

An organisation determines applicability in the context of its work, risk, laws, contracts and security policies. It records the version used, control decisions, evidence, and any approved exceptions to this draft. Exceptions must be scoped, time-limited, risk-assessed and approved by an accountable authority before the affected use; they cannot waive an external obligation or make prohibited data use acceptable.

Evidence should be proportionate and avoid creating a new repository of sensitive prompts, source code, personal data or credentials. Prefer configuration, access records, review approvals and test results over storing full conversations.

## Future machine-readable controls

Machine-readable control data may help later with inventories and evidence tracking. Defer a schema until identifiers, fields and applicability rules have been tested through review. Any future schema is a representation of the published text; it must not silently add or weaken requirements.

## Change process

Proposed changes should state the problem, affected controls, security and operational impact, evidence needed to implement them, and relevant sources. Review changes for enforceability, unintended conflicts with existing policy, clarity of normative language and backward compatibility of identifiers. Record accepted changes in the next version and explain the rationale.
