/* ============================================================
   UI layer — runs independently of WebGL so content is never
   blocked by a 3D/asset failure.
   Handles: reveal-on-scroll, scroll progress, year stamp.
   ============================================================ */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Year stamp
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal on scroll
const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !prefersReduced) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Scroll progress bar + a global the field can read
const progressBar = document.getElementById("progress-bar");
function updateScroll() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const pct = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
  window.__scrollPct = pct;
  if (progressBar) progressBar.style.width = (pct * 100).toFixed(2) + "%";
}
window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("resize", updateScroll, { passive: true });
updateScroll();
