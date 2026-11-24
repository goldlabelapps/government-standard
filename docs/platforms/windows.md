# Windows local execution profile

**Status:** Draft implementation guidance  
**Reviewed:** 23 November 2026  
**Applies to:** AI-assisted software engineering on Windows workstations

This profile applies the controls in the [Government Standard](../../standard/v0.3.0.md) to a Windows environment. It is guidance, not a configuration applied to this computer, a product-specific recipe, or a claim that Windows alone confines an AI agent.

## Starting position

Start with the strict profile and allow no capabilities by default. Enable a capability only for an approved task, with a specific owner and a way to verify the boundary. Relax one control at a time; document the reason, compensating controls and expiry.

**Do not run an AI agent as Administrator. Bare-metal access is not a security boundary.** If the available setup cannot enforce the required filesystem, execution and network limits, do not use it for sensitive work.

## Preferred containment: Windows Sandbox

Where available, use Windows Sandbox as a disposable, hypervisor-isolated environment. Microsoft documents it for Windows Pro, Enterprise and Education editions. Closing the sandbox discards its state; files intentionally shared with the host are outside that disposable boundary and may persist.

The [strict template](windows-strict.wsb) explicitly disables networking, clipboard, audio, video, printer redirection and virtual GPU, and enables Protected Client mode. It maps no host folders and runs no startup command. It starts as an empty, offline sandbox: it does not provide repository files or access to a remote model.

Windows Sandbox networking and clipboard redirection are enabled by default in the standard configuration. Do not launch the standard configuration and assume it is locked down. Inspect the `.wsb` file actually used for each launch.

Protected Client mode adds an AppContainer isolation layer to Windows Sandbox. It can affect compatibility and does not replace the hypervisor boundary, the sandbox configuration or review of host integrations.

## Supplying task data or model access

The strict template intentionally has no data-transfer path. To perform a task, relax only what is needed:

- **Input data:** If required, map a sanitized, task-specific host directory as read-only. Never map a home directory, credentials, key stores, unrelated repositories or a directory containing sensitive material the agent is not approved to see.
- **Output data:** Prefer a separate, empty host output directory with write access only when needed. Changes in a writable mapped directory persist on the host after the sandbox closes. Review every output as untrusted; do not execute or open it with privileged host tools before review.
- **Remote model:** The strict template has no network. Enabling Windows Sandbox networking gives the guest network access; it does not provide a provider-only allowlist. Enable it only when an organisation-managed egress control restricts and records the permitted destinations. If this cannot be enforced, use an approved offline model or do not enable remote model access.
- **Tools and credentials:** Keep agent terminals, plugins, MCP servers, browser access and credentials disabled by default. Enable individual tools only after assessing their permissions and data flows. Never expose reusable host credentials to the guest or agent.

Windows Sandbox's default guest account and its privileges inside the guest are separate from the host user's identity. Do not treat guest administrator rights as host administrator rights, or assume they prove the guest is properly isolated; verify the settings and avoid host integrations.

## Windows-specific limitations

Windows Sandbox is not available on every Windows edition or managed device. Confirm feature availability and policy with the system owner. If it is unavailable, use an organisation-approved Hyper-V or equivalent VM profile with the same deny-by-default requirements; do not substitute a normal process or IDE session and call it a sandbox.

The `.wsb` file controls only the settings documented for Windows Sandbox. It does not enforce provider approval, data classification, human review, credential policy or organisation-wide egress filtering. Local policy, endpoint management and network controls remain necessary.

## Phased relaxation

| Phase | Starting restriction | Permit only when |
| --- | --- | --- |
| 0 — Observe | Empty sandbox; no host mappings, network, clipboard or tools | The sandbox's effective configuration has been checked and the task needs no additional capability. |
| 1 — Read | No task files are exposed | A human approves a sanitized, task-specific source folder mapped read-only. |
| 2 — Model connectivity | No network | The provider and data use are approved, and an external managed control restricts and records egress. |
| 3 — Write and export | No host-writable mapping | A human approves a separate, empty output folder; all output is treated as untrusted and reviewed before use. |
| 4 — Additional tools | No terminal, MCP, plugins, browser or external integrations | Each tool has a defined purpose, owner, permission set and verification method; consequential actions still require human approval. |

If a restriction cannot be technically enforced or verified, do not mark it as satisfied. Keep that capability disabled or use a stronger isolation boundary.

## Deployment verification

Before calling a setup compliant with this profile, retain evidence that:

- The exact `.wsb` configuration used was reviewed and networking, clipboard and unneeded device redirection are disabled.
- Protected Client mode is enabled where supported; any compatibility exception is documented and approved.
- No unapproved host folders are mapped; any approved input is read-only and any output mapping is separate and empty.
- Network policy blocks unapproved destinations and provides records to verify the result.
- No reusable credentials are present in agent-accessible files, environment variables or tool configuration.
- Changes are reviewed by a human and test results are recorded before acceptance.
- The sandbox is closed and its state discarded after the task; persistent mapped-folder output is reviewed and handled under the organisation's retention and incident procedures.

An unverified control is not a control. If a required check fails, stop and restore the strict state before continuing.

## Microsoft references

These references explain platform capabilities; they do not endorse this profile. Checked on 23 November 2026; consult current documentation.

- [Windows Sandbox overview](https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/) — hypervisor-based disposable environment, supported editions, and default networking behavior.
- [Use and configure Windows Sandbox](https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/windows-sandbox-configure-using-wsb-file) — `.wsb` options, defaults, mapped-folder behavior and Protected Client mode.
