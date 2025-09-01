(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver((s) => {
    for (const r of s)
      if (r.type === "childList")
        for (const a of r.addedNodes) a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
  }).observe(document, {
    childList: !0,
    subtree: !0
  });
  function o(s) {
    const r = {};
    return s.integrity && (r.integrity = s.integrity), s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? r.credentials = "include" : s.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const r = o(s);
    fetch(s.href, r);
  }
})();
const M = {
  primary: "#ffa000",
  error: "#ff3860",
  background: "#ffffff"
}, D = {
  // px
  half: 12,
  // px
  quarter: 8
  // px
}, ue = {
  radius: 6
}, H = {
  size: 14,
  // px
  family: "Helvetica, Arial, sans-serif"
};
function le(e, t) {
  const o = document.querySelector(".gofakeit-error-tooltip");
  o && o.remove();
  const n = document.createElement("div");
  n.className = "gofakeit-error-tooltip", n.style.cssText = `
    position: absolute;
    z-index: 10001;
    color: ${M.error};
    font-size: ${H.size}px;
    font-family: ${H.family};
    background-color: ${M.background};
    padding: ${D.quarter}px ${D.half}px;
    border-radius: ${ue.radius}px;
    border: 1px solid ${M.error};
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 300px;
    word-wrap: break-word;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
  `, n.textContent = t, document.body.appendChild(n);
  function s() {
    const u = e.getBoundingClientRect(), f = window.pageYOffset || document.documentElement.scrollTop, p = window.pageXOffset || document.documentElement.scrollLeft, h = u.left + p, E = u.top + f - n.offsetHeight - 8;
    n.style.left = `${h}px`, n.style.top = `${E}px`;
  }
  s();
  const r = () => s(), a = () => s();
  window.addEventListener("scroll", r, { passive: !0 }), window.addEventListener("resize", a, { passive: !0 });
  const c = document.querySelectorAll("*"), i = [];
  c.forEach((u) => {
    const f = window.getComputedStyle(u);
    if (f.overflow === "scroll" || f.overflowY === "scroll" || f.overflow === "auto" || f.overflowY === "auto") {
      const p = () => s();
      u.addEventListener("scroll", p, { passive: !0 }), i.push({ element: u, handler: p });
    }
  }), requestAnimationFrame(() => {
    n.style.opacity = "1", n.style.transform = "translateY(0)";
  }), setTimeout(() => {
    n.style.opacity = "0", n.style.transform = "translateY(-10px)", window.removeEventListener("scroll", r), window.removeEventListener("resize", a), i.forEach(({ element: u, handler: f }) => {
      u.removeEventListener("scroll", f);
    }), setTimeout(() => {
      n.parentElement && n.parentElement.removeChild(n);
    }, 300);
  }, 5e3);
}
const C = "https://api.gofakeit.com/funcs";
async function y(e) {
  const t = e.indexOf("?");
  if (t !== -1) {
    const o = e.substring(0, t), n = e.substring(t + 1), s = {}, r = new URLSearchParams(n);
    for (const [a, c] of r.entries()) {
      const i = parseFloat(c);
      s[a] = isNaN(i) ? c : i;
    }
    return O("POST", `${C}/${o}`, s);
  } else
    return O("GET", `${C}/${e}`);
}
async function fe(e) {
  if (e.length === 0)
    return {
      success: !1,
      error: "No functions provided"
    };
  const t = e.map((o, n) => {
    const { func: s, id: r } = o, a = s.indexOf("?");
    if (a !== -1) {
      const c = s.substring(0, a), i = s.substring(a + 1), u = {}, f = new URLSearchParams(i);
      for (const [p, h] of f.entries()) {
        const E = parseFloat(h);
        u[p] = isNaN(E) ? h : E;
      }
      return {
        id: r || `req_${n}`,
        func: c,
        params: u
      };
    } else
      return {
        id: r || `req_${n}`,
        func: s,
        params: o.params
      };
  });
  return de("POST", `${C}/multi`, t);
}
async function W(e) {
  return e.length === 0 ? {
    success: !1,
    error: "No search queries provided"
  } : pe("POST", `${C}/search`, e);
}
async function O(e, t, o) {
  try {
    const n = {
      method: e,
      headers: {
        "Content-Type": "application/json"
      }
    };
    e === "POST" && o && (n.body = JSON.stringify(o));
    const s = await fetch(t, n);
    return s.ok ? {
      success: !0,
      data: await s.text()
    } : {
      success: !1,
      error: `HTTP error! status: ${s.status}`,
      status: s.status
    };
  } catch (n) {
    return console.error(`[Gofakeit Autofill] Error in ${e} request to ${t}:`, n), {
      success: !1,
      error: n instanceof Error ? n.message : "Unknown error"
    };
  }
}
async function de(e, t, o) {
  try {
    const n = {
      method: e,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(o)
    }, s = await fetch(t, n);
    return s.ok ? {
      success: !0,
      data: await s.json()
    } : {
      success: !1,
      error: `HTTP error! status: ${s.status}`,
      status: s.status
    };
  } catch (n) {
    return console.error(`[Gofakeit Autofill] Error in ${e} request to ${t}:`, n), {
      success: !1,
      error: n instanceof Error ? n.message : "Unknown error"
    };
  }
}
async function pe(e, t, o) {
  try {
    const n = {
      method: e,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(o)
    }, s = await fetch(t, n);
    return s.ok ? {
      success: !0,
      data: await s.json()
    } : {
      success: !1,
      error: `HTTP error! status: ${s.status}`,
      status: s.status
    };
  } catch (n) {
    return console.error(`[Gofakeit Autofill] Error in ${e} request to ${t}:`, n), {
      success: !1,
      error: n instanceof Error ? n.message : "Unknown error"
    };
  }
}
function he(e, t) {
  const o = e.type.toLowerCase();
  return o === "date" ? t === "true" ? "generateDate" : t : o === "datetime-local" ? t === "true" ? "generateDateTime" : t : o === "time" ? t === "true" ? "generateTime" : t : o === "month" ? t === "true" ? "generateMonth" : t : o === "week" && t === "true" ? "generateWeek" : t;
}
function me(e, t) {
  e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
async function q() {
  const e = Math.floor(Math.random() * 24).toString().padStart(2, "0"), t = Math.floor(Math.random() * 60).toString().padStart(2, "0");
  return `${e}:${t}`;
}
async function N() {
  const e = Math.floor(Math.random() * 30) + 1990, t = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0");
  return `${e}-${t}`;
}
async function P() {
  const e = Math.floor(Math.random() * 30) + 1990, t = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0"), o = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, "0");
  return `${e}-${t}-${o}`;
}
async function R() {
  const e = Math.floor(Math.random() * 30) + 1990, t = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0"), o = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, "0"), n = Math.floor(Math.random() * 24).toString().padStart(2, "0"), s = Math.floor(Math.random() * 60).toString().padStart(2, "0");
  return `${e}-${t}-${o}T${n}:${s}`;
}
async function B() {
  const e = await y("year"), t = await y("number?min=1&max=53");
  if (!e.success || !t.success)
    throw new Error(`Failed to generate week: ${e.error || t.error}`);
  const o = t.data.padStart(2, "0");
  return `${e.data}-W${o}`;
}
function ge(e) {
  const t = new Date(e.getTime());
  t.setUTCHours(0, 0, 0, 0), t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const o = new Date(t.getUTCFullYear(), 0, 4);
  return Math.ceil(((t.getTime() - o.getTime()) / 864e5 - 3 + (o.getUTCDay() || 7)) / 7);
}
async function z(e, t, o) {
  const n = e.type.toLowerCase(), s = he(e, t);
  try {
    let r;
    if (o !== void 0)
      r = o;
    else if (s === "generateTime")
      r = await q();
    else if (s === "generateMonth")
      r = await N();
    else if (s === "generateWeek")
      r = await B();
    else if (s === "generateDate")
      r = await P();
    else if (s === "generateDateTime")
      r = await R();
    else {
      const a = await y(s);
      if (a.success)
        r = a.data;
      else {
        console.warn(`[Gofakeit Autofill] Error for ${n} input:`, a.error), a.status === 400 && k(e, `Failed to get random ${n}`);
        const c = x(n);
        if (c !== s)
          if (console.warn(`[Gofakeit Autofill] Falling back to default function: ${c}`), c === "generateWeek")
            r = await B();
          else if (c === "generateTime")
            r = await q();
          else if (c === "generateMonth")
            r = await N();
          else if (c === "generateDate")
            r = await P();
          else if (c === "generateDateTime")
            r = await R();
          else {
            const i = await y(c);
            if (i.success)
              r = i.data;
            else
              return { success: !1, usedFunc: s };
          }
        else
          return { success: !1, usedFunc: s };
      }
    }
    if (n === "date") {
      const a = r.match(/^(\d{4}-\d{2}-\d{2})/);
      if (a)
        r = a[1];
      else
        return console.warn("[Gofakeit Autofill] Could not parse date from response:", r), { success: !1, usedFunc: s };
    } else if (n === "datetime-local") {
      const a = r.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(:\d{2})?/);
      if (a)
        r = a[1];
      else
        return console.warn("[Gofakeit Autofill] Could not parse datetime from response:", r), { success: !1, usedFunc: s };
    } else if (n === "week" && s !== "generateWeek" && (s === "date" || s.startsWith("daterange"))) {
      const a = r.match(/^(\d{4}-\d{2}-\d{2})/);
      if (a) {
        const c = new Date(a[1]), i = c.getFullYear(), u = ge(c);
        r = `${i}-W${u.toString().padStart(2, "0")}`;
      } else
        return console.warn("[Gofakeit Autofill] Could not parse date for week from response:", r), { success: !1, usedFunc: s };
    }
    return me(e, r), { success: !0, usedFunc: s };
  } catch (r) {
    return console.warn(`[Gofakeit Autofill] Unexpected error handling ${n} input:`, r), { success: !1, usedFunc: s };
  }
}
function ye(e, t) {
  const o = e.type.toLowerCase();
  if (t === "true")
    switch (o) {
      case "email":
        return "email";
      case "tel":
        return "phone";
      case "password":
        return "password";
      case "search":
        return "word";
      case "url":
        return "url";
      case "color":
        return "hexcolor";
      default:
        return "word";
    }
  return t;
}
function L(e, t) {
  e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
async function we(e, t) {
  const o = ye(e, t), n = await y(o);
  if (!n.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${o}:`, n.error), n.status === 400 && k(e, "", o);
    const s = e.type.toLowerCase(), r = x(s);
    if (r !== o) {
      console.warn(`[Gofakeit Autofill] Falling back to default function: ${r}`);
      const a = await y(r);
      if (a.success)
        return L(e, a.data), { success: !0, usedFunc: r };
    }
    return { success: !1, usedFunc: o };
  }
  return L(e, n.data), { success: !0, usedFunc: o };
}
function Y(e) {
  return e === "true" ? "sentence" : e;
}
function F(e, t) {
  e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
async function be(e, t) {
  const o = Y(t), n = await y(o);
  if (!n.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${o}:`, n.error), n.status === 400 && k(e, "", o);
    const s = "sentence";
    if (s !== o) {
      console.warn(`[Gofakeit Autofill] Falling back to default function: ${s}`);
      const r = await y(s);
      if (r.success)
        return F(e, r.data), { success: !0, usedFunc: s };
    }
    return { success: !1, usedFunc: o };
  }
  return F(e, n.data), { success: !0, usedFunc: o };
}
async function K(e, t, o) {
  const n = Ee(e);
  if (n.length === 0)
    return console.warn("[Gofakeit Autofill] No checkbox group found for element:", e), { success: !1, usedFunc: "bool" };
  const s = t === "true" ? "bool" : t;
  if (o !== void 0)
    return n.forEach((a) => {
      a.checked = !1, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    }), (String(o).toLowerCase() === "true" || o === "1" || String(o).toLowerCase() === "yes") && n.length > 0 && (n[0].checked = !0, n[0].dispatchEvent(new Event("change", { bubbles: !0 }))), { success: !0, usedFunc: s };
  if (t === "true") {
    const r = Math.max(1, Math.ceil(n.length / 2));
    n.forEach((c) => {
      c.checked = !1, c.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    const a = /* @__PURE__ */ new Set();
    for (let c = 0; c < r; c++) {
      const i = await y("bool");
      if (i.success && (i.data.toLowerCase() === "true" || i.data.toLowerCase() === "1")) {
        const f = Array.from({ length: n.length }, (p, h) => h).filter((p) => !a.has(p));
        if (f.length > 0) {
          const p = f[Math.floor(Math.random() * f.length)];
          a.add(p), n[p].checked = !0, n[p].dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }
    }
  } else {
    const r = await y(s);
    if (!r.success)
      return console.warn(`[Gofakeit Autofill] Error for function ${s}:`, r.error), r.status === 400 && k(e, "", s), { success: !1, usedFunc: s };
    n.forEach((c) => {
      c.checked = !1, c.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    const a = r.data.split(",").map((c) => c.trim());
    n.forEach((c, i) => {
      const u = a.includes(c.value) || a.includes(i.toString());
      c.checked = u, c.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
  }
  return { success: !0, usedFunc: s };
}
async function j(e, t, o) {
  const n = Te(e), s = t === "true" ? "bool" : t;
  if (o !== void 0) {
    n.forEach((a) => {
      a.checked = !1, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    let r = n.find((a) => a.value === o);
    if (!r && !isNaN(Number(o))) {
      const a = parseInt(o);
      a >= 0 && a < n.length && (r = n[a]);
    }
    return r && (r.checked = !0, r.dispatchEvent(new Event("change", { bubbles: !0 }))), { success: !0, usedFunc: s, selectedElement: r };
  }
  if (t === "true") {
    n.forEach((a) => {
      a.checked = !1, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    const r = Math.floor(Math.random() * n.length);
    return n[r].checked = !0, n[r].dispatchEvent(new Event("change", { bubbles: !0 })), { success: !0, usedFunc: s, selectedElement: n[r] };
  } else {
    const r = await y(s);
    if (!r.success)
      return console.warn(`[Gofakeit Autofill] Error for function ${s}:`, r.error), r.status === 400 && k(e, "", s), { success: !1, usedFunc: s };
    n.forEach((i) => {
      i.checked = !1, i.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    const a = r.data.trim();
    let c = n.find((i) => i.value === a);
    if (!c && !isNaN(Number(a))) {
      const i = parseInt(a);
      i >= 0 && i < n.length && (c = n[i]);
    }
    if (c)
      return c.checked = !0, c.dispatchEvent(new Event("change", { bubbles: !0 })), { success: !0, usedFunc: s, selectedElement: c };
    {
      const i = Math.floor(Math.random() * n.length);
      return n[i].checked = !0, n[i].dispatchEvent(new Event("change", { bubbles: !0 })), { success: !0, usedFunc: s, selectedElement: n[i] };
    }
  }
}
function Ee(e) {
  if (e.type !== "checkbox") return [e];
  const t = e.name, o = e.closest("form, div, fieldset") || document;
  return t ? Array.from(o.querySelectorAll(`input[type="checkbox"][name="${t}"]`)) : Array.from(o.querySelectorAll('input[type="checkbox"]'));
}
function Te(e) {
  if (e.type !== "radio") return [e];
  const t = e.name;
  if (t)
    return Array.from(document.querySelectorAll(`input[type="radio"][name="${t}"]`));
  {
    const o = e.closest("form, div, fieldset") || document;
    return Array.from(o.querySelectorAll('input[type="radio"]'));
  }
}
async function Q(e, t, o) {
  const n = Array.from(e.options).map((r) => r.value).filter((r) => r !== "");
  if (n.length === 0)
    return console.warn("[Gofakeit Autofill] Select element has no valid options:", e), { success: !1, usedFunc: t };
  if (o !== void 0) {
    if (e.multiple)
      Array.from(e.options).forEach((a) => a.selected = !1), o.split(",").map((a) => a.trim()).filter((a) => a !== "").forEach((a) => {
        const c = e.options.namedItem(a) || Array.from(e.options).find((i) => i.value === a);
        c && (c.selected = !0);
      });
    else if (e.options.namedItem(o) || Array.from(e.options).find((a) => a.value === o))
      e.value = o;
    else {
      const a = n.filter((c) => c !== "");
      if (a.length > 0) {
        const c = a[Math.floor(Math.random() * a.length)];
        e.value = c;
      } else
        return { success: !1, usedFunc: t };
    }
    return e.dispatchEvent(new Event("change", { bubbles: !0 })), { success: !0, usedFunc: t === "true" ? "random" : t };
  }
  let s;
  if (t === "true") {
    const r = Math.floor(Math.random() * n.length);
    s = { success: !0, data: n[r] };
  } else
    s = await y(t);
  if (!s.success)
    return console.warn("[Gofakeit Autofill] Error for select:", s.error), s.status === 400 && k(e, "Failed to get selection"), { success: !1, usedFunc: t };
  if (e.multiple)
    if (Array.from(e.options).forEach((r) => r.selected = !1), t === "true") {
      const r = Math.min(Math.ceil(n.length / 2), n.length), a = [s.data], c = n.filter((i) => i !== s.data);
      for (let i = 1; i < r && c.length > 0; i++) {
        const u = Math.floor(Math.random() * c.length);
        a.push(c.splice(u, 1)[0]);
      }
      a.forEach((i) => {
        const u = e.options.namedItem(i) || Array.from(e.options).find((f) => f.value === i);
        u && (u.selected = !0);
      });
    } else
      s.data.split(",").map((a) => a.trim()).filter((a) => a !== "").forEach((a) => {
        const c = e.options.namedItem(a) || Array.from(e.options).find((i) => i.value === a);
        c && (c.selected = !0);
      });
  else
    e.value = s.data;
  return e.dispatchEvent(new Event("change", { bubbles: !0 })), { success: !0, usedFunc: t === "true" ? "random" : t };
}
function ke(e) {
  return e === "true" ? "number" : e;
}
function J(e, t) {
  e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
async function ve(e, t) {
  const o = ke(t), n = await y(o);
  return n.success ? (J(e, n.data), { success: !0, usedFunc: o }) : (console.warn(`[Gofakeit Autofill] Error for function ${o}:`, n.error), n.status === 400 && k(e, "", o), { success: !1, usedFunc: o });
}
function X(e) {
  const t = parseFloat(e.min) || 0, o = parseFloat(e.max) || 100;
  return `number?min=${t}&max=${o}`;
}
function Z(e, t) {
  const o = parseFloat(t);
  if (!isNaN(o)) {
    const n = parseFloat(e.min) || 0, s = parseFloat(e.max) || 100, r = Math.max(n, Math.min(s, o));
    e.value = r.toString(), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
}
async function xe(e) {
  const t = X(e), o = await y(t);
  return o.success ? (Z(e, o.data), { success: !0, usedFunc: t }) : (console.warn("[Gofakeit Autofill] Error for range input:", o.error), o.status === 400 && k(e, "Failed to get random number for range"), { success: !1, usedFunc: t });
}
async function A(e, t) {
  const n = { ...{ smart: !0 }, ...t };
  if (!e)
    return Me(n);
  if (e instanceof HTMLElement && $(e))
    return _(e, n);
  if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) {
    const s = await I(e, n);
    return s || T("Failed to autofill the specified element", "error"), s;
  }
  if (e instanceof HTMLElement) {
    const s = $e(e);
    if (s)
      return _(s, n);
  }
  return !1;
}
async function Me(e) {
  const t = ee(), o = e.smart ?? !0, s = (o ? t : t.filter((a) => a.hasAttribute("data-gofakeit"))).filter((a) => !te(a));
  if (s.length === 0) {
    T(o ? "No form fields found to autofill" : "No data-gofakeit fields exist. Turn on Smart mode to fill all form fields.", "info");
    return;
  }
  console.log(`[Gofakeit] Found ${s.length} elements to generate data for`), T(`Starting data generation for ${s.length} fields...`, "info");
  const r = await oe(s, e);
  se(r.success, r.failed, "Autofill");
}
async function _(e, t) {
  const o = ee(e), n = t.smart ?? !0, r = (n ? o : o.filter((c) => c.hasAttribute("data-gofakeit"))).filter((c) => !te(c));
  if (r.length === 0) {
    T(n ? "No form fields found in this container" : "No data-gofakeit fields exist in this section. Turn on Smart mode to fill all form fields.", "info");
    return;
  }
  console.log(`[Gofakeit] Found ${r.length} elements to generate data for in container`), T(`Starting data generation for ${r.length} fields...`, "info");
  const a = await oe(r, t);
  se(a.success, a.failed, "Container autofill");
}
async function I(e, t) {
  const o = e.getAttribute("data-gofakeit");
  if (typeof o == "string" && o.trim().toLowerCase() === "false")
    return !1;
  const n = t.smart ?? !0;
  if (!o && !n)
    return !1;
  try {
    if (e instanceof HTMLSelectElement) {
      const s = o && o !== "true" ? o : "true", { success: r, usedFunc: a } = await Q(e, s);
      return r && m(e, a, t), r;
    }
    if (e instanceof HTMLTextAreaElement) {
      const s = o && o !== "true" ? o : "sentence", { success: r, usedFunc: a } = await be(e, s);
      return r && m(e, a, t), r;
    }
    if (e instanceof HTMLInputElement) {
      const s = e.type.toLowerCase();
      if (s === "checkbox") {
        const i = o && o !== "true" ? o : "true", { success: u, usedFunc: f } = await K(e, i);
        return u && m(e, f, t), u;
      }
      if (s === "radio") {
        const i = o && o !== "true" ? o : "true", { success: u, usedFunc: f, selectedElement: p } = await j(e, i);
        return u && m(p || e, f, t), u;
      }
      if (s === "range") {
        const { success: i, usedFunc: u } = await xe(e);
        return i && m(e, u, t), i;
      }
      const r = o && o !== "true" ? o : await ae(e);
      if (s === "number") {
        const { success: i, usedFunc: u } = await ve(e, r);
        return i && m(e, u, t), i;
      }
      if (s === "date" || s === "time" || s === "datetime-local" || s === "month" || s === "week") {
        const { success: i, usedFunc: u } = await z(e, r);
        return i && m(e, u, t), i;
      }
      const { success: a, usedFunc: c } = await we(e, r);
      return a && m(e, c, t), a;
    }
    return console.warn("[Gofakeit] Unsupported element type:", e), !1;
  } catch (s) {
    return console.error("[Gofakeit] Unexpected error generating data for element:", e, s), !1;
  }
}
function ee(e) {
  const t = "input, textarea, select", o = e ? e.querySelectorAll(t) : document.querySelectorAll(t), n = [];
  return o.forEach((s) => {
    if (s instanceof HTMLInputElement) {
      if (s.type === "hidden" || s.disabled || s.readOnly) return;
      n.push(s);
    } else if (s instanceof HTMLTextAreaElement) {
      if (s.disabled || s.readOnly) return;
      n.push(s);
    } else if (s instanceof HTMLSelectElement) {
      if (s.disabled) return;
      n.push(s);
    }
  }), n;
}
function te(e) {
  const t = e.getAttribute && e.getAttribute("data-gofakeit");
  return typeof t == "string" && t.trim().toLowerCase() === "false";
}
function Ae(e) {
  const t = [], o = /* @__PURE__ */ new Set();
  for (const n of e) {
    if (n instanceof HTMLInputElement) {
      const s = n.type.toLowerCase();
      if (s === "checkbox" || s === "radio") {
        const r = n.name;
        if (r && o.has(r))
          continue;
        r && o.add(r);
      }
    }
    t.push(n);
  }
  return t;
}
async function oe(e, t) {
  let o = 0, n = 0;
  const s = Ae(e), r = [], a = [];
  for (const l of s)
    if (l instanceof HTMLInputElement) {
      const d = l.type.toLowerCase();
      ne(d) ? r.push(l) : a.push(l);
    } else
      a.push(l);
  let c = /* @__PURE__ */ new Map();
  if (r.length > 0)
    try {
      c = await Ie(r);
    } catch (l) {
      console.warn("[Gofakeit Autofill] Search API failed, falling back to individual function detection:", l);
      for (const d of r) {
        const w = await U(d, t);
        w && c.set(d, w);
      }
    }
  const i = [], u = [];
  r.forEach((l) => {
    const d = c.get(l);
    d && u.push({ element: l, func: d });
  });
  for (const l of a)
    try {
      const d = await U(l, t);
      if (d) {
        if (l instanceof HTMLInputElement) {
          const w = l.type.toLowerCase();
          if (["checkbox", "radio", "range", "file", "button", "submit", "reset", "image", "color", "date", "time", "datetime-local", "month", "week"].includes(w)) {
            i.push(l);
            continue;
          }
        }
        u.push({ element: l, func: d });
      }
    } catch (d) {
      n++, console.warn("[Gofakeit Autofill] Failed to get function for element:", l, d);
    }
  if (globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : t.staggered ?? !0)
    for (let l = 0; l < i.length; l++) {
      const d = i[l], w = t.staggerDelay ?? 50;
      l > 0 && await new Promise((b) => setTimeout(b, w));
      try {
        await I(d, t) ? o++ : n++;
      } catch (b) {
        n++, console.warn("[Gofakeit Autofill] Failed to process excluded element:", d, b);
      }
    }
  else {
    const l = i.map(async (w) => {
      try {
        return await I(w, t);
      } catch (b) {
        return console.warn("[Gofakeit Autofill] Failed to process excluded element:", w, b), !1;
      }
    });
    (await Promise.all(l)).forEach((w) => {
      w ? o++ : n++;
    });
  }
  if (u.length === 0)
    return { success: o, failed: n };
  const h = u.map((l, d) => ({
    id: `req_${d}`,
    func: l.func
  })), E = await fe(h);
  if (!E.success || !E.data)
    return console.error("[Gofakeit Autofill] Batch API call failed:", E.error), { success: o, failed: n + u.length };
  for (let l = 0; l < u.length; l++) {
    const { element: d, func: w } = u[l], b = E.data[l], ce = globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : t.staggered ?? !0, ie = t.staggerDelay ?? 50;
    if (ce && l > 0 && await new Promise((S) => setTimeout(S, ie)), b && b.value !== null && !b.error)
      try {
        await Se(d, w, b.value, t) ? (o++, setTimeout(() => {
          d instanceof HTMLInputElement || d instanceof HTMLTextAreaElement ? d.value === "" && console.warn("[Gofakeit Autofill] Value was cleared for element:", d) : d instanceof HTMLSelectElement && d.value === "" && console.warn("[Gofakeit Autofill] Value was cleared for select:", d);
        }, 1e3)) : n++;
      } catch (S) {
        n++, console.warn("[Gofakeit Autofill] Failed to apply value to element:", d, S);
      }
    else
      n++, console.warn("[Gofakeit Autofill] API error for element:", d, b?.error);
  }
  return { success: o, failed: n };
}
async function U(e, t) {
  const o = e.getAttribute("data-gofakeit");
  if (typeof o == "string" && o.trim().toLowerCase() === "false")
    return null;
  const n = t.smart ?? !0;
  if (!o && !n)
    return null;
  try {
    if (e instanceof HTMLSelectElement)
      return o && o !== "true" ? o : "word";
    if (e instanceof HTMLTextAreaElement)
      return Y(o || "true");
    if (e instanceof HTMLInputElement) {
      const s = e.type.toLowerCase();
      return s === "checkbox" ? o && o !== "true" ? o : "bool" : s === "radio" ? o && o !== "true" ? o : "true" : s === "range" ? X(e) : await ae(e);
    }
    return console.warn("[Gofakeit] Unsupported element type for batching:", e), null;
  } catch (s) {
    return console.error("[Gofakeit] Unexpected error getting function for element:", e, s), null;
  }
}
function m(e, t, o) {
  const s = globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : o?.staggered ?? !0, r = o?.staggerDelay ?? 50;
  setTimeout(() => {
    Le(e, t);
  }, s ? r : 0);
}
async function Se(e, t, o, n) {
  try {
    if (e instanceof HTMLSelectElement) {
      const { success: s, usedFunc: r } = await Q(e, t, o);
      return s && m(e, r, n), s;
    }
    if (e instanceof HTMLTextAreaElement)
      return F(e, o), m(e, t, n), !0;
    if (e instanceof HTMLInputElement) {
      const s = e.type.toLowerCase();
      if (s === "checkbox") {
        const { success: r, usedFunc: a } = await K(e, t, o);
        return r && m(e, a, n), r;
      }
      if (s === "radio") {
        const { success: r, usedFunc: a } = await j(e, t, o);
        return r && m(e, a, n), r;
      }
      if (s === "number")
        return J(e, o), m(e, t, n), !0;
      if (s === "range")
        return Z(e, o), m(e, t, n), !0;
      if (s === "date" || s === "time" || s === "datetime-local" || s === "month" || s === "week") {
        const { success: r, usedFunc: a } = await z(e, t, o);
        return r && m(e, a, n), r;
      }
      return L(e, o), m(e, t, n), !0;
    }
    return console.warn("[Gofakeit] Unsupported element type:", e), !1;
  } catch (s) {
    return console.error("[Gofakeit] Unexpected error generating data for element:", e, s), !1;
  }
}
function se(e, t, o) {
  e > 0 && (console.log(`[Gofakeit] ${o} completed successfully for ${e} fields`), T(`Successfully generated data for ${e} fields!`, "success")), t > 0 && (console.error(`[Gofakeit] ${o} failed for ${t} fields`), T(`Failed to generate data for ${t} fields.`, "error")), e === 0 && t === 0 && (console.log(`[Gofakeit] ${o} - no fields were processed`), T("No fields were processed.", "info"));
}
function k(e, t, o) {
  e instanceof HTMLElement && (e.style.border = `2px solid ${M.error}`, setTimeout(() => {
    e.style.border = "";
  }, 5e3));
  const n = o ? `Invalid function: ${o}` : t;
  le(e, n);
}
function $(e) {
  return e.querySelectorAll("input[data-gofakeit], textarea[data-gofakeit], select[data-gofakeit]").length > 0;
}
const v = /* @__PURE__ */ new Map();
function Ce(e) {
  if (e instanceof HTMLInputElement && e.type === "radio" && e.name)
    document.querySelectorAll(`input[type="radio"][name="${e.name}"]`).forEach((o) => {
      const n = v.get(o);
      n && (clearTimeout(n.timeout), n.cleanup(), v.delete(o));
    });
  else {
    const t = v.get(e);
    t && (clearTimeout(t.timeout), t.cleanup(), v.delete(e));
  }
}
function Le(e, t) {
  if (!(e instanceof HTMLElement)) return;
  Ce(e);
  const o = document.createElement("div");
  o.textContent = t, o.style.position = "fixed", o.style.background = M.primary, o.style.color = "#000", o.style.fontFamily = "Arial, sans-serif", o.style.fontSize = "11px", o.style.padding = "3px 8px", o.style.borderRadius = "6px", o.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)", o.style.zIndex = "2147483647", o.style.opacity = "0", o.style.transform = "translateY(-6px)", o.style.transition = "opacity 200ms ease, transform 200ms ease", o.style.pointerEvents = "none";
  const n = () => {
    const f = e.getBoundingClientRect(), p = window.innerHeight || document.documentElement.clientHeight, h = window.innerWidth || document.documentElement.clientWidth;
    if (f.bottom <= 0 || f.top >= p || f.right <= 0 || f.left >= h) {
      o.style.display = "none";
      return;
    }
    o.style.display === "none" && (o.style.display = "block");
    const l = f.top - 8, d = f.left;
    o.style.top = `${l}px`, o.style.left = `${d}px`;
  };
  document.body.appendChild(o), n(), requestAnimationFrame(() => {
    o.style.opacity = "1", o.style.transform = "translateY(-12px)";
  });
  const s = () => n(), r = () => n();
  window.addEventListener("scroll", s, !0), window.addEventListener("resize", r, !0);
  let a = null;
  if (typeof ResizeObserver < "u") {
    a = new ResizeObserver(() => n());
    try {
      a.observe(e);
    } catch {
    }
  }
  const c = () => {
    if (window.removeEventListener("scroll", s, !0), window.removeEventListener("resize", r, !0), a) {
      try {
        a.disconnect();
      } catch {
      }
      a = null;
    }
    o.parentNode && o.parentNode.removeChild(o), v.delete(e);
  }, u = setTimeout(() => {
    o.style.opacity = "0", o.style.transform = "translateY(-6px)", setTimeout(c, 220);
  }, 6e3);
  v.set(e, { badge: o, timeout: u, cleanup: c });
}
function Fe(e) {
  const t = [], o = e.id, n = e.getAttribute("aria-labelledby");
  if (n && n.split(/\s+/).forEach((a) => {
    const c = document.getElementById(a);
    c && c.textContent && t.push(c.textContent);
  }), o)
    try {
      const a = document.querySelector('label[for="' + o.replace(/"/g, '\\"') + '"]');
      a && a.textContent && t.push(a.textContent);
    } catch {
    }
  const s = e.closest("label");
  s && s.textContent && t.push(s.textContent);
  const r = e.previousElementSibling;
  return r && r.tagName === "LABEL" && r.textContent && t.push(r.textContent), t.join(" ").toLowerCase();
}
function ne(e) {
  return !["checkbox", "radio", "select", "range", "file", "button", "submit", "reset", "image", "color", "week", "date", "time", "datetime-local", "month"].includes(e);
}
function x(e) {
  switch (e) {
    case "checkbox":
    case "radio":
    case "select":
      return "true";
    case "range":
      return "number?min=0&max=100";
    case "file":
      return "word";
    case "button":
    case "submit":
    case "reset":
    case "image":
      return "word";
    case "color":
      return "hexcolor";
    case "week":
      return "generateWeek";
    case "date":
      return "generateDate";
    case "time":
      return "generateTime";
    case "datetime-local":
      return "generateDateTime";
    case "month":
      return "generateMonth";
    default:
      return "word";
  }
}
function V(e) {
  switch (e) {
    case "email":
      return "email";
    case "tel":
      return "phone";
    case "number":
      return "number";
    case "date":
      return "date";
    case "time":
      return "time";
    case "datetime-local":
      return "datetime";
    case "month":
      return "month";
    case "week":
      return "week";
    case "url":
      return "url";
    case "password":
      return "password";
    case "search":
      return "word";
    case "color":
      return "color";
    case "text":
    default:
      return "word";
  }
}
function re(e) {
  const t = e.type.toLowerCase(), o = (e.name || "").toLowerCase(), n = (e.id || "").toLowerCase(), s = (e.placeholder || "").toLowerCase(), r = (e.autocomplete || "").toLowerCase(), a = (e.getAttribute("aria-label") || "").toLowerCase(), c = Fe(e);
  return [
    t,
    o,
    n,
    s,
    r,
    a,
    c
  ].filter((f) => f && f.trim()).join(" ").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim() || "text input";
}
async function ae(e) {
  const t = e.type.toLowerCase();
  if (!ne(t))
    return x(t);
  const o = re(e);
  try {
    const n = {
      id: e.id || e.name || `input_${Date.now()}`,
      query: o
    }, s = await W([n]);
    if (s.success && s.data && s.data.length > 0) {
      const r = s.data[0];
      if (r.results && r.results.length > 0)
        return r.results[0].name;
    }
  } catch (n) {
    console.warn("[Gofakeit] Function search failed, falling back to default function:", n);
  }
  return x(t);
}
async function Ie(e) {
  const t = /* @__PURE__ */ new Map();
  if (e.length === 0)
    return t;
  try {
    const o = e.map((s, r) => {
      const a = re(s);
      return {
        id: s.id || s.name || `input_${r}`,
        query: a
      };
    }), n = await W(o);
    if (n.success && n.data)
      for (let s = 0; s < n.data.length; s++) {
        const r = n.data[s], a = e[s], c = a.type.toLowerCase();
        if (r.results && r.results.length > 0) {
          const i = r.results[0];
          i.score >= 100 ? t.set(a, i.name) : t.set(a, V(c));
        } else
          t.set(a, V(c));
      }
    else
      for (const s of e)
        t.set(s, x(s.type.toLowerCase()));
  } catch (o) {
    console.warn("[Gofakeit] Multi-function search failed, falling back to default functions:", o);
    for (const n of e)
      t.set(n, x(n.type.toLowerCase()));
  }
  return t;
}
function $e(e) {
  if ($(e))
    return e;
  let t = e.parentElement;
  for (; t; ) {
    if ($(t))
      return t;
    t = t.parentElement;
  }
  return null;
}
function T(e, t = "info") {
  console.log(`[Gofakeit ${t.toUpperCase()}] ${e}`);
}
window.autofill = async (e) => {
  try {
    const t = G();
    if (e)
      if (typeof e == "string") {
        const o = document.getElementById(e);
        if (!o) {
          g("❌ Element not found: " + e, "error");
          return;
        }
        o.scrollIntoView({ behavior: "smooth", block: "start" }), setTimeout(async () => {
          await A(o, t), g(
            `✅ ${e} section filled successfully!`,
            "success"
          );
        }, 500);
      } else
        await A(e, t), g("✅ Element filled successfully!", "success");
    else
      await A(void 0, t), g("✅ All fields filled successfully!", "success");
  } catch (t) {
    g("❌ Error filling fields: " + t.message, "error");
  }
};
window.autofillCategory = async () => {
  const e = document.getElementById("categorySelector"), t = e.value;
  if (!t) {
    g("❌ Please select a category first!", "error");
    return;
  }
  try {
    const n = {
      "person-category": {
        section: "categories"
      },
      "address-category": {
        section: "categories"
      },
      "company-category": {
        section: "categories"
      },
      "payment-category": {
        section: "categories"
      },
      "internet-category": {
        section: "categories"
      },
      "time-category": {
        section: "categories"
      },
      "language-category": {
        section: "categories"
      },
      "word-category": {
        section: "categories"
      },
      "color-category": {
        section: "categories"
      },
      "animal-category": {
        section: "categories"
      },
      "food-category": {
        section: "categories"
      },
      "car-category": {
        section: "categories"
      },
      "game-category": {
        section: "categories"
      },
      "misc-category": {
        section: "categories"
      }
    }[t];
    if (!n) {
      g("❌ Invalid category selected!", "error");
      return;
    }
    const r = {
      "person-category": "👤 Person Category",
      "address-category": "🏠 Address Category",
      "company-category": "🏢 Company Category",
      "payment-category": "💳 Payment Category",
      "internet-category": "🌐 Internet Category",
      "time-category": "⏰ Time Category",
      "language-category": "🗣️ Language Category",
      "word-category": "📝 Word Category",
      "color-category": "🎨 Color Category",
      "animal-category": "🐾 Animal Category",
      "food-category": "🍕 Food Category",
      "car-category": "🚗 Car Category",
      "game-category": "🎮 Game Category",
      "misc-category": "🎲 Misc Category"
    }[t];
    let a = null;
    if (r) {
      const c = document.querySelectorAll("h4");
      for (const i of c)
        if (i.textContent?.includes(r)) {
          a = i;
          break;
        }
    }
    if (a)
      a.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    else {
      const c = document.getElementById(n.section);
      c && c.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(async () => {
      const c = document.getElementById(t);
      if (!c) {
        g("❌ Category container not found!", "error");
        return;
      }
      try {
        const i = G();
        await A(c, i);
        let u = 0;
        c.querySelectorAll(
          "input, textarea, select"
        ).forEach((h) => {
          h instanceof HTMLInputElement ? h.type === "checkbox" || h.type === "radio" ? h.checked && u++ : h.value && u++ : (h instanceof HTMLTextAreaElement || h instanceof HTMLSelectElement) && h.value && u++;
        });
        const p = e.options[e.selectedIndex].text;
        g(
          `✅ ${p} filled successfully! (${u} fields)`,
          "success"
        );
      } catch (i) {
        console.warn("Failed to fill category:", i), g(
          "❌ Error filling category: " + i.message,
          "error"
        );
      }
    }, 500);
  } catch (o) {
    g("❌ Error filling category: " + o.message, "error");
  }
};
function G() {
  const e = document.getElementById("smartMode").checked, t = document.getElementById("staggeredMode").checked, o = parseInt(
    document.getElementById("staggerDelay").value
  );
  return {
    smart: e,
    staggered: t,
    staggerDelay: o
  };
}
window.autofillWithCurrentSettings = async () => {
  try {
    const e = G();
    await A(void 0, e);
    const t = e.smart ? "Smart Mode" : "Manual Mode", o = e.staggered ? ` (${e.staggerDelay}ms delay)` : " (no stagger)";
    g(
      `✅ All fields filled with ${t}${o}!`,
      "success"
    );
  } catch (e) {
    g("❌ Error filling fields: " + e.message, "error");
  }
};
document.addEventListener("DOMContentLoaded", function() {
  const e = document.getElementById("staggerDelay"), t = document.getElementById("staggerDelayValue"), o = document.getElementById("themeToggle"), n = o.querySelector(".theme-icon");
  if (e && t && e.addEventListener("input", function() {
    t.textContent = this.value;
  }), o) {
    const s = localStorage.getItem("theme"), r = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    s === "dark" || s === null && r ? (document.documentElement.setAttribute("data-theme", "dark"), n.textContent = "☀️") : n.textContent = "🌙", o.addEventListener("click", function() {
      document.documentElement.hasAttribute("data-theme") ? (document.documentElement.removeAttribute("data-theme"), localStorage.setItem("theme", "light"), n.textContent = "🌙") : (document.documentElement.setAttribute("data-theme", "dark"), localStorage.setItem("theme", "dark"), n.textContent = "☀️");
    }), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(c) {
      localStorage.getItem("theme") === null && (c.matches ? (document.documentElement.setAttribute("data-theme", "dark"), n.textContent = "☀️") : (document.documentElement.removeAttribute("data-theme"), n.textContent = "🌙"));
    });
  }
});
window.clearAll = () => {
  document.querySelectorAll("input, textarea, select").forEach((t) => {
    t.type === "checkbox" || t.type === "radio" ? t.checked = !1 : t.value = "";
  }), g("🧹 All fields cleared!", "success");
};
function g(e, t) {
  const o = document.getElementById("status");
  o.textContent = e, o.className = `status ${t} show`, setTimeout(() => {
    o.classList.remove("show");
  }, 3e3);
}
console.log("🎯 Gofakeit Autofill Comprehensive Testing loaded!");
console.log(
  "This page tests the search API with various input contexts and categories."
);
console.log(
  "Check the browser network tab to see search API calls in action!"
);
//# sourceMappingURL=index.js.map
