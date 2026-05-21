const body = document.body;
const stage = document.querySelector("#stage");
const slides = [...document.querySelectorAll(".slide")];
const replayButton = document.querySelector("#replay");
const referenceButton = document.querySelector("#reference");
const fullscreenButton = document.querySelector("#fullscreen");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const counter = document.querySelector("#counter");

let current = 0;
let slideActivatedAt = 0;
let environmentFocusStep = 0;
const productModelTimers = new WeakMap();
const productModelFrames = new WeakMap();
const ENVIRONMENT_FOCUS_READY_MS = 3900;

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
  updateFullscreenState();
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
  resetEnvironmentFocus(slides[current]);
  resetCounters(slides[current]);
  resetProductModels(slides[current]);

  window.setTimeout(() => {
    body.classList.remove("replay");
    slideActivatedAt = performance.now();
    requestAnimationFrame(() => body.classList.add("ready"));
    animateCounters(slides[current]);
    activateProductModels(slides[current]);
  }, 40);
}

function toggleReference() {
  const active = body.classList.toggle("show-reference");
  referenceButton.setAttribute("aria-pressed", String(active));
}

function fullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement;
}

function fullscreenAvailable() {
  const target = stage || document.documentElement;
  return Boolean(
    (document.fullscreenEnabled && target.requestFullscreen) ||
      (document.webkitFullscreenEnabled && target.webkitRequestFullscreen)
  );
}

async function enterFullscreen() {
  const target = stage || document.documentElement;
  if (target.requestFullscreen) {
    try {
      await target.requestFullscreen({ navigationUI: "hide" });
    } catch {
      await target.requestFullscreen();
    }
    return;
  }
  if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen();
  }
}

