# DevOps and platform engineering verification profile

**Status:** Implementation guidance  
**Standard reference:** [Government Standard v0.1.0](../../standard/v0.1.0.md) (Controls `GS-AI-EXEC-01`, `GS-AI-ACCESS-01`, `GS-AI-ACCESS-02`, `GS-AI-CODE-03`, `GS-AI-SUPPLY-01`)  
**Applies to:** Infrastructure as Code (Terraform, OpenTofu), container descriptors (Dockerfiles), Kubernetes manifests, and CI/CD automation pipelines generated or modified using AI tools  

This profile guides DevOps, Platform, and Site Reliability Engineers in verifying that infrastructure declarations, deployment pipelines, and orchestration configurations comply with government platform security and supply chain baselines.

---

## 1. The DevOps and platform verification problem

Generative AI coding assistants frequently output infrastructure and deployment declarations that successfully deploy resources but violate fundamental security and compliance invariants. Common defects include:

- Running containers as root (`UID 0`) with default Linux capabilities preserved.
- Configuring cloud security groups or firewall rules open to the world (`0.0.0.0/0`) on administrative ports (SSH 22, database ports).
- Defining cloud storage buckets (e.g. AWS S3, Azure Blob, GCS) without mandatory encryption-at-rest or public access blocks.
- Over-privileged IAM policies using wildcard permissions (`Action: "*", Resource: "*"`) instead of scoped, resource-specific grants.
- Generating Kubernetes pods with `privileged: true`, host path mounts, or omitted CPU and memory limits.
- CI/CD workflow files referencing mutable tags (e.g. `@main`, `@v1`) instead of immutable commit SHAs for third-party actions, exposing build systems to supply chain tampering (`GS-AI-SUPPLY-01`).
- Bypassing repository protections or automated review gates in pipeline configurations (`GS-AI-CODE-03`).

Under control `GS-AI-CODE-02`, automated policy-as-code and static infrastructure scanning are required before applying AI-authored infrastructure.

---

## 2. Government platform engineering pillars

Platform declarations deployed in public sector environments must satisfy five mandatory pillars:

### A. Least Privilege Identity and Access Management (IAM)
* **Zero Wildcard Permissions:** IAM roles and service accounts must grant only the explicit, enumerated actions required for the workload.
* **Separation of Duties:** Workloads running in production must not hold permissions to alter their own IAM policies, logging configurations, or audit trails.

### B. Hardened Container Standards
* **Non-Root Execution:** All container descriptors must declare a non-root `USER` (`UID >= 10000`).
* **Minimal Base Images:** Use distroless or minimal alpine base images to minimise attack surfaces and vulnerability counts.
* **Read-Only Root Filesystems:** Containers should run with read-only root filesystems (`--read-only`), mounting ephemeral storage only where write operations are strictly necessary.

### C. Network Boundary Governance
* **Default-Deny Ingress and Egress:** Security groups and Kubernetes NetworkPolicies must deny all inbound and outbound traffic by default, whitelisting only verified internal dependencies and approved external egress endpoints (`GS-AI-ACCESS-02`).
* **Zero Public Administrative Access:** Management interfaces, databases, and control planes must never be exposed directly to the public internet.

### D. Immutable Supply Chain and CI/CD Integrity
* **Pinned Dependencies and Action SHAs:** All container base images and third-party CI/CD actions must be pinned to full cryptographic commit SHAs or image digests, not floating tags.
* **Preservation of Pipeline Protections:** AI agents must never modify branch protection rules, required status checks, or deployment approval environments (`GS-AI-CODE-03`).

### E. Cryptography and Data at Rest
* **Universal Encryption:** All cloud volumes, databases, object stores, and transit connections must enforce modern encryption (TLS 1.3/1.2 in transit; AES-256 or customer-managed KMS keys at rest).

---

## 3. Local DevOps and IaC verification battery

Platform engineers can execute the following automated scanning battery locally against infrastructure manifests before planning or applying changes:

### Test 1: Infrastructure as Code (IaC) Security Scan (Checkov / Trivy)
Scan Terraform, OpenTofu, CloudFormation, and Kubernetes manifests for misconfigurations and policy violations:

```bash
# Scan IaC manifests with Checkov
checkov -d . --framework terraform,kubernetes,dockerfile --compact

# Or using Trivy for comprehensive config scanning
trivy config . --severity HIGH,CRITICAL --exit-code 1
```

### Test 2: Containerfile / Dockerfile Hardening Lint (Hadolint)
Verify container descriptors against best practices and security baselines:

```bash
# Lint Dockerfile for root user violations and unsafe practices
npx hadolint Dockerfile
```

### Test 3: Kubernetes Manifest Security Lint (Kube-Linter)
Validate Kubernetes pod security standards, capabilities, and resource constraints:

```bash
# Audit Kubernetes YAML declarations
kube-linter lint k8s/
```

### Test 4: CI/CD Workflow Security and Pinning Scan (Zizmor / Actionlint)
Audit GitHub Actions workflow definitions for supply chain vulnerabilities, secret leaks, and unpinned actions:

```bash
# Lint workflow syntax and unpinned action usage
actionlint

# Deep GitHub Actions security audit
zizmor .github/workflows/
```

---

## 4. Common AI DevOps traps and remediations

| Defect category | AI hallucination / Anti-pattern | Remediated government standard pattern |
| --- | --- | --- |
| **Container User** | Omitted `USER` directive (defaults to root `UID 0`) | `USER 10001:10001` with explicit unprivileged runtime execution |
| **IAM Policy** | `Resource: "*"` and `Action: "s3:*"` | Explicit resource ARN and minimal actions (e.g. `s3:GetObject`, `s3:PutObject`) |
| **Storage Security** | `aws_s3_bucket` without encryption or public block | Dedicated `aws_s3_bucket_server_side_encryption_configuration` and `aws_s3_bucket_public_access_block` declaring all blocks `true` |
| **Security Groups** | Inbound CIDR `0.0.0.0/0` on port 22 or 5432 | Restricting ingress strictly to private VPC subnets or VPN gateways |
| **Kubernetes Pods** | `securityContext: privileged: true` | `securityContext: allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, `capabilities: drop: ["ALL"]` |
| **GitHub Actions** | `uses: actions/checkout@v4` | `uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1` (pinned to commit SHA) |

---

## 5. Verification evidence checklist for `GS-AI-CODE-02`

Before deploying AI-generated infrastructure or pipeline configurations into government cloud environments, retain the following evidence:

- [ ] Zero critical or high-severity misconfigurations reported by Checkov, Trivy, or tfsec.
- [ ] Clean Hadolint audit verifying non-root container users and secure package installations.
- [ ] Clean Kube-Linter audit confirming Kubernetes Pod Security Standards (Restricted profile).
- [ ] Verified commit-SHA pinning for all external CI/CD actions and base container images (`GS-AI-SUPPLY-01`).
- [ ] Verified branch protection rules and mandatory human approval gates remain intact (`GS-AI-CODE-03`).
- [ ] Terraform/OpenTofu plan output inspected by a human engineer confirming zero unintended resource destructions.
