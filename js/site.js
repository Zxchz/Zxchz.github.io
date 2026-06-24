/* ============================================================
   Interaction layer. Deliberately small and cheap. Motion is
   transform / opacity only, driven directly by scroll position
   (no scroll hijacking, no heavy libraries):
     - hero pin: title/lede/meta scale + fade, scrubbed by scroll
     - content reveals: lightweight scroll-linked opacity/translate
   Plus: stat count-ups, name decode, the Useless Button demo, a
   command palette, scrollspy, chord nav, and two easter eggs.
   ============================================================ */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);

const yEl = document.getElementById("year");
if (yEl) yEl.textContent = new Date().getFullYear();

/* ---------- hero pin: scroll-scrubbed unpack ---------- */
const heroPin = document.querySelector(".hero-pin");
const heroEls = [...document.querySelectorAll("[data-h]")];
if (heroPin && heroEls.length && !reduce) {
  let ticking = false;
  function renderHero() {
    ticking = false;
    const vh = window.innerHeight;
    const rect = heroPin.getBoundingClientRect();
    const total = heroPin.offsetHeight - vh;
    const p = total > 0 ? clamp(-rect.top / total, 0, 1) : 0;
    for (const el of heroEls) {
      let o = 1, ty = 0, sc = 1;
      switch (el.dataset.h) {
        case "status": { const out = seg(p, 0, 0.12); o = 1 - out; ty = -out * 26; break; }
        case "title":  { const out = seg(p, 0.30, 0.62); o = 1 - out; ty = -p * 68 - out * 36; sc = 1 + p * 0.10; break; }
        case "lede":   { const out = seg(p, 0.12, 0.42); o = 1 - out; ty = -out * 50 - p * 10; break; }
        case "meta":   { const out = seg(p, 0.22, 0.50); o = 1 - out; ty = -out * 50 - p * 14; break; }
        case "cue":    { o = 1 - seg(p, 0, 0.08); break; }
      }
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
    }
  }
  const onHero = () => { if (!ticking) { ticking = true; requestAnimationFrame(renderHero); } };
  window.addEventListener("scroll", onHero, { passive: true });
  window.addEventListener("resize", onHero, { passive: true });
  renderHero();
}

