/* ============================================================
   Interaction layer. Polished, professional, with a light touch.
   Desktop: magnetic accents, trailing cursor, name decode.
   Touch: hover disabled, cheap tap feedback (no lag).
   Plus animated stat counters, a command palette, and a few
   quiet easter eggs. All motion is transform / opacity only.
   ============================================================ */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const yEl = document.getElementById("year");
if (yEl) yEl.textContent = new Date().getFullYear();

/* ---------- reveal on scroll (subtle, staggered) ---------- */
const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const sibs = [...e.target.parentElement.querySelectorAll(":scope > [data-reveal]")];
      const i = Math.max(0, sibs.indexOf(e.target));
      e.target.style.transitionDelay = Math.min(i * 55, 220) + "ms";
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- animated stat counters ---------- */
const statsWrap = document.querySelector("[data-stats]");
if (statsWrap && !reduce && "IntersectionObserver" in window) {
  const so = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      so.unobserve(e.target);
      e.target.querySelectorAll(".stat-num").forEach((el) => {
        const target = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
        const dur = 900; let t0 = null;
        const step = (ts) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + Math.round(target * eased) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
  }, { threshold: 0.4 });
  so.observe(statsWrap);
}

/* ---------- name decode (fast) ---------- */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#%&*<>/";
function scramble(el, text, speed = 1.6) {
  const len = text.length, done = [];
  let frame = 0;
  for (let i = 0; i < len; i++) done[i] = Math.floor(4 + Math.random() * 16) / speed;
  (function tick() {
    let out = "", finished = 0;
    for (let i = 0; i < len; i++) {
      if (text[i] === " ") { out += " "; finished++; }
      else if (frame >= done[i]) { out += text[i]; finished++; }
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out; frame++;
    if (finished < len) requestAnimationFrame(tick); else el.textContent = text;
  })();
}
document.querySelectorAll("[data-scramble]").forEach((el) => {
  const text = el.textContent.trim();
  if (reduce) { el.textContent = text; return; }
  setTimeout(() => scramble(el, text), 120);
});
/* easter egg: click the name to decode it again */
const heroName = document.getElementById("hero-name");
if (heroName && !reduce) heroName.addEventListener("click", () => scramble(heroName, "Zach Krivis"));

/* ---------- magnetic (desktop) ---------- */
if (fine && !reduce) {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.25}px, ${(e.clientY - (r.top + r.height / 2)) * 0.25}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

/* ---------- trailing cursor (desktop) ---------- */
const cursor = document.querySelector(".cursor-dot");
if (cursor && fine && !reduce) {
  let cx = -100, cy = -100, tx = -100, ty = -100;
  window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx - 13}px, ${cy - 13}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("pointerover", (e) => {
    cursor.classList.toggle("is-hot", !!e.target.closest("a, button, [data-magnetic]"));
  });
}

/* ---------- touch tap feedback ---------- */
if (!fine) {
  document.querySelectorAll("[data-tap]").forEach((el) => {
    el.addEventListener("touchstart", () => el.classList.add("tapped"), { passive: true });
    const clear = () => el.classList.remove("tapped");
    el.addEventListener("touchend", clear, { passive: true });
    el.addEventListener("touchcancel", clear, { passive: true });
  });
}

/* ---------- Useless Button demo ---------- */
const useless = document.getElementById("useless");
if (useless) {
  const label = useless.querySelector(".toggle-label");
  let busy = false;
  useless.addEventListener("click", () => {
    if (busy) return; busy = true;
    useless.classList.add("on"); label.textContent = "on";
    setTimeout(() => {
      useless.classList.remove("on"); label.textContent = "off";
      setTimeout(() => { label.textContent = "try it"; busy = false; }, 800);
    }, 600);
  });
}

/* ---------- easter eggs ---------- */
const fireShock = (x, y) => window.dispatchEvent(new MouseEvent("pointerdown", { clientX: x, clientY: y }));
function ripple() {
  let n = 0;
  const t = setInterval(() => {
    fireShock(Math.random() * innerWidth, Math.random() * innerHeight);
    if (++n > 10) clearInterval(t);
  }, 90);
}
function barrelRoll() {
  if (reduce) return;
  const b = document.body;
  b.style.transition = "transform 0.8s cubic-bezier(0.22,0.61,0.36,1)";
  b.style.transform = "rotate(360deg)";
  document.documentElement.style.overflowX = "hidden";
  setTimeout(() => { b.style.transition = ""; b.style.transform = ""; }, 850);
}
function surprise() { [ripple, barrelRoll, () => scramble(heroName || document.body, "Zach Krivis")][Math.floor(Math.random() * 3)](); }

