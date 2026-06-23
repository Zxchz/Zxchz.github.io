/* ============================================================
   Site interactions — the "alive" layer.
   Independent of the canvas: text scramble, magnetic hovers,
   a trailing cursor, a ⌘K command palette, the Useless Button,
   reveal-on-scroll, and a Konami easter egg.
   ============================================================ */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- year ---------- */
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

/* ---------- reveal ---------- */
const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- scroll pct (kept global for any consumers) ---------- */
function scrollPct() {
  const hgt = document.documentElement.scrollHeight - window.innerHeight;
  window.__scrollPct = hgt > 0 ? Math.min(window.scrollY / hgt, 1) : 0;
}
window.addEventListener("scroll", scrollPct, { passive: true });
scrollPct();

/* ---------- text scramble ---------- */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*<>/\\{}[]01";
function scramble(el, finalText, speed = 1) {
  const len = finalText.length;
  let frame = 0;
  const reveals = [];
  for (let i = 0; i < len; i++) {
    reveals[i] = Math.floor(8 + Math.random() * 26) / speed;
  }
  function tick() {
    let out = "";
    let done = 0;
    for (let i = 0; i < len; i++) {
      if (frame >= reveals[i]) { out += finalText[i]; done++; }
      else if (finalText[i] === " ") { out += " "; done++; }
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    frame++;
    if (done < len) requestAnimationFrame(tick);
    else el.textContent = finalText;
  }
  tick();
}
const scrambleEls = document.querySelectorAll("[data-scramble]");
scrambleEls.forEach((el) => {
  const text = el.textContent.trim();
  el.dataset.text = text;
  if (reduce) { el.textContent = text; return; }
  setTimeout(() => scramble(el, text), 150);
  // re-scramble on hover (desktop)
  if (fine) el.addEventListener("pointerenter", () => scramble(el, text, 1.6));
});

/* ---------- magnetic ---------- */
if (fine && !reduce) {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.34;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

/* ---------- trailing cursor ---------- */
const cursor = document.querySelector(".cursor-dot");
if (cursor && fine && !reduce) {
  let cx = -100, cy = -100, tx = -100, ty = -100;
  window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
    cursor.style.transform = `translate(${cx - 3.5}px, ${cy - 3.5}px)`;
    requestAnimationFrame(loop);
  })();
  const hot = "a, button, [data-magnetic], input";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(hot)) cursor.classList.add("is-big");
    else cursor.classList.remove("is-big");
  });
}

/* ---------- the Useless Button ---------- */
const useless = document.getElementById("useless");
if (useless) {
  const label = useless.querySelector(".useless-label");
  let busy = false;
  useless.addEventListener("click", () => {
    if (busy) return;
    busy = true;
    useless.classList.add("on");
    label.textContent = "...on?";
    // it refuses to stay on
    setTimeout(() => {
      useless.classList.remove("on");
      label.textContent = "nope.";
      setTimeout(() => { label.textContent = "press me"; busy = false; }, 900);
    }, 650);
  });
}

/* ---------- command palette ---------- */
const fireShock = (x, y) =>
  window.dispatchEvent(new MouseEvent("pointerdown", { clientX: x, clientY: y }));

function makeItRain() {
  let n = 0;
  const t = setInterval(() => {
    fireShock(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    if (++n > 14) clearInterval(t);
  }, 90);
}

const goto = (sel) => document.querySelector(sel)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });

const COMMANDS = [
  { label: "About", hint: "who", run: () => goto("#about") },
  { label: "Build log", hint: "work", run: () => goto("#work") },
  { label: "Say hi", hint: "contact", run: () => goto("#contact") },
  { label: "Copy email", hint: "zach.krivis@gmail.com", run: copyEmail },
  { label: "GitHub", hint: "↗", run: () => window.open("https://github.com/Zxchz", "_blank") },
  { label: "LinkedIn", hint: "↗", run: () => window.open("https://www.linkedin.com/in/zachary-krivis-947406309", "_blank") },
  { label: "Press the useless button", hint: "why", run: () => { goto("#work"); setTimeout(() => useless?.click(), 600); } },
  { label: "Make it rain", hint: "↯", run: makeItRain },
];

function copyEmail() {
  navigator.clipboard?.writeText("zach.krivis@gmail.com").catch(() => {});
}

// build DOM
const kbar = document.createElement("div");
kbar.className = "kbar";
kbar.innerHTML = `
  <div class="kbar-panel" role="dialog" aria-label="Command menu">
    <input class="kbar-input" type="text" placeholder="type a command…" aria-label="Command" />
    <div class="kbar-list"></div>
  </div>`;
document.body.appendChild(kbar);
const input = kbar.querySelector(".kbar-input");
const list = kbar.querySelector(".kbar-list");
let active = 0, filtered = COMMANDS.slice();

function renderList() {
  list.innerHTML = "";
  if (!filtered.length) {
    list.innerHTML = `<div class="kbar-empty">nothing here. try "make it rain".</div>`;
    return;
  }
  filtered.forEach((cmd, i) => {
    const row = document.createElement("div");
    row.className = "kbar-row" + (i === active ? " active" : "");
    row.innerHTML = `<span class="k-label">${cmd.label}</span><span class="k-hint">${cmd.hint}</span>`;
    row.addEventListener("click", () => runActive(i));
    row.addEventListener("pointermove", () => { active = i; paint(); });
    list.appendChild(row);
  });
}
function paint() {
  [...list.children].forEach((c, i) => c.classList.toggle("active", i === active));
}
function openBar() {
  kbar.classList.add("open");
  input.value = ""; filtered = COMMANDS.slice(); active = 0; renderList();
  setTimeout(() => input.focus(), 30);
}
function closeBar() { kbar.classList.remove("open"); }
function runActive(i = active) {
  const cmd = filtered[i];
  closeBar();
  if (cmd) setTimeout(cmd.run, 120);
}

input.addEventListener("input", () => {
  const q = input.value.toLowerCase().trim();
  filtered = COMMANDS.filter((c) => (c.label + " " + c.hint).toLowerCase().includes(q));
  active = 0; renderList();
});
input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, filtered.length - 1); paint(); }
  else if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); paint(); }
  else if (e.key === "Enter") { e.preventDefault(); runActive(); }
});
kbar.addEventListener("click", (e) => { if (e.target === kbar) closeBar(); });

window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); kbar.classList.contains("open") ? closeBar() : openBar(); }
  else if (e.key === "Escape") closeBar();
});
document.getElementById("kbar-open")?.addEventListener("click", openBar);
document.getElementById("kbar-open-2")?.addEventListener("click", openBar);

/* ---------- Konami ---------- */
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let kPos = 0;
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === KONAMI[kPos].toLowerCase()) {
    if (++kPos === KONAMI.length) { kPos = 0; makeItRain(); }
  } else kPos = 0;
});