/* ---------- content reveals: scroll-linked (scrubbed, not CSS transitions) ---------- */
const revealEls = [...document.querySelectorAll("[data-reveal]")];
if (reduce || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
} else {
  const active = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) active.add(e.target);
      else {
        // left the top already revealed -> pin to final state; left the bottom -> keep hidden
        if (e.boundingClientRect.top < 0) { e.target.style.opacity = "1"; e.target.style.transform = "none"; }
        active.delete(e.target);
      }
    });
    if (active.size) onReveal();
  }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
  revealEls.forEach((el) => io.observe(el));

  let ticking = false;
  function renderReveal() {
    ticking = false;
    const vh = window.innerHeight;
    active.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh * 0.26), 0, 1);
      el.style.opacity = p.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - p) * 18).toFixed(1)}px, 0)`;
      if (p >= 1) { el.style.opacity = "1"; el.style.transform = "none"; active.delete(el); io.unobserve(el); }
    });
  }
  const onReveal = () => { if (!ticking) { ticking = true; requestAnimationFrame(renderReveal); } };
  window.addEventListener("scroll", onReveal, { passive: true });
  window.addEventListener("resize", onReveal, { passive: true });
  renderReveal();
}

/* ---------- stat count-ups ---------- */
const statsWrap = document.querySelector("[data-stats]");
if (statsWrap && !reduce && "IntersectionObserver" in window) {
  const so = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      so.unobserve(e.target);
      e.target.querySelectorAll(".fig").forEach((el) => {
        const target = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
        let t0 = null;
        const step = (ts) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / 850, 1);
          el.textContent = pre + Math.round(target * (1 - Math.pow(1 - p, 3))) + suf;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
  }, { threshold: 0.5 });
  so.observe(statsWrap);
}

/* ---------- name decode (subtle) ---------- */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function scramble(el, text) {
  const len = text.length, done = [];
  let frame = 0;
  for (let i = 0; i < len; i++) done[i] = Math.floor(3 + Math.random() * 12);
  (function tick() {
    let out = "", finished = 0;
    for (let i = 0; i < len; i++) {
      if (text[i] === " ") { out += " "; finished++; }
      else if (frame >= done[i]) { out += text[i]; finished++; }
      else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.firstChild ? (el.childNodes[0].nodeValue = out) : (el.textContent = out);
    frame++;
    if (finished < len) requestAnimationFrame(tick);
    else el.childNodes[0].nodeValue = text;
  })();
}
const heroName = document.getElementById("hero-name");
if (heroName && !reduce) {
  const base = "Zach Krivis";
  setTimeout(() => scramble(heroName, base), 180);
  heroName.style.cursor = "pointer";
  heroName.addEventListener("click", () => scramble(heroName, base));
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
      setTimeout(() => { label.textContent = "try it"; busy = false; }, 750);
    }, 550);
  });
}

/* ---------- command palette ---------- */
const goto = (s) => document.querySelector(s)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
const toggleGrid = () => document.body.classList.toggle("show-grid");
const COMMANDS = [
  { label: "About", hint: "01", run: () => goto("#about") },
  { label: "Experience", hint: "02", run: () => goto("#work") },
  { label: "Projects", hint: "03", run: () => goto("#projects") },
  { label: "Writing", hint: "04", run: () => goto("#writing") },
  { label: "Education", hint: "05", run: () => goto("#education") },
  { label: "Skills", hint: "06", run: () => goto("#skills") },
  { label: "Contact", hint: "07", run: () => goto("#contact") },
  { label: "Copy email", hint: "zach.krivis@gmail.com", run: () => navigator.clipboard?.writeText("zach.krivis@gmail.com").catch(() => {}) },
  { label: "GitHub", hint: "↗", run: () => window.open("https://github.com/Zxchz", "_blank") },
  { label: "LinkedIn", hint: "↗", run: () => window.open("https://www.linkedin.com/in/zachary-krivis-947406309", "_blank") },
  { label: "Read: The Misdiagnosis", hint: "essay", run: () => window.open("https://docs.google.com/document/d/1xBlzbU96j7mIDcMmMZtc3y_ZjaAd_-wIiEKwWAHl_uI/edit?usp=sharing", "_blank") },
  { label: "Read: A Million Noiseless Qubits", hint: "essay", run: () => window.open("https://docs.google.com/document/d/1a6uny6BQTbIv3HxHEq4DkyFYHz4SQ1a6bkcKBE0TlxY/edit?usp=sharing", "_blank") },
  { label: "Toggle layout grid", hint: "for the nerds", run: toggleGrid },
];

const kbar = document.createElement("div");
kbar.className = "kbar";
kbar.innerHTML = `<div class="kbar-panel" role="dialog" aria-label="Command menu">
  <input class="kbar-input" type="text" placeholder="Jump to a section or run a command" aria-label="Command" />
  <div class="kbar-list"></div></div>`;
document.body.appendChild(kbar);
const input = kbar.querySelector(".kbar-input");
const list = kbar.querySelector(".kbar-list");
let activeCmd = 0, filtered = COMMANDS.slice();

function renderRows() {
  list.innerHTML = "";
  if (!filtered.length) { list.innerHTML = `<div class="kbar-empty">No matches.</div>`; return; }
  filtered.forEach((c, i) => {
    const row = document.createElement("div");
    row.className = "kbar-row" + (i === activeCmd ? " active" : "");
    row.innerHTML = `<span class="k-label">${c.label}</span><span class="k-hint">${c.hint}</span>`;
    row.addEventListener("click", () => run(i));
    row.addEventListener("pointermove", () => { activeCmd = i; paint(); });
    list.appendChild(row);
  });
}
const paint = () => [...list.children].forEach((c, i) => c.classList.toggle("active", i === activeCmd));
function openBar() { kbar.classList.add("open"); input.value = ""; filtered = COMMANDS.slice(); activeCmd = 0; renderRows(); setTimeout(() => input.focus(), 30); }
function closeBar() { kbar.classList.remove("open"); }
function run(i = activeCmd) { const c = filtered[i]; closeBar(); if (c) setTimeout(c.run, 90); }

input.addEventListener("input", () => {
  const q = input.value.toLowerCase().trim();
  filtered = COMMANDS.filter((c) => (c.label + " " + c.hint).toLowerCase().includes(q));
  activeCmd = 0; renderRows();
});
input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); activeCmd = Math.min(activeCmd + 1, filtered.length - 1); paint(); }
  else if (e.key === "ArrowUp") { e.preventDefault(); activeCmd = Math.max(activeCmd - 1, 0); paint(); }
  else if (e.key === "Enter") { e.preventDefault(); run(); }
});
kbar.addEventListener("click", (e) => { if (e.target === kbar) closeBar(); });
window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); kbar.classList.contains("open") ? closeBar() : openBar(); }
  else if (e.key === "Escape") closeBar();
});
document.getElementById("kbar-open")?.addEventListener("click", openBar);

/* ---------- Konami: reveal the grid ---------- */
const K = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let kp = 0;
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === K[kp].toLowerCase()) { if (++kp === K.length) { kp = 0; toggleGrid(); } }
  else kp = 0;
});

/* ---------- last-updated stamp (live from GitHub, baked fallback) ---------- */
const updatedEl = document.getElementById("updated");
if (updatedEl) {
  fetch("https://api.github.com/repos/Zxchz/zxchz.github.io/commits?per_page=1", { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d) => {
      const iso = d?.[0]?.commit?.committer?.date;
      if (!iso) return;
      updatedEl.textContent = "Updated " + new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    })
    .catch(() => {});
}

/* ---------- active section (scrollspy) ---------- */
const navMap = new Map();
document.querySelectorAll(".nav-links a").forEach((a) => {
  const href = a.getAttribute("href") || "";
  if (href.startsWith("#") && href.length > 1) navMap.set(href.slice(1), a);
});
const spySections = [...navMap.keys()].map((id) => document.getElementById(id)).filter(Boolean);
if (spySections.length && "IntersectionObserver" in window) {
  let current = null;
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      if (current) navMap.get(current)?.classList.remove("active");
      current = e.target.id;
      navMap.get(current)?.classList.add("active");
    });
  }, { rootMargin: "-50% 0px -45% 0px", threshold: 0 });
  spySections.forEach((s) => spy.observe(s));
}

/* ---------- keyboard chord nav: press g, then a section key ---------- */
const CHORD = { h: "#top", a: "#about", e: "#work", p: "#projects", w: "#writing", d: "#education", s: "#skills", c: "#contact" };
const hint = document.createElement("div");
hint.className = "chord-hint";
hint.setAttribute("aria-hidden", "true");
hint.innerHTML =
  '<span><kbd>a</kbd>about</span><span><kbd>e</kbd>exp</span><span><kbd>p</kbd>projects</span>' +
  '<span><kbd>w</kbd>writing</span><span><kbd>s</kbd>skills</span><span><kbd>c</kbd>contact</span>';
document.body.appendChild(hint);
let armed = false, chordTimer = 0;
const disarm = () => { armed = false; hint.classList.remove("show"); clearTimeout(chordTimer); };
window.addEventListener("keydown", (e) => {
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || e.metaKey || e.ctrlKey || e.altKey) return;
  if (kbar.classList.contains("open")) return;
  const k = e.key.toLowerCase();
  if (!armed) {
    if (k === "g") { armed = true; hint.classList.add("show"); clearTimeout(chordTimer); chordTimer = setTimeout(disarm, 1600); }
    return;
  }
  if (CHORD[k]) { e.preventDefault(); goto(CHORD[k]); }
  disarm();
});

/* ---------- directional link underlines ---------- */
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const side = (el, e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--uo", e.clientX - r.left < r.width / 2 ? "left" : "right");
  };
  document.querySelectorAll(".link, .nav-links a").forEach((el) => {
    el.addEventListener("pointerenter", (e) => side(el, e));
    el.addEventListener("pointerleave", (e) => side(el, e));
  });
}

console.log("%cBuilt by hand. Try ⌘K, press g then a section key, or the Konami code.", "color:#c8f135;font-family:monospace");
