(function () {
  "use strict";

  function recommendedCount(population, z, margin) {
    if (!Number.isSafeInteger(population) || population < 1 ||
        ![1.645, 1.96, 2.576].includes(z) ||
        !Number.isFinite(margin) || margin < 0.1 || margin > 50) {
      return null;
    }
    const n0 = z * z * 0.25 / Math.pow(margin / 100, 2);
    return Math.min(population, Math.ceil(n0 / (1 + (n0 - 1) / population)));
  }

  document.querySelectorAll("[data-sample-size]").forEach(function (widget) {
    const population = widget.querySelector("[data-population]");
    const confidence = widget.querySelector("[data-confidence]");
    const margin = widget.querySelector("[data-margin]");
    const result = widget.querySelector("[data-result]");
    const detail = widget.querySelector("[data-detail]");

    function update() {
      const total = Number(population.value);
      const error = Number(margin.value);
      const count = recommendedCount(total, Number(confidence.value), error);
      population.setAttribute("aria-invalid", String(!Number.isSafeInteger(total) || total < 1));
      margin.setAttribute("aria-invalid", String(!Number.isFinite(error) || error < 0.1 || error > 50));
      if (count === null) {
        result.textContent = "Check your inputs";
        detail.textContent = "Enter a whole population from 1 to 9,007,199,254,740,991 and a margin from 0.1 to 50 percentage points.";
        return;
      }
      result.textContent = "Test " + count.toLocaleString("en-US") + " items";
      detail.textContent = count.toLocaleString("en-US") + " of " +
        total.toLocaleString("en-US") + " items (" + (100 * count / total).toFixed(1) +
        "%), at " + confidence.selectedOptions[0].textContent +
        " confidence and ±" + error + " percentage points. This is an approximate proportion-estimation sample size, not an acceptance plan.";
    }
    widget.addEventListener("input", update);
    widget.addEventListener("change", update);
    update();
  });
})();
