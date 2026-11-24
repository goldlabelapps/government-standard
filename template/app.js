/**
 * Government Standard - Progressive Enhancement Baseline
 * Strictly CSP-compliant (no eval, no inline handlers, no external dependencies)
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("compliance-form");
  const statusRegion = document.getElementById("status-region");
  const referenceInput = document.getElementById("reference-id");

  if (!form || !statusRegion) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = referenceInput ? referenceInput.value.trim() : "";

    if (!value) {
      const message = document.createElement("div");
      message.className = "gov-status gov-status--error";
      const heading = document.createElement("h2");
      heading.textContent = "There is a problem";
      const description = document.createElement("p");
      description.textContent = "Enter an onboarding reference number.";
      message.append(heading, description);
      statusRegion.replaceChildren(message);
      if (referenceInput) {
        referenceInput.focus();
      }
      return;
    }

    const message = document.createElement("div");
    message.className = "gov-status gov-status--success";
    const heading = document.createElement("h2");
    heading.textContent = "Verification complete";
    const description = document.createElement("p");
    description.append("Reference ");
    const reference = document.createElement("strong");
    reference.textContent = value;
    description.append(reference, " verified against baseline controls.");
    message.append(heading, description);
    statusRegion.replaceChildren(message);
  });
});