/* ---------- command palette ---------- */
const goto = (s) => document.querySelector(s)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
const COMMANDS = [
  { label: "About", hint: "↵", run: () => goto("#about") },
  { label: "Experience", hint: "↵", run: () => goto("#experience") },
  { label: "Projects", hint: "↵", run: () => goto("#projects") },
  { label: "Writing", hint: "↵", run: () => goto("#writing") },
  { label: "Education", hint: "↵", run: () => goto("#education") },
  { label: "Contact", hint: "↵", run: () => goto("#contact") },
  { label: "Copy email", hint: "zach.krivis@gmail.com", run: () => navigator.clipboard?.writeText("zach.krivis@gmail.com").catch(() => {}) },
  { label: "GitHub", hint: "↗", run: () => window.open("https://github.com/Zxchz", "_blank") },
  { label: "LinkedIn", hint: "↗", run: () => window.open("https://www.linkedin.com/in/zachary-krivis-947406309", "_blank") },
  { label: "Read: The Misdiagnosis", hint: "essay", run: () => window.open("https://docs.google.com/document/d/1xBlzbU96j7mIDcMmMZtc3y_ZjaAd_-wIiEKwWAHl_uI/edit?usp=sharing", "_blank") },
  { label: "Read: A Million Noiseless Qubits", hint: "essay", run: () => window.open("https://docs.google.com/document/d/1a6uny6BQTbIv3HxHEq4DkyFYHz4SQ1a6bkcKBE0TlxY/edit?usp=sharing", "_blank") },
  { label: "Do a barrel roll", hint: "why not", run: barrelRoll },
  { label: "Make it rain", hint: "·", run: ripple },
  { label: "Surprise me", hint: "?", run: surprise },
];

const kbar = document.createElement("div");
kbar.className = "kbar";
kbar.innerHTML = `<div class="kbar-panel" role="dialog" aria-label="Command menu">
  <input class="kbar-input" type="text" placeholder="Type a command or jump to a section..." aria-label="Command" />
  <div class="kbar-list"></div></div>`;
document.body.appendChild(kbar);
const input = kbar.querySelector(".kbar-input");
const list = kbar.querySelector(".kbar-list");
let active = 0, filtered = COMMANDS.slice();

function render() {
  list.innerHTML = "";
  if (!filtered.length) { list.innerHTML = `<div class="kbar-empty">No matches. Try "essay" or "barrel".</div>`; return; }
  filtered.forEach((c, i) => {
    const row = document.createElement("div");
    row.className = "kbar-row" + (i === active ? " active" : "");
    row.innerHTML = `<span class="k-label">${c.label}</span><span class="k-hint">${c.hint}</span>`;
    row.addEventListener("click", () => run(i));
    row.addEventListener("pointermove", () => { active = i; paint(); });
    list.appendChild(row);
  });
}
const paint = () => [...list.children].forEach((c, i) => c.classList.toggle("active", i === active));
function open() { kbar.classList.add("open"); input.value = ""; filtered = COMMANDS.slice(); active = 0; render(); setTimeout(() => input.focus(), 30); }
function close() { kbar.classList.remove("open"); }
function run(i = active) { const c = filtered[i]; close(); if (c) setTimeout(c.run, 100); }

input.addEventListener("input", () => {
  const q = input.value.toLowerCase().trim();
  filtered = COMMANDS.filter((c) => (c.label + " " + c.hint).toLowerCase().includes(q));
  active = 0; render();
});
input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); paint(); }
  else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); paint(); }
  else if (e.key === "Enter") { e.preventDefault(); run(); }
});
kbar.addEventListener("click", (e) => { if (e.target === kbar) close(); });
window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); kbar.classList.contains("open") ? close() : open(); }
  else if (e.key === "Escape") close();
});
document.getElementById("kbar-open")?.addEventListener("click", open);

/* ---------- Konami ---------- */
const K = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let kp = 0;
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === K[kp].toLowerCase()) { if (++kp === K.length) { kp = 0; barrelRoll(); ripple(); } }
  else kp = 0;
});

/* ---------- console hello ---------- */
console.log("%cHey, curious one. Try ⌘K, the Konami code, or click my name.", "color:#c5f04a;font-size:13px");