async function exitFullscreen() {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

async function toggleFullscreen() {
  if (!fullscreenElement()) {
    await enterFullscreen();
    return;
  }
  await exitFullscreen();
}

function updateFullscreenState() {
  const active = Boolean(fullscreenElement());
  const available = fullscreenAvailable();
  body.classList.toggle("is-fullscreen", active);
  fullscreenButton.classList.toggle("is-unavailable", !available);
  fullscreenButton.setAttribute("aria-pressed", String(active));
  fullscreenButton.title = available
    ? active
      ? "Exit fullscreen"
      : "Enter fullscreen"
    : "Fullscreen blocked by browser. Use Chrome View > Enter Full Screen.";
  fullscreenButton.setAttribute("aria-label", fullscreenButton.title);
}

function goToSlide(index, options = {}) {
  const nextIndex = Math.max(0, Math.min(slides.length - 1, index));
  const previousSlide = slides[current];
  resetProductModels(previousSlide);
  resetEnvironmentFocus(previousSlide);
  current = nextIndex;
  slideActivatedAt = performance.now();

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
  resetProductModels(slides[current]);
  resetEnvironmentFocus(slides[current]);
  if (!options.immediate) {
    body.classList.add("replay");
    body.classList.remove("ready");
    window.setTimeout(() => {
      body.classList.remove("replay");
      slideActivatedAt = performance.now();
      body.classList.add("ready");
      animateCounters(slides[current]);
      activateProductModels(slides[current]);
    }, 40);
  } else {
    animateCounters(slides[current]);
    activateProductModels(slides[current]);
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

function parseOrbit(value) {
  const [theta = "0deg", phi = "65deg", radius = "auto"] = String(value || "").trim().split(/\s+/);
  return {
    theta: Number.parseFloat(theta) || 0,
    phi: Number.parseFloat(phi) || 65,
    radius,
  };
}

function setModelOrbit(model, orbit) {
  model.setAttribute("camera-orbit", `${orbit.theta.toFixed(2)}deg ${orbit.phi.toFixed(2)}deg ${orbit.radius}`);
}

function bindProductModel(model) {
  if (model.dataset.modelBound === "true") return;
  model.dataset.modelBound = "true";

  model.addEventListener("load", () => {
    model.classList.add("is-loaded");
    model.classList.remove("is-failed");
  });

  model.addEventListener("error", () => {
    model.classList.add("is-failed");
  });
}

function loadProductModel(model) {
  bindProductModel(model);
  if (!model.getAttribute("src") && model.dataset.src) {
    model.setAttribute("src", model.dataset.src);
  }
}

function resetProductModel(model) {
  const timer = productModelTimers.get(model);
  const frame = productModelFrames.get(model);
  if (timer) window.clearTimeout(timer);
  if (frame) window.cancelAnimationFrame(frame);
  productModelTimers.delete(model);
  productModelFrames.delete(model);
  model.classList.remove("is-spinning", "is-settled", "is-failed");
  setModelOrbit(model, parseOrbit(model.dataset.startOrbit || model.getAttribute("camera-orbit")));
}

function animateProductModel(model) {
  loadProductModel(model);
  resetProductModel(model);

  const startOrbit = parseOrbit(model.dataset.startOrbit || model.getAttribute("camera-orbit"));
  const finalOrbit = parseOrbit(model.dataset.finalOrbit || model.getAttribute("camera-orbit"));

  if (body.classList.contains("instant")) {
    setModelOrbit(model, finalOrbit);
    model.classList.add("is-settled");
    return;
  }

  const delay = Number(model.dataset.modelDelay) || 0;
  const duration = Number(model.dataset.modelDuration) || 2200;
  const timer = window.setTimeout(() => {
    const startTime = performance.now();
    model.classList.add("is-spinning");

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setModelOrbit(model, {
        theta: startOrbit.theta + (finalOrbit.theta - startOrbit.theta) * eased,
        phi: startOrbit.phi + (finalOrbit.phi - startOrbit.phi) * eased,
        radius: finalOrbit.radius,
      });

      if (progress < 1) {
        productModelFrames.set(model, window.requestAnimationFrame(tick));
        return;
      }

      productModelFrames.delete(model);
      model.classList.remove("is-spinning");
      model.classList.add("is-settled");
      setModelOrbit(model, finalOrbit);
    }

    productModelFrames.set(model, window.requestAnimationFrame(tick));
  }, delay);

  productModelTimers.set(model, timer);
}

function resetProductModels(slide) {
  if (!slide) return;
  slide.querySelectorAll("[data-product-model]").forEach(resetProductModel);
}

function activateProductModels(slide) {
  if (!slide) return;
  slide.querySelectorAll("[data-product-model]").forEach(animateProductModel);
}

function isEnvironmentSlide(slide = slides[current]) {
  return Boolean(slide?.classList.contains("slide-environments"));
}

function resetEnvironmentFocus(slide) {
  if (!slide || !isEnvironmentSlide(slide)) return;
  if (slide === slides[current]) {
    environmentFocusStep = 0;
  }
  slide.classList.remove("env-focus-active");
  delete slide.dataset.envFocusStep;
  slide.querySelectorAll(".env-card").forEach((card) => {
    card.classList.remove("is-env-focused");
    card.removeAttribute("aria-current");
  });
  slide.querySelectorAll(".env-node").forEach((node) => {
    node.classList.remove("is-env-node-focused");
  });
}

function setEnvironmentFocusStep(step) {
  const slide = slides[current];
  if (!isEnvironmentSlide(slide)) return false;

  const cards = [...slide.querySelectorAll(".env-card")];
  const nodes = [...slide.querySelectorAll(".env-node")];
  const nextStep = Math.max(0, Math.min(cards.length, step));
  environmentFocusStep = nextStep;

  slide.classList.toggle("env-focus-active", nextStep > 0);
  if (nextStep > 0) {
    slide.dataset.envFocusStep = String(nextStep);
  } else {
    delete slide.dataset.envFocusStep;
  }

  cards.forEach((card, index) => {
    const active = index === nextStep - 1;
    card.classList.toggle("is-env-focused", active);
    if (active) {
      card.setAttribute("aria-current", "step");
    } else {
      card.removeAttribute("aria-current");
    }
  });

  nodes.forEach((node, index) => {
    node.classList.toggle("is-env-node-focused", index === nextStep - 1);
  });

  return true;
}

function environmentFocusReady() {
  return body.classList.contains("instant") || performance.now() - slideActivatedAt >= ENVIRONMENT_FOCUS_READY_MS;
}

function advanceEnvironmentFocus() {
  const slide = slides[current];
  if (!isEnvironmentSlide(slide)) return false;

  const cardCount = slide.querySelectorAll(".env-card").length;
  if (environmentFocusStep >= cardCount) return false;
  if (!environmentFocusReady()) return true;

  setEnvironmentFocusStep(environmentFocusStep + 1);
  return true;
}

function rewindEnvironmentFocus() {
  if (!isEnvironmentSlide() || environmentFocusStep <= 0) return false;
  setEnvironmentFocusStep(environmentFocusStep - 1);
  return true;
}

function navigateForward() {
  if (advanceEnvironmentFocus()) return;
  goToSlide(current + 1);
}

function navigateBackward() {
  if (rewindEnvironmentFocus()) return;
  goToSlide(current - 1);
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
fullscreenButton.addEventListener("click", () => {
  toggleFullscreen().catch(() => {
    fullscreenButton.classList.add("is-denied");
    window.setTimeout(() => fullscreenButton.classList.remove("is-denied"), 900);
  });
});
prevButton.addEventListener("click", navigateBackward);
nextButton.addEventListener("click", navigateForward);
document.addEventListener("fullscreenchange", updateFullscreenState);
document.addEventListener("webkitfullscreenchange", updateFullscreenState);

stage.addEventListener("click", (event) => {
  if (!isEnvironmentSlide()) return;
  if (event.target instanceof Element && event.target.closest(".controls, button, a")) return;
  event.preventDefault();
  navigateForward();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    navigateForward();
  }
  if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    navigateBackward();
  }
  if (event.key.toLowerCase() === "r") {
    replayIntro();
  }
  if (event.key.toLowerCase() === "f") {
    toggleReference();
  }
});

window.addEventListener("hashchange", () => {
  const nextIndex = slideIndexFromHash();
  if (nextIndex !== current) {
    goToSlide(nextIndex, { preserveHash: true });
  }
});

window.addEventListener("pointermove", updatePointerParallax, { passive: true });
window.addEventListener("load", boot, { once: true });
