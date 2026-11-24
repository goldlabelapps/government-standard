# Government Standard - Development & Verification Harness
# Enforces standards, secret hygiene, and conformance checks

.PHONY: help setup verify audit secrets links clean docker-verify

help:
	@echo "Government Standard Developer Harness"
	@echo ""
	@echo "Targets:"
	@echo "  setup         Configure git hooks and prepare local environment"
	@echo "  verify        Run full verification suite (secrets, links, conformance)"
	@echo "  audit         Generate machine-readable conformance report"
	@echo "  secrets       Scan repository for credential and token leaks"
	@echo "  links         Validate internal markdown links and asset paths"
	@echo "  clean         Remove temporary artifacts and cache directories"
	@echo ""

setup:
	@./bin/setup-hooks

verify:
	@./bin/gov-verify

audit:
	@./bin/gov-verify --conformance --json

secrets:
	@./bin/gov-verify --secrets

links:
	@./bin/gov-verify --links

clean:
	@rm -rf .cache tmp
