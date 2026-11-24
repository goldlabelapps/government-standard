# Linux local execution profile

**Status:** Draft implementation guidance  
**Reviewed:** 24 November 2026  
**Applies to:** AI-assisted software engineering on Linux workstations, CI/CD runners, and containerised environments

This profile applies the controls in the [Government Standard](../../standard/v0.3.0.md) to a Linux environment. It is guidance, not a configuration applied to this computer, a product-specific recipe, or a claim that Linux alone confines an AI agent.

## Starting position

Start with the strict profile and allow no capabilities by default. Enable a capability only for an approved task, with a specific owner and an independently verifiable boundary. Relax one control at a time: document the rationale, compensating controls, and expiry date.

**Do not run an AI agent as root or with sudo access. Bare-metal access is not a security boundary.** Standard Linux container runtimes running as root do not provide complete hypervisor-grade isolation. If the available Linux setup cannot enforce the required filesystem, execution, and network limits, do not use that setup for sensitive work.

## Preferred containment: disposable microVM or rootless container

For an agent that can execute commands or change files, prefer an isolated, ephemeral execution boundary:

1. **Disposable MicroVM (Preferred for full command execution):**
   - Use a lightweight microVM (such as KVM with QEMU, Firecracker, or Cloud Hypervisor) managed by an automated orchestration script.
   - Configure a dedicated, non-root guest user with only task-required software.
   - Disallow access to the host `/home`, host environment variables, socket files (including `/var/run/docker.sock`), and host device nodes.
   - Run from an ephemeral root filesystem that is destroyed immediately upon task termination.

2. **Rootless Container with User Namespaces (Secondary option):**
   - Use rootless Podman or unprivileged user namespaces (`bubblewrap` / `bwrap`) where microVMs are impractical.
   - Map the agent process to an unprivileged subordinate user ID (subuid/subgid). Root inside the container must map to an unprivileged host UID.
   - Drop all Linux capabilities (`--cap-drop=ALL`), prevent privilege escalation (`--security-opt=no-new-privileges`), and set a read-only container rootfs (`--read-only`).
   - Never mount the host Docker daemon socket into an agent container. Mounting the Docker socket grants full, unconstrained root compromise of the host system.

## Network egress and isolation

Agents must run without ambient internet connectivity:

- **Deny Network by Default:** Run the microVM or container in a private network namespace with loopback only (`--network=none` or equivalent).
- **Constrained Model Egress:** If a remote model is required, route traffic strictly through an external egress proxy or firewall rule (`nftables` / `iptables`). Allow outbound TCP connections only to the specific, approved provider API endpoint and port 443. Deny all arbitrary web browsing, package repository querying, and lateral subnet communication unless specifically approved for the task.
- **Log Egress Traffic:** Verify that the egress proxy or firewall actively logs all connection attempts with timestamps, destination IPs, and domain names.

## Supplying task data and handling outputs

The containment boundary must strictly govern data ingress and egress:

- **Input data:** Mount only a sanitized, task-specific directory as read-only (`:ro`). Never mount the developer home directory, SSH directories (`~/.ssh`), GPG keys (`~/.gnupg`), cloud credentials (`~/.aws`, `~/.config/gcloud`), or environment secret files.
- **Output data:** Provide an empty, isolated working copy for output files. Changes in the output workspace must be treated as untrusted data: inspect, diff, and verify all output using human-controlled tools on the host before committing or executing them outside the sandbox.
- **Tools and credentials:** Keep compilers, package managers, terminal execution, browser automation, and MCP server integrations disabled by default. Enable only the specific tools needed for the approved task. Never pass ambient environment secrets, tokens, or private keys into the container environment.

## Linux-specific limitations

Standard Docker installations run the daemon as root. An agent with access to the Docker CLI or socket can escape container constraints and modify arbitrary host files. Always verify that:

- Rootless mode is enforced, or user namespaces are strictly configured.
- Host filesystems are not mounted writable into the agent environment.
- Linux audit daemon (`auditd`) or system security modules (AppArmor or SELinux) enforce mandatory access control profiles on the agent process.
- No setuid binaries exist in the mounted workspace.

Do not rely on an agent instruction file, IDE prompt, or unconfined container runtime to enforce boundaries. Enforce limits through kernel namespaces, cgroups, network filters, and human approval gates.

## Phased relaxation

| Phase | Starting restriction | Permit only when |
| --- | --- | --- |
| 0: Observe | Offline, read-only ephemeral container or microVM; no network, tools, or credentials | The approved task can be completed without additional capability. |
| 1: Read | No task files exposed to the environment | A human approves a sanitized, task-specific directory mounted strictly read-only. |
| 2: Model connectivity | No network interfaces except loopback | The provider and data use are approved, and egress filters restrict traffic strictly to the model endpoint. |
| 3: Write and build | Ephemeral root filesystem only; no persistent writes | A human approves a separate, disposable workspace; all changes are treated as untrusted and reviewed before merging. |
| 4: Additional tools | No compiler, package manager, terminal, or MCP servers | Each tool has a documented purpose, minimal permissions, and an audit trail; consequential actions require human sign-off. |

If a restriction cannot be technically verified, treat it as unsatisfied. Retain the strict boundary or halt the task.

## Deployment verification

Before considering a Linux setup aligned with this profile, verify that:

- The agent process runs under an unprivileged UID and cannot acquire root privileges on the host.
- The host Docker socket is not accessible to the agent under any circumstance.
- The filesystem outside the assigned task workspace is inaccessible or mounted strictly read-only.
- Outbound network traffic is either completely disabled or restricted to the authorized model API via verified firewall or proxy rules.
- Environment variables, bash histories, and temporary directories contain no credentials, keys, or sensitive internal data.
- All code changes generated by the agent are subject to human review and project-level test verification prior to check-in.
- The execution container or microVM can be destroyed and recreated cleanly from an immutable image.

## Linux references

These references explain Linux security mechanisms; they do not endorse this profile. Checked on 24 November 2026; consult current documentation:

- [Linux User Namespaces](https://man7.org/linux/man-pages/man7/user_namespaces.7.html): Overview of unprivileged user namespace isolation.
- [Podman Rootless Mode](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md): Running containers without root privileges.
- [Bubblewrap Sandboxing](https://github.com/containers/bubblewrap): Unprivileged sandboxing tool utilizing Linux namespaces.
- [nftables Packet Filtering](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page): Linux kernel packet classification and egress filtering.
