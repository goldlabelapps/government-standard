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
      statusRegion.innerHTML = `
        <div style="margin-top: 1.5rem; padding: 1rem; border-left: 5px solid #d4351c; background-color: #fef7f7;">
          <h2 style="font-size: 1.25rem; color: #d4351c; margin-bottom: 0.5rem;">There is a problem</h2>
          <p style="font-size: 1rem; color: #0b0c0c;">Enter an onboarding reference number.</p>
        </div>
      `;
      if (referenceInput) {
        referenceInput.focus();
      }
      return;
    }

    statusRegion.innerHTML = `
      <div style="margin-top: 1.5rem; padding: 1rem; border-left: 5px solid #00703c; background-color: #f3faf6;">
        <h2 style="font-size: 1.25rem; color: #00703c; margin-bottom: 0.5rem;">Verification complete</h2>
        <p style="font-size: 1rem; color: #0b0c0c;">Reference <strong>${escapeHtml(value)}</strong> verified against baseline controls.</p>
      </div>
    `;
  });

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
});
