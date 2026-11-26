/* The Unexpected Science Teacher - three-level system for every lab.
   Guided   : sentence starters, word bank, read-aloud buttons (SPED / support)
   Standard : the lab as written
   Challenge: extra analysis questions (advanced / GT)

   A lab defines window.LAB_LEVELS before loading this file:
   { key, stems: { textareaId: "starter" }, words: [[term, meaning]],
     challenge: [{ after: "textareaId", id: "newId", label: "question" }] }
   Load this file with a plain <script> placed BEFORE the lab's own script,
   so the extra challenge boxes exist before the lab restores saved work.
   Teachers can link straight to a level: .../#guided  .../#standard  .../#challenge
   Nothing here sends data anywhere. */
(function () {
  "use strict";
  var C = window.LAB_LEVELS || {};
  var LEVELS = [
    { id: "guided", label: "Guided", icon: "🧭", desc: "Sentence starters, a word bank and read-aloud" },
    { id: "standard", label: "Standard", icon: "🎯", desc: "The full lab" },
    { id: "challenge", label: "Challenge", icon: "🚀", desc: "Extra analysis questions" }
  ];
  var KEY = "ust-level:" + (C.key || location.pathname);
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  var css = el("style");
  css.textContent =
    ".lv-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:0 0 14px;padding:10px 12px;background:#fff;border:1px solid #c9d6df;border-radius:10px}" +
    ".lv-bar strong{margin-right:4px}.lv-bar .lv-opts{display:inline-flex;border:1px solid #c9d6df;border-radius:8px;overflow:hidden}" +
    ".lv-bar button{border:0;border-radius:0;background:#fff;color:#153047;padding:9px 14px;font-weight:700;cursor:pointer;font-size:15px}" +
    ".lv-bar button[aria-checked=true]{background:#153047;color:#fff}.lv-bar .lv-desc{color:#516273;font-size:14px}" +
    ".lv-g,.lv-c{display:none}body.lv-guided .lv-g{display:block}body.lv-challenge .lv-c{display:block}" +
    ".lv-stem{background:#fff8e6;border-left:5px solid #f4b942;padding:8px 10px;margin:4px 0 6px;font-size:15px;border-radius:0 6px 6px 0}" +
    ".lv-stem button{margin-left:8px;padding:4px 10px;font-size:13px;border:1px solid #c9d6df;background:#fff;border-radius:6px;cursor:pointer;font-weight:700}" +
    ".lv-words{background:#f3f7fa;border:1px dashed #287c8e;border-radius:8px;padding:10px 12px;margin:10px 0}" +
    ".lv-words dl{display:grid;grid-template-columns:max-content 1fr;gap:4px 12px;margin:6px 0 0}.lv-words dt{font-weight:700}.lv-words dd{margin:0}" +
    ".lv-cq{background:#f1ecff;border-left:5px solid #6d3df5;padding:10px 12px;margin:12px 0;border-radius:0 8px 8px 0}" +
    ".lv-cq label{margin-top:0}.lv-read{border:1px solid #c9d6df;background:#fff;border-radius:6px;padding:2px 8px;margin-left:6px;cursor:pointer;font-size:14px;vertical-align:middle}" +
    "@media print{.lv-bar,.lv-stem button,.lv-read{display:none}}";
  document.head.appendChild(css);

  /* ---- Challenge questions (always built so saved answers restore) ---- */
  (C.challenge || []).forEach(function (q) {
    var anchor = $(q.after); if (!anchor) return;
    var box = el("div", "lv-c lv-cq");
    var lab = el("label", null, "🚀 " + q.label); lab.setAttribute("for", q.id);
    var ta = el("textarea"); ta.id = q.id;
    box.appendChild(lab); box.appendChild(ta);
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
  });

  /* ---- Guided: sentence starters ---- */
  Object.keys(C.stems || {}).forEach(function (id) {
    var ta = $(id); if (!ta) return;
    var box = el("div", "lv-g lv-stem");
    box.appendChild(el("span", null, "Sentence starter: " + C.stems[id]));
    var b = el("button", null, "Use this starter"); b.type = "button";
    b.addEventListener("click", function () {
      if (!ta.value.trim()) { ta.value = C.stems[id]; ta.dispatchEvent(new Event("input", { bubbles: true })); }
      ta.focus();
    });
    box.appendChild(b);
    ta.parentNode.insertBefore(box, ta);
  });

  /* ---- Guided: word bank at the top of each lab section ---- */
  if (C.words && C.words.length) {
    document.querySelectorAll(".panel").forEach(function (p) {
      var box = el("details", "lv-g lv-words");
      var sum = el("summary", null, "📖 Word bank"); box.appendChild(sum);
      var dl = el("dl");
      C.words.forEach(function (w) { dl.appendChild(el("dt", null, w[0])); dl.appendChild(el("dd", null, w[1])); });
      box.appendChild(dl);
      var h = p.querySelector("h2"); p.insertBefore(box, h ? h.nextSibling : p.firstChild);
    });
  }

  /* ---- Guided: read-aloud buttons on every question (uses the device's built-in voice) ---- */
  if ("speechSynthesis" in window) {
    document.querySelectorAll(".panel label, .panel h2").forEach(function (lab) {
      if (lab.closest(".lv-bar") || lab.querySelector("input,select,textarea")) return;
      var b = el("button", "lv-g lv-read", "🔊"); b.type = "button";
      b.setAttribute("aria-label", "Read this aloud"); b.style.display = "";
      b.addEventListener("click", function (e) {
        e.preventDefault(); e.stopPropagation();
        var t = lab.textContent.replace("🔊", "").trim();
        if (lab.tagName === "H2") { // read the section directions too
          var n = lab.nextElementSibling;
          while (n && !/^(LABEL|H3|H2|TEXTAREA|CANVAS|TABLE)$/.test(n.tagName) && !n.querySelector("textarea,canvas,input")) {
            if (!n.classList.contains("lv-words")) t += ". " + n.textContent.trim();
            n = n.nextElementSibling;
          }
        }
        var stem = lab.nextElementSibling && lab.nextElementSibling.classList.contains("lv-stem") ? " " + lab.nextElementSibling.firstChild.textContent : "";
        speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t + stem); u.rate = 0.9; speechSynthesis.speak(u);
      });
      lab.appendChild(b);
    });
  }

  /* ---- Level picker ---- */
  var bar = el("div", "lv-bar"); bar.setAttribute("role", "radiogroup"); bar.setAttribute("aria-label", "Choose your level");
  bar.appendChild(el("strong", null, "My level:"));
  var opts = el("span", "lv-opts"); bar.appendChild(opts);
  var desc = el("span", "lv-desc");
  var buttons = LEVELS.map(function (L) {
    var b = el("button", null, L.icon + " " + L.label); b.type = "button"; b.setAttribute("role", "radio");
    b.addEventListener("click", function () { set(L.id, true); });
    opts.appendChild(b); return b;
  });
  bar.appendChild(desc);
  var host = document.querySelector(".tabs") || document.querySelector("main");
  host.parentNode.insertBefore(bar, host);

  var current = "standard";
  function set(id, persist) {
    if (!LEVELS.some(function (L) { return L.id === id; })) id = "standard";
    current = id;
    LEVELS.forEach(function (L, i) {
      buttons[i].setAttribute("aria-checked", L.id === id ? "true" : "false");
      document.body.classList.toggle("lv-" + L.id, L.id === id);
      if (L.id === id) desc.textContent = L.desc;
    });
    // read-aloud buttons are inline, not block
    document.querySelectorAll(".lv-read").forEach(function (b) { b.style.display = id === "guided" ? "inline-block" : "none"; });
    if (persist) { try { localStorage.setItem(KEY, id); } catch (e) {} }
  }
  var fromHash = (location.hash || "").replace("#", "");
  var saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
  set(LEVELS.some(function (L) { return L.id === fromHash; }) ? fromHash : (saved || "standard"), !!fromHash);

  window.USTLevel = {
    get: function () { return current; },
    label: function () { return LEVELS.filter(function (L) { return L.id === current; })[0].label; },
    challengeIds: function () { return (C.challenge || []).map(function (q) { return [q.id, q.label]; }); }
  };
})();
