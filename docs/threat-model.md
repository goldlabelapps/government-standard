# Threat model and risk matrix

**Version:** 0.1.0-draft  
**Standard reference:** [Government Standard v0.1.0](../standard/v0.1.0.md)  
**Status:** Threat analysis and control mapping  

This document defines the core threat model governing AI-assisted software engineering in public sector and security-conscious environments. It explains the specific attack vectors, risk scenarios, and failure modes that the controls in the [Government Standard](../standard/v0.1.0.md) are designed to counter.

---

## 1. Scope and assumptions

This threat model addresses AI systems used during the software engineering process, including IDE coding assistants, automated test generators, and semi-autonomous agents equipped with shell, filesystem, or network tool capabilities.

### Assumptions:
1. **Model behaviour is non-deterministic:** An organisation cannot rely on prompt instructions, model fine-tuning, or vendor alignment to guarantee safe behaviour under adversarial conditions.
2. **Untrusted data enters the developer context:** Issues, pull requests, external dependencies, third-party code, and tool outputs routinely enter the agent's context window.
3. **Execution privileges must be bounded externally:** Sandboxing and network isolation must be enforced by the operating system, container runtime, or hypervisor, not by the agent software itself.

---

## 2. Primary threat vectors

### T1: Indirect Prompt Injection via Repositories and Dependencies
* **Description:** An attacker places malicious instructions inside source code comments, README files, issue descriptions, commit histories, or external dependency files. When the AI agent scans or summarises this content, the injected prompt hijacks the model's instructions, directing it to execute unauthorised shell commands, modify security settings, or leak sensitive code.
* **Impact:** Unauthorised command execution, silent backdoor insertion, data exfiltration.
* **Mitigating Controls:**
  - `GS-AI-EXEC-02`: Treat content and tool output as untrusted data.
  - `GS-AI-EXEC-01`: Isolate execution within a hardened boundary.
  - `GS-AI-HUM-01`: Require human authorisation for consequential actions.

### T2: Ambient Credential and Secret Exfiltration
* **Description:** An agent operating within a developer session has read access to environment variables, SSH keys (`~/.ssh`), cloud provider tokens (`~/.aws`, `~/.config/gcloud`), or hardcoded repository secrets. Malicious prompts or hallucinated actions transmit these credentials to external model providers or adversary-controlled endpoints.
* **Impact:** Enterprise infrastructure compromise, unauthorised lateral movement, persistent credential theft.
* **Mitigating Controls:**
  - `GS-AI-DATA-02`: Protect restricted data and secrets.
  - `GS-AI-ACCESS-01`: Limit access to task scope.
  - `GS-AI-ACCESS-02`: Constrain network access (deny arbitrary outbound egress).
  - `GS-AI-ACCESS-03`: Do not grant ambient credentials.

### T3: Package Hallucination and Dependency Squatting ("Slopsquatting")
* **Description:** Generative models frequently hallucinate non-existent package names, libraries, or internal module paths. Adversaries proactively register these common hallucinated names on public registries (e.g. npm, PyPI) containing malicious payloads. When an agent suggests installing the hallucinated package, developers or automated workflows install the attacker's code.
* **Impact:** Direct remote code execution, supply chain compromise.
* **Mitigating Controls:**
  - `GS-AI-SUPPLY-01`: Assess suggested dependencies and tools.
  - `GS-AI-CODE-02`: Verify changes with project controls.
  - `GS-AI-HUM-01`: Require human authorisation for external package additions.

### T4: Unverified Code Generation and Silent Logic Flaws
* **Description:** AI-generated code often introduces subtle functional bugs, insecure default configurations, weak cryptography, authentication bypasses, or outdated APIs that appear syntactically convincing. When developers blindly trust agent output without rigorous inspection, security debt compounds across the codebase.
* **Impact:** Exploitable production vulnerabilities, regulatory non-compliance, system outages.
* **Mitigating Controls:**
  - `GS-AI-CODE-01`: Review AI-generated changes line by line.
  - `GS-AI-CODE-02`: Verify changes with project controls (automated test suites, linters, SAST).
  - `GS-AI-HUM-02`: Retain accountable human ownership.

