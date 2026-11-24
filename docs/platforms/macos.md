# macOS local execution profile

**Status:** Draft implementation guidance  
**Reviewed:** 23 November 2026  
**Applies to:** AI-assisted software engineering on macOS workstations

This profile applies the controls in the [Government Standard](../../standard/v0.3.0.md) to a macOS environment. It is guidance, not a configuration applied to this computer, a product-specific recipe, or a claim that macOS alone confines an AI agent.

## Starting position

Start with the strict profile below and allow no capabilities by default. Enable a capability only for an approved task, with a specific owner and a way to verify the boundary. Relax one control at a time; document the reason, compensating controls and expiry.

**Do not run an AI agent as root or administrator. Bare-metal access is not a security boundary.** If the available macOS setup cannot enforce the required filesystem, execution and network limits, do not use that setup for sensitive work.

## Preferred containment: disposable local VM

For an agent that can execute commands or change files, prefer a disposable virtual machine (VM) over running the agent in the host user's session. Apple documents macOS and Linux virtualization on Mac hardware. Configure the guest with:

- A standard, non-administrator account and only the task-specific software and data it needs.
- No shared host directories, host home directory, keychain, clipboard, USB devices or personal accounts by default.
- A fresh task workspace, initially read-only. If writes are needed, permit them only in a disposable working copy.
- Network disabled by default. If a remote model is required, route only the model connection through an organisation-approved egress control; keep agent tool and general internet access denied.
- No long-lived credentials. If authentication is required, use an approved, scoped mechanism that does not expose reusable credentials to the agent.
- A clean snapshot or rebuild path after the task. Review and transfer changes to the host only through a human-controlled process.

Do not treat a VM as automatically secure. Its shared folders, clipboard, network devices, host integrations, guest configuration and hypervisor remain part of the boundary and must be reviewed.

## Native-app fallback

If a VM is not practical, use a dedicated macOS standard (non-admin) account for AI-assisted work. It should contain only approved task data and should not be signed into personal cloud, password-manager, source-control or other accounts. Do not keep personal files, unrelated repositories, credentials or sensitive data in that account.

A separate account reduces access to other users' files; it is **not** equivalent to a process sandbox. Processes running as that user may access resources available to that user. Do not claim isolation merely because an agent runs in another account or inside an IDE.

For the native-app fallback:

- Grant access only to the required project folder. Deny Full Disk Access and other privacy permissions unless specifically justified and approved.
- Keep terminal, shell, browser, MCP servers, plugins and other agent tools disabled by default. Enable only the capability needed for the task and review its permissions first.
- Where the app's supported sandbox or managed policy allows it, give the agent read-only access to the source copy and write access only to a separate disposable workspace. If the agent can change the source permissions, treat that copy as writable.
- Require a managed network control that can restrict outbound connections. An application permission prompt or inbound firewall setting is not evidence that agent egress is blocked. If outbound access cannot be constrained, do not enable agent network tools or handle sensitive information in that profile.
- Do not place API keys, SSH agents, cloud credentials, personal tokens or reusable secrets in the account or its environment.

Assume an unsandboxed app can access all files available to its account. Do not rely on a folder picker or macOS privacy prompt to confine an app unless its sandboxing and helper processes have been verified.

## macOS-specific limitations

Apple's App Sandbox restricts resources according to entitlements. It is an app capability that must be supported and configured by the app; it is not a general-purpose wrapper that automatically sandboxes every installed IDE, extension, shell or agent. Verify the actual app and helper-process configuration instead of inferring protection from the app's presence on macOS.

Do not rely on an agent instruction file, a permission prompt, account separation, or an app being signed or notarized as proof that its filesystem, command or network actions are confined. Enforce those limits in the VM, operating-system permissions, managed network controls and repository workflow.

## Phased relaxation

| Phase | Starting restriction | Permit only when |
| --- | --- | --- |
| 0 — Observe | Read-only task data; no shell, agent tools, credentials or general network | The approved task can be completed without added capability. |
| 1 — Write | No writes outside a disposable task workspace | A human approves the specific workspace and can inspect or revert its changes. |
| 2 — Model connectivity | No outbound connections from the agent environment | The provider and data use are approved, and network controls constrain the model connection. |
| 3 — Additional tools | No terminal, MCP, plugins, browser or external integrations | Each tool has a defined purpose, owner, permission set and verification method; consequential actions still require human approval. |

If a restriction cannot be technically enforced or verified, do not mark it as satisfied. Keep that capability disabled or use a stronger isolation boundary.

## Deployment verification

Before calling a setup compliant with this profile, retain evidence that:

- The agent is not privileged and can access only the intended task data.
- The VM has no unapproved host shares or integration devices, or the native-app fallback's limited isolation is explicitly accepted for low-risk data only.
- App permissions and enabled agent tools match the approved task.
- Network policy blocks unapproved destinations and provides records to verify the result.
- No reusable credentials are present in agent-accessible files, environment variables or tool configuration.
- Changes are reviewed by a human and test results are recorded before acceptance.
- The environment can be reset and task data is handled under the organisation's retention and incident procedures.

An unverified control is not a control. If a required check fails, stop and restore the strict state before continuing.

## Apple references

These references explain platform capabilities; they do not endorse this profile. Checked on 23 November 2026; consult current documentation.

- [Apple App Sandbox](https://developer.apple.com/documentation/security/app-sandbox) — resource access is limited through app entitlements.
- [Apple Virtualization framework](https://developer.apple.com/documentation/virtualization) — VM configuration includes devices for networking, shared directories and clipboard.
