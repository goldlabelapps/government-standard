# AI agent instruction-file support

There is no instruction file that every AI product is guaranteed to discover or follow. This repository keeps [`AGENTS.md`](../AGENTS.md) as its single canonical instruction source and provides small entry-point files for several documented clients.

## Documented discovery entry points

| Client | Repository entry point | Notes |
| --- | --- | --- |
| OpenAI Codex | `AGENTS.md` | Codex documents root and nested `AGENTS.md` discovery. |
| GitHub Copilot | `.github/copilot-instructions.md`; agent instruction files may include `AGENTS.md`, `CLAUDE.md` or `GEMINI.md` | Features and surfaces can differ; verify the instructions are enabled and loaded in the specific client. |
| Claude Code | `AGENTS.md` or `CLAUDE.md` | Claude Code documents both project instruction files; this repository's `CLAUDE.md` points to the canonical file. |
| Gemini CLI | `GEMINI.md` | Gemini CLI uses `GEMINI.md` by default and supports imports; this file imports `AGENTS.md`. |

These are documented conventions, not universal support guarantees. Client versions, settings, modes and product surfaces can affect discovery. Confirm which instructions a client loaded before relying on them. Add another adapter only after checking that client's current official documentation; keep it as a pointer or import rather than a second policy.

## No enforcement guarantee

An instruction file is model context, not a permission boundary. It cannot reliably prevent file access, command execution, network access, credential use or external actions. Enforce those boundaries in the operating system, sandbox or container, identity and network configuration, repository settings and approval workflow. If a client cannot load an instruction file, the file does not constrain that client.

## Sources

Client behaviour was checked on 23 November 2026. Consult current documentation before configuring a client:

- [OpenAI Codex project instructions](https://developers.openai.com/codex/guides/agents-md/)
- [GitHub Copilot repository custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [Claude Code memory and instruction files](https://code.claude.com/docs/en/memory)
- [Gemini CLI context files](https://google-gemini.github.io/gemini-cli/docs/cli/gemini-md.html)