### T5: Egress Exfiltration via Connected Tools and Plugins
* **Description:** An agent granted web browsing, API querying, or Model Context Protocol (MCP) tool capabilities is tricked into encoding sensitive source code or system telemetry into outbound URL query parameters, HTTP headers, or DNS queries.
* **Impact:** Loss of intellectual property, breach of government data classification rules.
* **Mitigating Controls:**
  - `GS-AI-TOOL-02`: Review extensions and integrations.
  - `GS-AI-ACCESS-02`: Constrain network access via firewall or egress proxies.
  - `GS-AI-DATA-01`: Classify and minimise inputs.

### T6: Training Data Ingestion and Unauthorised Data Retention
* **Description:** Proprietary government source code, configuration files, or sensitive operational logic are transmitted to multi-tenant commercial AI providers that log prompts or reuse customer data for model training.
* **Impact:** Data breach, loss of sovereign control over public sector systems.
* **Mitigating Controls:**
  - `GS-AI-GOV-02`: Assess provider and service terms.
  - `GS-AI-DATA-01`: Classify and minimise inputs.
  - `GS-AI-REVIEW-01`: Reassess continued use and provider policy changes.

---

## 3. Threat-to-control matrix

The matrix below maps each threat scenario to the primary and secondary controls defined in the Government Standard:

| Threat ID | Threat vector | Severity | Primary controls | Supporting controls |
| --- | --- | --- | --- | --- |
| **T1** | Indirect Prompt Injection | High | `GS-AI-EXEC-02`, `GS-AI-EXEC-01` | `GS-AI-HUM-01`, `GS-AI-CODE-01` |
| **T2** | Ambient Credential Exfiltration | Critical | `GS-AI-DATA-02`, `GS-AI-ACCESS-03` | `GS-AI-ACCESS-01`, `GS-AI-ACCESS-02` |
| **T3** | Package Hallucination & Squatting | High | `GS-AI-SUPPLY-01` | `GS-AI-CODE-02`, `GS-AI-HUM-01` |
| **T4** | Unverified & Vulnerable Code | High | `GS-AI-CODE-01`, `GS-AI-CODE-02` | `GS-AI-HUM-02`, `GS-AI-CODE-03` |
| **T5** | Tool & MCP Egress Exfiltration | Critical | `GS-AI-ACCESS-02`, `GS-AI-TOOL-02` | `GS-AI-DATA-01`, `GS-AI-LOG-01` |
| **T6** | Unauthorised Model Training Ingestion | High | `GS-AI-GOV-02`, `GS-AI-DATA-01` | `GS-AI-GOV-01`, `GS-AI-REVIEW-01` |

---

## 4. Residual risk and operational boundaries

Enforcing the controls in this standard significantly mitigates autonomous exploitation, data leakage, and supply chain poisoning. However, organisations must recognise unavoidable residual risks:

1. **Human Fatigue in Review Loops:** When agents generate large volumes of complex code, human reviewers can experience cognitive fatigue, potentially overlooking subtle security flaws (`GS-AI-CODE-01`). Technical static analysis, automated testing, and strict scope limiting (`GS-AI-ACCESS-01`) must act as mandatory safety nets.
2. **Provider Opacity:** Commercial model providers frequently update model checkpoints, internal routing, and backend systems without public notice (`GS-AI-TOOL-01`). Organisations handling sensitive government data must account for this opacity during periodic reviews (`GS-AI-REVIEW-01`).
3. **Instruction File Limitations:** Instruction files (`AGENTS.md`) guide cooperative models but do not constrain compromised or jailbroken systems. Strict operating-system sandboxing (`GS-AI-EXEC-01`) remains the mandatory boundary.
