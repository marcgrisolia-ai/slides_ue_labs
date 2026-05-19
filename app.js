const body = document.body;
const stage = document.querySelector("#stage");
const slides = [...document.querySelectorAll(".slide")];
const replayButton = document.querySelector("#replay");
const referenceButton = document.querySelector("#reference");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const counter = document.querySelector("#counter");

let current = 0;

function splitDisplayText() {
  document.querySelectorAll("[data-split]").forEach((node) => {
    if (node.dataset.splitDone === "true") return;
    const text = node.textContent;
    node.textContent = "";
    node.dataset.splitDone = "true";

    [...text].forEach((char, index) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--char-index", index);
      span.textContent = char === " " ? "\u00a0" : char;
      node.appendChild(span);
    });
  });
}

function boot() {
  splitDisplayText();
  if (new URLSearchParams(window.location.search).has("instant")) {
    body.classList.add("instant");
  }
  goToSlide(slideIndexFromHash(), { immediate: true, preserveHash: true });
  requestAnimationFrame(() => body.classList.add("ready"));
}

function slideIndexFromHash() {
  const match = window.location.hash.match(/slide-(\d+)/);
  if (!match) return 0;
  return Math.max(0, Math.min(slides.length - 1, Number(match[1]) - 1));
}

function replayIntro() {
  body.classList.add("replay");
  body.classList.remove("ready");
  resetCounters(slides[current]);

  window.setTimeout(() => {
    body.classList.remove("replay");
    requestAnimationFrame(() => body.classList.add("ready"));
    animateCounters(slides[current]);
  }, 40);
}

function toggleReference() {
  const active = body.classList.toggle("show-reference");
  referenceButton.setAttribute("aria-pressed", String(active));
}

function goToSlide(index, options = {}) {
  const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
  current = nextIndex;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === current);
    slide.classList.toggle("is-before", slideIndex < current);
    slide.classList.toggle("is-after", slideIndex > current);
  });

  counter.textContent = `${String(current + 1).padStart(2, "0")} / 13`;
  prevButton.disabled = current === 0;
  nextButton.disabled = current === slides.length - 1;
  if (!options.preserveHash) {
    history.replaceState(null, "", `#slide-${current + 1}`);
  }

  resetCounters(slides[current]);
  if (!options.immediate) {
    body.classList.add("replay");
    body.classList.remove("ready");
    window.setTimeout(() => {
      body.classList.remove("replay");
      body.classList.add("ready");
      animateCounters(slides[current]);
    }, 40);
  } else {
    animateCounters(slides[current]);
  }
}

function resetCounters(slide) {
  slide.querySelectorAll("[data-count]").forEach((node) => {
    node.textContent = "0";
  });
}

function animateCounters(slide) {
  slide.querySelectorAll("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    if (body.classList.contains("instant")) {
      node.textContent = target.toLocaleString("en-US").replace(",", "");
      return;
    }
    const duration = target > 100 ? 1250 : 760;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      node.textContent = Math.round(target * eased).toLocaleString("en-US").replace(",", "");
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

function updatePointerParallax(event) {
  const rect = stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  stage.style.setProperty("--mx", x.toFixed(4));
  stage.style.setProperty("--my", y.toFixed(4));

  const activeSlide = slides[current];
  const photo = activeSlide.querySelector(".photo-field img");
  const lines = activeSlide.querySelector(".signal-lines");
  if (photo) {
    photo.style.translate = `${x * -18}px ${y * -12}px`;
  }
  if (lines) {
    lines.style.translate = `${x * 24}px ${y * 18}px`;
  }
}

replayButton.addEventListener("click", replayIntro);
referenceButton.addEventListener("click", toggleReference);
prevButton.addEventListener("click", () => goToSlide(current - 1));
nextButton.addEventListener("click", () => goToSlide(current + 1));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    goToSlide(current + 1);
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(current - 1);
  }
  if (event.key.toLowerCase() === "r") {
    replayIntro();
  }
  if (event.key.toLowerCase() === "f") {
    toggleReference();
  }
});

window.addEventListener("pointermove", updatePointerParallax, { passive: true });
window.addEventListener("load", boot, { once: true });
