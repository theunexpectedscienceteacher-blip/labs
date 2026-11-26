/* The Unexpected Science Teacher - shared tools added to every lab.
   Adds a small footer with a link back to the Lab Library, the privacy page,
   and a "clear my work" button for shared Chromebooks.
   This script never sends data anywhere. */
(function () {
  "use strict";
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text) n.textContent = text;
    return n;
  }
  function build() {
    var bar = el("div", { "class": "ust-labbar", role: "contentinfo" });
    var style = el("style");
    style.textContent =
      ".ust-labbar{max-width:1180px;margin:24px auto 0;padding:14px 16px 28px;display:flex;flex-wrap:wrap;gap:10px 18px;" +
      "align-items:center;justify-content:space-between;font:14px/1.4 Arial,Helvetica,sans-serif;color:#516273;border-top:1px solid #c9d6df}" +
      ".ust-labbar a{color:#153047;font-weight:700}" +
      ".ust-labbar button{border:1px solid #c84a3a;background:#fff;color:#c84a3a;border-radius:8px;padding:8px 12px;font-weight:700;cursor:pointer;font-size:14px}" +
      ".ust-labbar button.armed{background:#c84a3a;color:#fff}" +
      "@media print{.ust-labbar{display:none}}";
    document.head.appendChild(style);

    var left = el("div");
    left.appendChild(el("a", { href: "../" }, "← Lab Library"));
    left.appendChild(document.createTextNode("  ·  "));
    left.appendChild(el("a", { href: "../privacy/" }, "Privacy"));
    left.appendChild(document.createTextNode("  ·  © The Unexpected Science Teacher"));

    var right = el("div");
    var msg = el("span", { "aria-live": "polite" }, "Finished on a shared Chromebook? ");
    var btn = el("button", { type: "button" }, "Clear my work from this device");
    var armed = false, timer = null;
    btn.addEventListener("click", function () {
      if (!armed) {
        armed = true; btn.classList.add("armed");
        btn.textContent = "Click again to erase all saved lab work";
        timer = setTimeout(function () { armed = false; btn.classList.remove("armed"); btn.textContent = "Clear my work from this device"; }, 4000);
        return;
      }
      clearTimeout(timer);
      try { localStorage.clear(); sessionStorage.clear(); } catch (e) {}
      msg.textContent = "Your work was cleared. ";
      setTimeout(function () { location.reload(); }, 800);
    });
    right.appendChild(msg); right.appendChild(btn);
    bar.appendChild(left); bar.appendChild(right);
    document.body.appendChild(bar);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
