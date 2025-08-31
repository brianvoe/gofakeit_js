(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
    for (const n of s)
      if (n.type === "childList")
        for (const a of n.addedNodes) a.tagName === "LINK" && a.rel === "modulepreload" && r(a);
  }).observe(document, {
    childList: !0,
    subtree: !0
  });
  function o(s) {
    const n = {};
    return s.integrity && (n.integrity = s.integrity), s.referrerPolicy && (n.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? n.credentials = "include" : s.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
  }
  function r(s) {
    if (s.ep) return;
    s.ep = !0;
    const n = o(s);
    fetch(s.href, n);
  }
})();
const x = {
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
  const r = document.createElement("div");
  r.className = "gofakeit-error-tooltip", r.style.cssText = `
    position: absolute;
    z-index: 10001;
    color: ${x.error};
    font-size: ${H.size}px;
    font-family: ${H.family};
    background-color: ${x.background};
    padding: ${D.quarter}px ${D.half}px;
    border-radius: ${ue.radius}px;
    border: 1px solid ${x.error};
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 300px;
    word-wrap: break-word;
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
  `, r.textContent = t, document.body.appendChild(r);
  function s() {
    const u = e.getBoundingClientRect(), f = window.pageYOffset || document.documentElement.scrollTop, p = window.pageXOffset || document.documentElement.scrollLeft, h = u.left + p, E = u.top + f - r.offsetHeight - 8;
    r.style.left = `${h}px`, r.style.top = `${E}px`;
  }
  s();
  const n = () => s(), a = () => s();
  window.addEventListener("scroll", n, { passive: !0 }), window.addEventListener("resize", a, { passive: !0 });
  const c = document.querySelectorAll("*"), i = [];
  c.forEach((u) => {
    const f = window.getComputedStyle(u);
    if (f.overflow === "scroll" || f.overflowY === "scroll" || f.overflow === "auto" || f.overflowY === "auto") {
      const p = () => s();
      u.addEventListener("scroll", p, { passive: !0 }), i.push({ element: u, handler: p });
    }
  }), requestAnimationFrame(() => {
    r.style.opacity = "1", r.style.transform = "translateY(0)";
  }), setTimeout(() => {
    r.style.opacity = "0", r.style.transform = "translateY(-10px)", window.removeEventListener("scroll", n), window.removeEventListener("resize", a), i.forEach(({ element: u, handler: f }) => {
      u.removeEventListener("scroll", f);
    }), setTimeout(() => {
      r.parentElement && r.parentElement.removeChild(r);
    }, 300);
  }, 5e3);
}
const C = "https://api.gofakeit.com/funcs";
async function y(e) {
  const t = e.indexOf("?");
  if (t !== -1) {
    const o = e.substring(0, t), r = e.substring(t + 1), s = {}, n = new URLSearchParams(r);
    for (const [a, c] of n.entries()) {
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
  const t = e.map((o, r) => {
    const { func: s, id: n } = o, a = s.indexOf("?");
    if (a !== -1) {
      const c = s.substring(0, a), i = s.substring(a + 1), u = {}, f = new URLSearchParams(i);
      for (const [p, h] of f.entries()) {
        const E = parseFloat(h);
        u[p] = isNaN(E) ? h : E;
      }
      return {
        id: n || `req_${r}`,
        func: c,
        params: u
      };
    } else
      return {
        id: n || `req_${r}`,
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
    const r = {
      method: e,
      headers: {
        "Content-Type": "application/json"
      }
    };
    e === "POST" && o && (r.body = JSON.stringify(o));
    const s = await fetch(t, r);
    return s.ok ? {
      success: !0,
      data: await s.text()
    } : {
      success: !1,
      error: `HTTP error! status: ${s.status}`,
      status: s.status
    };
  } catch (r) {
    return console.error(`[Gofakeit Autofill] Error in ${e} request to ${t}:`, r), {
      success: !1,
      error: r instanceof Error ? r.message : "Unknown error"
    };
  }
}
async function de(e, t, o) {
  try {
    const r = {
      method: e,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(o)
    }, s = await fetch(t, r);
    return s.ok ? {
      success: !0,
      data: await s.json()
    } : {
      success: !1,
      error: `HTTP error! status: ${s.status}`,
      status: s.status
    };
  } catch (r) {
    return console.error(`[Gofakeit Autofill] Error in ${e} request to ${t}:`, r), {
      success: !1,
      error: r instanceof Error ? r.message : "Unknown error"
    };
  }
}
async function pe(e, t, o) {
  try {
    const r = {
      method: e,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(o)
    }, s = await fetch(t, r);
    return s.ok ? {
      success: !0,
      data: await s.json()
    } : {
      success: !1,
      error: `HTTP error! status: ${s.status}`,
      status: s.status
    };
  } catch (r) {
    return console.error(`[Gofakeit Autofill] Error in ${e} request to ${t}:`, r), {
      success: !1,
      error: r instanceof Error ? r.message : "Unknown error"
    };
  }
}
function he(e, t) {
  const o = e.type.toLowerCase();
  return o === "date" ? t === "true" ? "generateDate" : t : o === "datetime-local" ? t === "true" ? "generateDateTime" : t : o === "time" ? t === "true" ? "generateTime" : t : o === "month" ? t === "true" ? "generateMonth" : t : o === "week" && t === "true" ? "generateWeek" : t;
}
function ge(e, t) {
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
  const e = Math.floor(Math.random() * 30) + 1990, t = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0"), o = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, "0"), r = Math.floor(Math.random() * 24).toString().padStart(2, "0"), s = Math.floor(Math.random() * 60).toString().padStart(2, "0");
  return `${e}-${t}-${o}T${r}:${s}`;
}
async function B() {
  const e = await y("year"), t = await y("number?min=1&max=53");
  if (!e.success || !t.success)
    throw new Error(`Failed to generate week: ${e.error || t.error}`);
  const o = t.data.padStart(2, "0");
  return `${e.data}-W${o}`;
}
function me(e) {
  const t = new Date(e.getTime());
  t.setUTCHours(0, 0, 0, 0), t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const o = new Date(t.getUTCFullYear(), 0, 4);
  return Math.ceil(((t.getTime() - o.getTime()) / 864e5 - 3 + (o.getUTCDay() || 7)) / 7);
}
async function z(e, t, o) {
  const r = e.type.toLowerCase(), s = he(e, t);
  try {
    let n;
    if (o !== void 0)
      n = o;
    else if (s === "generateTime")
      n = await q();
    else if (s === "generateMonth")
      n = await N();
    else if (s === "generateWeek")
      n = await B();
    else if (s === "generateDate")
      n = await P();
    else if (s === "generateDateTime")
      n = await R();
    else {
      const a = await y(s);
      if (a.success)
        n = a.data;
      else {
        console.warn(`[Gofakeit Autofill] Error for ${r} input:`, a.error), a.status === 400 && k(e, `Failed to get random ${r}`);
        const c = M(r);
        if (c !== s)
          if (console.warn(`[Gofakeit Autofill] Falling back to default function: ${c}`), c === "generateWeek")
            n = await B();
          else if (c === "generateTime")
            n = await q();
          else if (c === "generateMonth")
            n = await N();
          else if (c === "generateDate")
            n = await P();
          else if (c === "generateDateTime")
            n = await R();
          else {
            const i = await y(c);
            if (i.success)
              n = i.data;
            else
              return { success: !1, usedFunc: s };
          }
        else
          return { success: !1, usedFunc: s };
      }
    }
    if (r === "date") {
      const a = n.match(/^(\d{4}-\d{2}-\d{2})/);
      if (a)
        n = a[1];
      else
        return console.warn("[Gofakeit Autofill] Could not parse date from response:", n), { success: !1, usedFunc: s };
    } else if (r === "datetime-local") {
      const a = n.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(:\d{2})?/);
      if (a)
        n = a[1];
      else
        return console.warn("[Gofakeit Autofill] Could not parse datetime from response:", n), { success: !1, usedFunc: s };
    } else if (r === "week" && s !== "generateWeek" && (s === "date" || s.startsWith("daterange"))) {
      const a = n.match(/^(\d{4}-\d{2}-\d{2})/);
      if (a) {
        const c = new Date(a[1]), i = c.getFullYear(), u = me(c);
        n = `${i}-W${u.toString().padStart(2, "0")}`;
      } else
        return console.warn("[Gofakeit Autofill] Could not parse date for week from response:", n), { success: !1, usedFunc: s };
    }
    return ge(e, n), { success: !0, usedFunc: s };
  } catch (n) {
    return console.warn(`[Gofakeit Autofill] Unexpected error handling ${r} input:`, n), { success: !1, usedFunc: s };
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
  const o = ye(e, t), r = await y(o);
  if (!r.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${o}:`, r.error), r.status === 400 && k(e, "", o);
    const s = e.type.toLowerCase(), n = M(s);
    if (n !== o) {
      console.warn(`[Gofakeit Autofill] Falling back to default function: ${n}`);
      const a = await y(n);
      if (a.success)
        return L(e, a.data), { success: !0, usedFunc: n };
    }
    return { success: !1, usedFunc: o };
  }
  return L(e, r.data), { success: !0, usedFunc: o };
}
function Y(e) {
  return e === "true" ? "sentence" : e;
}
function F(e, t) {
  e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
async function be(e, t) {
  const o = Y(t), r = await y(o);
  if (!r.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${o}:`, r.error), r.status === 400 && k(e, "", o);
    const s = "sentence";
    if (s !== o) {
      console.warn(`[Gofakeit Autofill] Falling back to default function: ${s}`);
      const n = await y(s);
      if (n.success)
        return F(e, n.data), { success: !0, usedFunc: s };
    }
    return { success: !1, usedFunc: o };
  }
  return F(e, r.data), { success: !0, usedFunc: o };
}
async function K(e, t, o) {
  const r = Ee(e);
  if (r.length === 0)
    return console.warn("[Gofakeit Autofill] No checkbox group found for element:", e), { success: !1, usedFunc: "bool" };
  const s = t === "true" ? "bool" : t;
  if (o !== void 0)
    return r.forEach((a) => {
      a.checked = !1, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    }), (String(o).toLowerCase() === "true" || o === "1" || String(o).toLowerCase() === "yes") && r.length > 0 && (r[0].checked = !0, r[0].dispatchEvent(new Event("change", { bubbles: !0 }))), { success: !0, usedFunc: s };
  if (t === "true") {
    const n = Math.max(1, Math.ceil(r.length / 2));
    r.forEach((c) => {
      c.checked = !1, c.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    const a = /* @__PURE__ */ new Set();
    for (let c = 0; c < n; c++) {
      const i = await y("bool");
      if (i.success && (i.data.toLowerCase() === "true" || i.data.toLowerCase() === "1")) {
        const f = Array.from({ length: r.length }, (p, h) => h).filter((p) => !a.has(p));
        if (f.length > 0) {
          const p = f[Math.floor(Math.random() * f.length)];
          a.add(p), r[p].checked = !0, r[p].dispatchEvent(new Event("change", { bubbles: !0 }));
        }
      }
    }
  } else {
    const n = await y(s);
    if (!n.success)
      return console.warn(`[Gofakeit Autofill] Error for function ${s}:`, n.error), n.status === 400 && k(e, "", s), { success: !1, usedFunc: s };
    r.forEach((c) => {
      c.checked = !1, c.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    const a = n.data.split(",").map((c) => c.trim());
    r.forEach((c, i) => {
      const u = a.includes(c.value) || a.includes(i.toString());
      c.checked = u, c.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
  }
  return { success: !0, usedFunc: s };
}
async function j(e, t, o) {
  const r = Te(e), s = t === "true" ? "bool" : t;
  if (o !== void 0) {
    r.forEach((a) => {
      a.checked = !1, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    let n = r.find((a) => a.value === o);
    if (!n && !isNaN(Number(o))) {
      const a = parseInt(o);
      a >= 0 && a < r.length && (n = r[a]);
    }
    return n && (n.checked = !0, n.dispatchEvent(new Event("change", { bubbles: !0 }))), { success: !0, usedFunc: s, selectedElement: n };
  }
  if (t === "true") {
    r.forEach((a) => {
      a.checked = !1, a.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    const n = Math.floor(Math.random() * r.length);
    return r[n].checked = !0, r[n].dispatchEvent(new Event("change", { bubbles: !0 })), { success: !0, usedFunc: s, selectedElement: r[n] };
  } else {
    const n = await y(s);
    if (!n.success)
      return console.warn(`[Gofakeit Autofill] Error for function ${s}:`, n.error), n.status === 400 && k(e, "", s), { success: !1, usedFunc: s };
    r.forEach((i) => {
      i.checked = !1, i.dispatchEvent(new Event("change", { bubbles: !0 }));
    });
    const a = n.data.trim();
    let c = r.find((i) => i.value === a);
    if (!c && !isNaN(Number(a))) {
      const i = parseInt(a);
      i >= 0 && i < r.length && (c = r[i]);
    }
    if (c)
      return c.checked = !0, c.dispatchEvent(new Event("change", { bubbles: !0 })), { success: !0, usedFunc: s, selectedElement: c };
    {
      const i = Math.floor(Math.random() * r.length);
      return r[i].checked = !0, r[i].dispatchEvent(new Event("change", { bubbles: !0 })), { success: !0, usedFunc: s, selectedElement: r[i] };
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
  const r = Array.from(e.options).map((n) => n.value).filter((n) => n !== "");
  if (r.length === 0)
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
      const a = r.filter((c) => c !== "");
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
    const n = Math.floor(Math.random() * r.length);
    s = { success: !0, data: r[n] };
  } else
    s = await y(t);
  if (!s.success)
    return console.warn("[Gofakeit Autofill] Error for select:", s.error), s.status === 400 && k(e, "Failed to get selection"), { success: !1, usedFunc: t };
  if (e.multiple)
    if (Array.from(e.options).forEach((n) => n.selected = !1), t === "true") {
      const n = Math.min(Math.ceil(r.length / 2), r.length), a = [s.data], c = r.filter((i) => i !== s.data);
      for (let i = 1; i < n && c.length > 0; i++) {
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
  const o = ke(t), r = await y(o);
  return r.success ? (J(e, r.data), { success: !0, usedFunc: o }) : (console.warn(`[Gofakeit Autofill] Error for function ${o}:`, r.error), r.status === 400 && k(e, "", o), { success: !1, usedFunc: o });
}
function X(e) {
  const t = parseFloat(e.min) || 0, o = parseFloat(e.max) || 100;
  return `number?min=${t}&max=${o}`;
}
function Z(e, t) {
  const o = parseFloat(t);
  if (!isNaN(o)) {
    const r = parseFloat(e.min) || 0, s = parseFloat(e.max) || 100, n = Math.max(r, Math.min(s, o));
    e.value = n.toString(), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
}
async function Me(e) {
  const t = X(e), o = await y(t);
  return o.success ? (Z(e, o.data), { success: !0, usedFunc: t }) : (console.warn("[Gofakeit Autofill] Error for range input:", o.error), o.status === 400 && k(e, "Failed to get random number for range"), { success: !1, usedFunc: t });
}
async function S(e, t) {
  const r = { ...{ smart: !0 }, ...t };
  if (!e)
    return xe(r);
  if (e instanceof HTMLElement && I(e))
    return _(e, r);
  if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) {
    const s = await $(e, r);
    return s || T("Failed to autofill the specified element", "error"), s;
  }
  if (e instanceof HTMLElement) {
    const s = Ie(e);
    if (s)
      return _(s, r);
  }
  return !1;
}
async function xe(e) {
  const t = ee(), o = e.smart ?? !0, s = (o ? t : t.filter((a) => a.hasAttribute("data-gofakeit"))).filter((a) => !te(a));
  if (s.length === 0) {
    T(o ? "No form fields found to autofill" : "No data-gofakeit fields exist. Turn on Smart mode to fill all form fields.", "info");
    return;
  }
  console.log(`[Gofakeit] Found ${s.length} elements to generate data for`), T(`Starting data generation for ${s.length} fields...`, "info");
  const n = await oe(s, e);
  se(n.success, n.failed, "Autofill");
}
async function _(e, t) {
  const o = ee(e), r = t.smart ?? !0, n = (r ? o : o.filter((c) => c.hasAttribute("data-gofakeit"))).filter((c) => !te(c));
  if (n.length === 0) {
    T(r ? "No form fields found in this container" : "No data-gofakeit fields exist in this section. Turn on Smart mode to fill all form fields.", "info");
    return;
  }
  console.log(`[Gofakeit] Found ${n.length} elements to generate data for in container`), T(`Starting data generation for ${n.length} fields...`, "info");
  const a = await oe(n, t);
  se(a.success, a.failed, "Container autofill");
}
async function $(e, t) {
  const o = e.getAttribute("data-gofakeit");
  if (typeof o == "string" && o.trim().toLowerCase() === "false")
    return !1;
  const r = t.smart ?? !0;
  if (!o && !r)
    return !1;
  try {
    if (e instanceof HTMLSelectElement) {
      const s = o && o !== "true" ? o : "true", { success: n, usedFunc: a } = await Q(e, s);
      return n && g(e, a, t), n;
    }
    if (e instanceof HTMLTextAreaElement) {
      const s = o && o !== "true" ? o : "sentence", { success: n, usedFunc: a } = await be(e, s);
      return n && g(e, a, t), n;
    }
    if (e instanceof HTMLInputElement) {
      const s = e.type.toLowerCase();
      if (s === "checkbox") {
        const i = o && o !== "true" ? o : "true", { success: u, usedFunc: f } = await K(e, i);
        return u && g(e, f, t), u;
      }
      if (s === "radio") {
        const i = o && o !== "true" ? o : "true", { success: u, usedFunc: f, selectedElement: p } = await j(e, i);
        return u && g(p || e, f, t), u;
      }
      if (s === "range") {
        const { success: i, usedFunc: u } = await Me(e);
        return i && g(e, u, t), i;
      }
      const n = o && o !== "true" ? o : await ae(e);
      if (s === "number") {
        const { success: i, usedFunc: u } = await ve(e, n);
        return i && g(e, u, t), i;
      }
      if (s === "date" || s === "time" || s === "datetime-local" || s === "month" || s === "week") {
        const { success: i, usedFunc: u } = await z(e, n);
        return i && g(e, u, t), i;
      }
      const { success: a, usedFunc: c } = await we(e, n);
      return a && g(e, c, t), a;
    }
    return console.warn("[Gofakeit] Unsupported element type:", e), !1;
  } catch (s) {
    return console.error("[Gofakeit] Unexpected error generating data for element:", e, s), !1;
  }
}
function ee(e) {
  const t = "input, textarea, select", o = e ? e.querySelectorAll(t) : document.querySelectorAll(t), r = [];
  return o.forEach((s) => {
    if (s instanceof HTMLInputElement) {
      if (s.type === "hidden" || s.disabled || s.readOnly) return;
      r.push(s);
    } else if (s instanceof HTMLTextAreaElement) {
      if (s.disabled || s.readOnly) return;
      r.push(s);
    } else if (s instanceof HTMLSelectElement) {
      if (s.disabled) return;
      r.push(s);
    }
  }), r;
}
function te(e) {
  const t = e.getAttribute && e.getAttribute("data-gofakeit");
  return typeof t == "string" && t.trim().toLowerCase() === "false";
}
function Se(e) {
  const t = [], o = /* @__PURE__ */ new Set();
  for (const r of e) {
    if (r instanceof HTMLInputElement) {
      const s = r.type.toLowerCase();
      if (s === "checkbox" || s === "radio") {
        const n = r.name;
        if (n && o.has(n))
          continue;
        n && o.add(n);
      }
    }
    t.push(r);
  }
  return t;
}
async function oe(e, t) {
  let o = 0, r = 0;
  const s = Se(e), n = [], a = [];
  for (const l of s)
    if (l instanceof HTMLInputElement) {
      const d = l.type.toLowerCase();
      re(d) ? n.push(l) : a.push(l);
    } else
      a.push(l);
  let c = /* @__PURE__ */ new Map();
  if (n.length > 0)
    try {
      c = await $e(n);
    } catch (l) {
      console.warn("[Gofakeit Autofill] Search API failed, falling back to individual function detection:", l);
      for (const d of n) {
        const w = await U(d, t);
        w && c.set(d, w);
      }
    }
  const i = [], u = [];
  n.forEach((l) => {
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
      r++, console.warn("[Gofakeit Autofill] Failed to get function for element:", l, d);
    }
  if (globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : t.staggered ?? !0)
    for (let l = 0; l < i.length; l++) {
      const d = i[l], w = t.staggerDelay ?? 50;
      l > 0 && await new Promise((b) => setTimeout(b, w));
      try {
        await $(d, t) ? o++ : r++;
      } catch (b) {
        r++, console.warn("[Gofakeit Autofill] Failed to process excluded element:", d, b);
      }
    }
  else {
    const l = i.map(async (w) => {
      try {
        return await $(w, t);
      } catch (b) {
        return console.warn("[Gofakeit Autofill] Failed to process excluded element:", w, b), !1;
      }
    });
    (await Promise.all(l)).forEach((w) => {
      w ? o++ : r++;
    });
  }
  if (u.length === 0)
    return { success: o, failed: r };
  const h = u.map((l, d) => ({
    id: `req_${d}`,
    func: l.func
  })), E = await fe(h);
  if (!E.success || !E.data)
    return console.error("[Gofakeit Autofill] Batch API call failed:", E.error), { success: o, failed: r + u.length };
  for (let l = 0; l < u.length; l++) {
    const { element: d, func: w } = u[l], b = E.data[l], ce = globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : t.staggered ?? !0, ie = t.staggerDelay ?? 50;
    if (ce && l > 0 && await new Promise((A) => setTimeout(A, ie)), b && b.value !== null && !b.error)
      try {
        await Ae(d, w, b.value, t) ? (o++, setTimeout(() => {
          d instanceof HTMLInputElement || d instanceof HTMLTextAreaElement ? d.value === "" && console.warn("[Gofakeit Autofill] Value was cleared for element:", d) : d instanceof HTMLSelectElement && d.value === "" && console.warn("[Gofakeit Autofill] Value was cleared for select:", d);
        }, 1e3)) : r++;
      } catch (A) {
        r++, console.warn("[Gofakeit Autofill] Failed to apply value to element:", d, A);
      }
    else
      r++, console.warn("[Gofakeit Autofill] API error for element:", d, b?.error);
  }
  return { success: o, failed: r };
}
async function U(e, t) {
  const o = e.getAttribute("data-gofakeit");
  if (typeof o == "string" && o.trim().toLowerCase() === "false")
    return null;
  const r = t.smart ?? !0;
  if (!o && !r)
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
function g(e, t, o) {
  const s = globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : o?.staggered ?? !0, n = o?.staggerDelay ?? 50;
  setTimeout(() => {
    Le(e, t);
  }, s ? n : 0);
}
async function Ae(e, t, o, r) {
  try {
    if (e instanceof HTMLSelectElement) {
      const { success: s, usedFunc: n } = await Q(e, t, o);
      return s && g(e, n, r), s;
    }
    if (e instanceof HTMLTextAreaElement)
      return F(e, o), g(e, t, r), !0;
    if (e instanceof HTMLInputElement) {
      const s = e.type.toLowerCase();
      if (s === "checkbox") {
        const { success: n, usedFunc: a } = await K(e, t, o);
        return n && g(e, a, r), n;
      }
      if (s === "radio") {
        const { success: n, usedFunc: a } = await j(e, t, o);
        return n && g(e, a, r), n;
      }
      if (s === "number")
        return J(e, o), g(e, t, r), !0;
      if (s === "range")
        return Z(e, o), g(e, t, r), !0;
      if (s === "date" || s === "time" || s === "datetime-local" || s === "month" || s === "week") {
        const { success: n, usedFunc: a } = await z(e, t, o);
        return n && g(e, a, r), n;
      }
      return L(e, o), g(e, t, r), !0;
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
  e instanceof HTMLElement && (e.style.border = `2px solid ${x.error}`, setTimeout(() => {
    e.style.border = "";
  }, 5e3));
  const r = o ? `Invalid function: ${o}` : t;
  le(e, r);
}
function I(e) {
  return e.querySelectorAll("input[data-gofakeit], textarea[data-gofakeit], select[data-gofakeit]").length > 0;
}
const v = /* @__PURE__ */ new Map();
function Ce(e) {
  if (e instanceof HTMLInputElement && e.type === "radio" && e.name)
    document.querySelectorAll(`input[type="radio"][name="${e.name}"]`).forEach((o) => {
      const r = v.get(o);
      r && (clearTimeout(r.timeout), r.cleanup(), v.delete(o));
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
  o.textContent = t, o.style.position = "fixed", o.style.background = x.primary, o.style.color = "#000", o.style.fontFamily = "Arial, sans-serif", o.style.fontSize = "11px", o.style.padding = "3px 8px", o.style.borderRadius = "6px", o.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)", o.style.zIndex = "2147483647", o.style.opacity = "0", o.style.transform = "translateY(-6px)", o.style.transition = "opacity 200ms ease, transform 200ms ease", o.style.pointerEvents = "none";
  const r = () => {
    const f = e.getBoundingClientRect(), p = window.innerHeight || document.documentElement.clientHeight, h = window.innerWidth || document.documentElement.clientWidth;
    if (f.bottom <= 0 || f.top >= p || f.right <= 0 || f.left >= h) {
      o.style.display = "none";
      return;
    }
    o.style.display === "none" && (o.style.display = "block");
    const l = f.top - 8, d = f.left;
    o.style.top = `${l}px`, o.style.left = `${d}px`;
  };
  document.body.appendChild(o), r(), requestAnimationFrame(() => {
    o.style.opacity = "1", o.style.transform = "translateY(-12px)";
  });
  const s = () => r(), n = () => r();
  window.addEventListener("scroll", s, !0), window.addEventListener("resize", n, !0);
  let a = null;
  if (typeof ResizeObserver < "u") {
    a = new ResizeObserver(() => r());
    try {
      a.observe(e);
    } catch {
    }
  }
  const c = () => {
    if (window.removeEventListener("scroll", s, !0), window.removeEventListener("resize", n, !0), a) {
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
  const t = [], o = e.id, r = e.getAttribute("aria-labelledby");
  if (r && r.split(/\s+/).forEach((a) => {
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
  const n = e.previousElementSibling;
  return n && n.tagName === "LABEL" && n.textContent && t.push(n.textContent), t.join(" ").toLowerCase();
}
function re(e) {
  return !["checkbox", "radio", "select", "range", "file", "button", "submit", "reset", "image", "color", "week", "date", "time", "datetime-local", "month"].includes(e);
}
function M(e) {
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
function ne(e) {
  const t = e.type.toLowerCase(), o = (e.name || "").toLowerCase(), r = (e.id || "").toLowerCase(), s = (e.placeholder || "").toLowerCase(), n = (e.autocomplete || "").toLowerCase(), a = (e.getAttribute("aria-label") || "").toLowerCase(), c = Fe(e);
  return [
    t,
    o,
    r,
    s,
    n,
    a,
    c
  ].filter((f) => f && f.trim()).join(" ").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim() || "text input";
}
async function ae(e) {
  const t = e.type.toLowerCase();
  if (!re(t))
    return M(t);
  const o = ne(e);
  try {
    const r = {
      id: e.id || e.name || `input_${Date.now()}`,
      query: o
    }, s = await W([r]);
    if (s.success && s.data && s.data.length > 0) {
      const n = s.data[0];
      if (n.results && n.results.length > 0)
        return n.results[0].name;
    }
  } catch (r) {
    console.warn("[Gofakeit] Function search failed, falling back to default function:", r);
  }
  return M(t);
}
async function $e(e) {
  const t = /* @__PURE__ */ new Map();
  if (e.length === 0)
    return t;
  try {
    const o = e.map((s, n) => {
      const a = ne(s);
      return {
        id: s.id || s.name || `input_${n}`,
        query: a
      };
    }), r = await W(o);
    if (r.success && r.data)
      for (let s = 0; s < r.data.length; s++) {
        const n = r.data[s], a = e[s], c = a.type.toLowerCase();
        if (n.results && n.results.length > 0) {
          const i = n.results[0];
          i.score >= 100 ? t.set(a, i.name) : t.set(a, V(c));
        } else
          t.set(a, V(c));
      }
    else
      for (const s of e)
        t.set(s, M(s.type.toLowerCase()));
  } catch (o) {
    console.warn("[Gofakeit] Multi-function search failed, falling back to default functions:", o);
    for (const r of e)
      t.set(r, M(r.type.toLowerCase()));
  }
  return t;
}
function Ie(e) {
  if (I(e))
    return e;
  let t = e.parentElement;
  for (; t; ) {
    if (I(t))
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
          m("❌ Element not found: " + e, "error");
          return;
        }
        o.scrollIntoView({ behavior: "smooth", block: "start" }), setTimeout(async () => {
          await S(o, t), m(
            `✅ ${e} section filled successfully!`,
            "success"
          );
        }, 500);
      } else
        await S(e, t), m("✅ Element filled successfully!", "success");
    else
      await S(void 0, t), m("✅ All fields filled successfully!", "success");
  } catch (t) {
    m("❌ Error filling fields: " + t.message, "error");
  }
};
window.autofillCategory = async () => {
  const e = document.getElementById("categorySelector"), t = e.value;
  if (!t) {
    m("❌ Please select a category first!", "error");
    return;
  }
  try {
    const r = {
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
    if (!r) {
      m("❌ Invalid category selected!", "error");
      return;
    }
    const n = {
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
    if (n) {
      const c = document.querySelectorAll("h4");
      for (const i of c)
        if (i.textContent?.includes(n)) {
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
      const c = document.getElementById(r.section);
      c && c.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(async () => {
      const c = document.getElementById(t);
      if (!c) {
        m("❌ Category container not found!", "error");
        return;
      }
      try {
        const i = G();
        await S(c, i);
        let u = 0;
        c.querySelectorAll(
          "input, textarea, select"
        ).forEach((h) => {
          h instanceof HTMLInputElement ? h.type === "checkbox" || h.type === "radio" ? h.checked && u++ : h.value && u++ : (h instanceof HTMLTextAreaElement || h instanceof HTMLSelectElement) && h.value && u++;
        });
        const p = e.options[e.selectedIndex].text;
        m(
          `✅ ${p} filled successfully! (${u} fields)`,
          "success"
        );
      } catch (i) {
        console.warn("Failed to fill category:", i), m(
          "❌ Error filling category: " + i.message,
          "error"
        );
      }
    }, 500);
  } catch (o) {
    m("❌ Error filling category: " + o.message, "error");
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
    await S(void 0, e);
    const t = e.smart ? "Smart Mode" : "Manual Mode", o = e.staggered ? ` (${e.staggerDelay}ms delay)` : " (no stagger)";
    m(
      `✅ All fields filled with ${t}${o}!`,
      "success"
    );
  } catch (e) {
    m("❌ Error filling fields: " + e.message, "error");
  }
};
document.addEventListener("DOMContentLoaded", function() {
  const e = document.getElementById("staggerDelay"), t = document.getElementById("staggerDelayValue");
  e && t && e.addEventListener("input", function() {
    t.textContent = this.value;
  });
});
window.clearAll = () => {
  document.querySelectorAll("input, textarea, select").forEach((t) => {
    t.type === "checkbox" || t.type === "radio" ? t.checked = !1 : t.value = "";
  }), m("🧹 All fields cleared!", "success");
};
function m(e, t) {
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
