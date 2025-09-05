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
const C = {
  primary: "#ffa000",
  error: "#ff3860"
}, A = "https://api.gofakeit.com/funcs";
async function y(e) {
  const t = e.indexOf("?");
  if (t !== -1) {
    const o = e.substring(0, t), n = e.substring(t + 1), s = {}, r = new URLSearchParams(n);
    for (const [a, c] of r.entries()) {
      const i = parseFloat(c);
      s[a] = isNaN(i) ? c : i;
    }
    return q("POST", `${A}/${o}`, s);
  } else
    return q("GET", `${A}/${e}`);
}
async function ie(e) {
  if (e.length === 0)
    return {
      success: !1,
      error: "No functions provided"
    };
  const t = e.map((o, n) => {
    const { func: s, id: r } = o, a = s.indexOf("?");
    if (a !== -1) {
      const c = s.substring(0, a), i = s.substring(a + 1), u = {}, d = new URLSearchParams(i);
      for (const [h, E] of d.entries()) {
        const T = parseFloat(E);
        u[h] = isNaN(T) ? E : T;
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
  return ue("POST", `${A}/multi`, t);
}
async function V(e) {
  return e.length === 0 ? {
    success: !1,
    error: "No search queries provided"
  } : le("POST", `${A}/search`, e);
}
async function q(e, t, o) {
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
async function ue(e, t, o) {
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
async function le(e, t, o) {
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
function fe(e, t) {
  const o = e.type.toLowerCase();
  return o === "date" ? t === "true" ? "generateDate" : t : o === "datetime-local" ? t === "true" ? "generateDateTime" : t : o === "time" ? t === "true" ? "generateTime" : t : o === "month" ? t === "true" ? "generateMonth" : t : o === "week" && t === "true" ? "generateWeek" : t;
}
function de(e, t) {
  e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
async function H() {
  const e = Math.floor(Math.random() * 24).toString().padStart(2, "0"), t = Math.floor(Math.random() * 60).toString().padStart(2, "0");
  return `${e}:${t}`;
}
async function N() {
  const e = Math.floor(Math.random() * 30) + 1990, t = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0");
  return `${e}-${t}`;
}
async function O() {
  const e = Math.floor(Math.random() * 30) + 1990, t = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0"), o = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, "0");
  return `${e}-${t}-${o}`;
}
async function P() {
  const e = Math.floor(Math.random() * 30) + 1990, t = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, "0"), o = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, "0"), n = Math.floor(Math.random() * 24).toString().padStart(2, "0"), s = Math.floor(Math.random() * 60).toString().padStart(2, "0");
  return `${e}-${t}-${o}T${n}:${s}`;
}
async function R() {
  const e = await y("year"), t = await y("number?min=1&max=53");
  if (!e.success || !t.success)
    throw new Error(`Failed to generate week: ${e.error || t.error}`);
  const o = t.data.padStart(2, "0");
  return `${e.data}-W${o}`;
}
function he(e) {
  const t = new Date(e.getTime());
  t.setUTCHours(0, 0, 0, 0), t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const o = new Date(t.getUTCFullYear(), 0, 4);
  return Math.ceil(((t.getTime() - o.getTime()) / 864e5 - 3 + (o.getUTCDay() || 7)) / 7);
}
async function W(e, t, o) {
  const n = e.type.toLowerCase(), s = fe(e, t);
  try {
    let r;
    if (o !== void 0)
      r = o;
    else if (s === "generateTime")
      r = await H();
    else if (s === "generateMonth")
      r = await N();
    else if (s === "generateWeek")
      r = await R();
    else if (s === "generateDate")
      r = await O();
    else if (s === "generateDateTime")
      r = await P();
    else {
      const a = await y(s);
      if (a.success)
        r = a.data;
      else {
        console.warn(`[Gofakeit Autofill] Error for ${n} input:`, a.error), a.status === 400 && k(e, `Failed to get random ${n}`);
        const c = v(n);
        if (c !== s)
          if (console.warn(`[Gofakeit Autofill] Falling back to default function: ${c}`), c === "generateWeek")
            r = await R();
          else if (c === "generateTime")
            r = await H();
          else if (c === "generateMonth")
            r = await N();
          else if (c === "generateDate")
            r = await O();
          else if (c === "generateDateTime")
            r = await P();
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
        const c = new Date(a[1]), i = c.getFullYear(), u = he(c);
        r = `${i}-W${u.toString().padStart(2, "0")}`;
      } else
        return console.warn("[Gofakeit Autofill] Could not parse date for week from response:", r), { success: !1, usedFunc: s };
    }
    return de(e, r), { success: !0, usedFunc: s };
  } catch (r) {
    return console.warn(`[Gofakeit Autofill] Unexpected error handling ${n} input:`, r), { success: !1, usedFunc: s };
  }
}
function pe(e, t) {
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
async function me(e, t) {
  const o = pe(e, t), n = await y(o);
  if (!n.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${o}:`, n.error), n.status === 400 && k(e, "", o);
    const s = e.type.toLowerCase(), r = v(s);
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
async function ge(e, t) {
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
async function j(e, t, o) {
  const n = ye(e);
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
        const d = Array.from({ length: n.length }, (h, E) => E).filter((h) => !a.has(h));
        if (d.length > 0) {
          const h = d[Math.floor(Math.random() * d.length)];
          a.add(h), n[h].checked = !0, n[h].dispatchEvent(new Event("change", { bubbles: !0 }));
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
async function z(e, t, o) {
  const n = we(e), s = t === "true" ? "bool" : t;
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
function ye(e) {
  if (e.type !== "checkbox") return [e];
  const t = e.name, o = e.closest("form, div, fieldset") || document;
  return t ? Array.from(o.querySelectorAll(`input[type="checkbox"][name="${t}"]`)) : Array.from(o.querySelectorAll('input[type="checkbox"]'));
}
function we(e) {
  if (e.type !== "radio") return [e];
  const t = e.name;
  if (t)
    return Array.from(document.querySelectorAll(`input[type="radio"][name="${t}"]`));
  {
    const o = e.closest("form, div, fieldset") || document;
    return Array.from(o.querySelectorAll('input[type="radio"]'));
  }
}
async function K(e, t, o) {
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
        const u = e.options.namedItem(i) || Array.from(e.options).find((d) => d.value === i);
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
function be(e) {
  return e === "true" ? "number" : e;
}
function Q(e, t) {
  e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
}
async function Ee(e, t) {
  const o = be(t), n = await y(o);
  return n.success ? (Q(e, n.data), { success: !0, usedFunc: o }) : (console.warn(`[Gofakeit Autofill] Error for function ${o}:`, n.error), n.status === 400 && k(e, "", o), { success: !1, usedFunc: o });
}
function J(e) {
  const t = parseFloat(e.min) || 0, o = parseFloat(e.max) || 100;
  return `number?min=${t}&max=${o}`;
}
function X(e, t) {
  const o = parseFloat(t);
  if (!isNaN(o)) {
    const n = parseFloat(e.min) || 0, s = parseFloat(e.max) || 100, r = Math.max(n, Math.min(s, o));
    e.value = r.toString(), e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
}
async function Te(e) {
  const t = J(e), o = await y(t);
  return o.success ? (X(e, o.data), { success: !0, usedFunc: t }) : (console.warn("[Gofakeit Autofill] Error for range input:", o.error), o.status === 400 && k(e, "Failed to get random number for range"), { success: !1, usedFunc: t });
}
async function x(e, t) {
  const n = { ...{ smart: !0 }, ...t };
  if (!e)
    return ke(n);
  if (typeof e == "string") {
    const s = document.querySelector(e);
    if (s)
      console.log(`[Gofakeit] Found element with selector "${e}":`, s), e = s;
    else
      return console.warn(`[Gofakeit] No element found with selector: "${e}"`), b(`No element found with selector: ${e}`, "error"), !1;
  }
  if (e instanceof HTMLElement && $(e))
    return B(e, n);
  if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) {
    const s = await I(e, n);
    return s || b("Failed to autofill the specified element", "error"), s;
  }
  if (e instanceof HTMLElement) {
    const s = Ae(e);
    if (s)
      return B(s, n);
  }
  return !1;
}
async function ke(e) {
  const t = Z(), o = e.smart ?? !0, s = (o ? t : t.filter((a) => a.hasAttribute("data-gofakeit"))).filter((a) => !ee(a));
  if (s.length === 0) {
    b(o ? "No form fields found to autofill" : "No data-gofakeit fields exist. Turn on Smart mode to fill all form fields.", "info");
    return;
  }
  console.log(`[Gofakeit] Found ${s.length} elements to generate data for`), b(`Starting data generation for ${s.length} fields...`, "info");
  const r = await te(s, e);
  ne(r.success, r.failed, "Autofill");
}
async function B(e, t) {
  const o = Z(e), n = t.smart ?? !0, r = (n ? o : o.filter((c) => c.hasAttribute("data-gofakeit"))).filter((c) => !ee(c));
  if (r.length === 0) {
    b(n ? "No form fields found in this container" : "No data-gofakeit fields exist in this section. Turn on Smart mode to fill all form fields.", "info");
    return;
  }
  console.log(`[Gofakeit] Found ${r.length} elements to generate data for in container`), b(`Starting data generation for ${r.length} fields...`, "info");
  const a = await te(r, t);
  ne(a.success, a.failed, "Container autofill");
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
      const s = o && o !== "true" ? o : "true", { success: r, usedFunc: a } = await K(e, s);
      return r && g(e, a, t), r;
    }
    if (e instanceof HTMLTextAreaElement) {
      const s = o && o !== "true" ? o : "sentence", { success: r, usedFunc: a } = await ge(e, s);
      return r && g(e, a, t), r;
    }
    if (e instanceof HTMLInputElement) {
      const s = e.type.toLowerCase();
      if (s === "checkbox") {
        const i = o && o !== "true" ? o : "true", { success: u, usedFunc: d } = await j(e, i);
        return u && g(e, d, t), u;
      }
      if (s === "radio") {
        const i = o && o !== "true" ? o : "true", { success: u, usedFunc: d, selectedElement: h } = await z(e, i);
        return u && g(h || e, d, t), u;
      }
      if (s === "range") {
        const { success: i, usedFunc: u } = await Te(e);
        return i && g(e, u, t), i;
      }
      const r = o && o !== "true" ? o : await re(e);
      if (s === "number") {
        const { success: i, usedFunc: u } = await Ee(e, r);
        return i && g(e, u, t), i;
      }
      if (s === "date" || s === "time" || s === "datetime-local" || s === "month" || s === "week") {
        const { success: i, usedFunc: u } = await W(e, r);
        return i && g(e, u, t), i;
      }
      const { success: a, usedFunc: c } = await me(e, r);
      return a && g(e, c, t), a;
    }
    return console.warn("[Gofakeit] Unsupported element type:", e), !1;
  } catch (s) {
    return console.error("[Gofakeit] Unexpected error generating data for element:", e, s), !1;
  }
}
function Z(e) {
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
function ee(e) {
  const t = e.getAttribute && e.getAttribute("data-gofakeit");
  return typeof t == "string" && t.trim().toLowerCase() === "false";
}
function Me(e) {
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
async function te(e, t) {
  let o = 0, n = 0;
  const s = Me(e), r = [], a = [];
  for (const f of s) {
    const l = f.getAttribute("data-gofakeit"), p = l && l.trim().toLowerCase() !== "true" && l.trim().toLowerCase() !== "false";
    if (f instanceof HTMLInputElement) {
      const m = f.type.toLowerCase();
      se(m) && !p ? r.push(f) : a.push(f);
    } else
      a.push(f);
  }
  let c = /* @__PURE__ */ new Map();
  if (r.length > 0)
    try {
      c = await Se(r);
    } catch (f) {
      console.warn("[Gofakeit Autofill] Search API failed, falling back to individual function detection:", f);
      for (const l of r) {
        const p = await _(l, t);
        p && c.set(l, p);
      }
    }
  const i = [], u = [];
  r.forEach((f) => {
    const l = c.get(f);
    l && u.push({ element: f, func: l });
  });
  for (const f of a)
    try {
      const l = await _(f, t);
      if (l) {
        if (f instanceof HTMLInputElement) {
          const p = f.type.toLowerCase();
          if (["checkbox", "radio", "range", "file", "button", "submit", "reset", "image", "color", "date", "time", "datetime-local", "month", "week"].includes(p)) {
            i.push(f);
            continue;
          }
        }
        u.push({ element: f, func: l });
      }
    } catch (l) {
      n++, console.warn("[Gofakeit Autofill] Failed to get function for element:", f, l);
    }
  if (globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : t.staggered ?? !0)
    for (let f = 0; f < i.length; f++) {
      const l = i[f], p = t.staggerDelay ?? 50;
      f > 0 && await new Promise((m) => setTimeout(m, p));
      try {
        await I(l, t) ? o++ : n++;
      } catch (m) {
        n++, console.warn("[Gofakeit Autofill] Failed to process excluded element:", l, m);
      }
    }
  else {
    const f = i.map(async (p) => {
      try {
        return await I(p, t);
      } catch (m) {
        return console.warn("[Gofakeit Autofill] Failed to process excluded element:", p, m), !1;
      }
    });
    (await Promise.all(f)).forEach((p) => {
      p ? o++ : n++;
    });
  }
  if (u.length === 0)
    return { success: o, failed: n };
  const E = u.map((f, l) => ({
    id: `req_${l}`,
    func: f.func
  })), T = await ie(E);
  if (!T.success || !T.data)
    return console.error("[Gofakeit Autofill] Batch API call failed:", T.error), { success: o, failed: n + u.length };
  for (let f = 0; f < u.length; f++) {
    const { element: l, func: p } = u[f], m = T.data[f], ae = globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : t.staggered ?? !0, ce = t.staggerDelay ?? 50;
    if (ae && f > 0 && await new Promise((S) => setTimeout(S, ce)), m && m.error)
      n++, console.warn("[Gofakeit Autofill] API error for element:", l, m.error), G(l, m.error, "error");
    else if (m && m.value !== null)
      try {
        await ve(l, p, m.value, t) ? (o++, setTimeout(() => {
          l instanceof HTMLInputElement || l instanceof HTMLTextAreaElement ? l.value === "" && console.warn("[Gofakeit Autofill] Value was cleared for element:", l) : l instanceof HTMLSelectElement && l.value === "" && console.warn("[Gofakeit Autofill] Value was cleared for select:", l);
        }, 1e3)) : n++;
      } catch (S) {
        n++, console.warn("[Gofakeit Autofill] Failed to apply value to element:", l, S);
      }
    else
      n++, console.warn("[Gofakeit Autofill] No valid response for element:", l);
  }
  return { success: o, failed: n };
}
async function _(e, t) {
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
      return s === "checkbox" ? o && o !== "true" ? o : "bool" : s === "radio" ? o && o !== "true" ? o : "true" : s === "range" ? J(e) : o && o !== "true" ? o : await re(e);
    }
    return console.warn("[Gofakeit] Unsupported element type for batching:", e), null;
  } catch (s) {
    return console.error("[Gofakeit] Unexpected error getting function for element:", e, s), null;
  }
}
async function ve(e, t, o, n) {
  try {
    if (e instanceof HTMLSelectElement) {
      const { success: s, usedFunc: r } = await K(e, t, o);
      return s && g(e, r, n), s;
    }
    if (e instanceof HTMLTextAreaElement)
      return F(e, o), g(e, t, n), !0;
    if (e instanceof HTMLInputElement) {
      const s = e.type.toLowerCase();
      if (s === "checkbox") {
        const { success: r, usedFunc: a } = await j(e, t, o);
        return r && g(e, a, n), r;
      }
      if (s === "radio") {
        const { success: r, usedFunc: a } = await z(e, t, o);
        return r && g(e, a, n), r;
      }
      if (s === "number")
        return Q(e, o), g(e, t, n), !0;
      if (s === "range")
        return X(e, o), g(e, t, n), !0;
      if (s === "date" || s === "time" || s === "datetime-local" || s === "month" || s === "week") {
        const { success: r, usedFunc: a } = await W(e, t, o);
        return r && g(e, a, n), r;
      }
      return L(e, o), g(e, t, n), !0;
    }
    return console.warn("[Gofakeit] Unsupported element type:", e), !1;
  } catch (s) {
    return console.error("[Gofakeit] Unexpected error generating data for element:", e, s), !1;
  }
}
function ne(e, t, o) {
  e > 0 && (console.log(`[Gofakeit] ${o} completed successfully for ${e} fields`), b(`Successfully generated data for ${e} fields!`, "success")), t > 0 && (console.error(`[Gofakeit] ${o} failed for ${t} fields`), b(`Failed to generate data for ${t} fields.`, "error")), e === 0 && t === 0 && (console.log(`[Gofakeit] ${o} - no fields were processed`), b("No fields were processed.", "info"));
}
function g(e, t, o) {
  const s = globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : o?.staggered ?? !0, r = o?.staggerDelay ?? 50;
  setTimeout(() => {
    G(e, t);
  }, s ? r : 0);
}
function k(e, t, o) {
  e instanceof HTMLElement && (e.style.border = "2px solid #dc3545", setTimeout(() => {
    e.style.border = "";
  }, 5e3));
  const n = o ? `Invalid function: ${o}` : t;
  G(e, n, "error");
}
function $(e) {
  return e.querySelectorAll("input, textarea, select").length > 0;
}
function xe(e) {
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
function se(e) {
  return !["checkbox", "radio", "select", "range", "file", "button", "submit", "reset", "image", "color", "week", "date", "time", "datetime-local", "month"].includes(e);
}
function v(e) {
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
function U(e) {
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
function oe(e) {
  const t = e.type.toLowerCase(), o = (e.name || "").toLowerCase(), n = (e.id || "").toLowerCase(), s = (e.placeholder || "").toLowerCase(), r = (e.autocomplete || "").toLowerCase(), a = (e.getAttribute("aria-label") || "").toLowerCase(), c = xe(e);
  return [
    t,
    o,
    n,
    s,
    r,
    a,
    c
  ].filter((d) => d && d.trim()).join(" ").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim() || "text input";
}
async function re(e) {
  const t = e.type.toLowerCase();
  if (!se(t))
    return v(t);
  const o = oe(e);
  try {
    const n = {
      id: e.id || e.name || `input_${Date.now()}`,
      query: o
    }, s = await V([n]);
    if (s.success && s.data && s.data.length > 0) {
      const r = s.data[0];
      if (r.results && r.results.length > 0)
        return r.results[0].name;
    }
  } catch (n) {
    console.warn("[Gofakeit] Function search failed, falling back to default function:", n);
  }
  return v(t);
}
async function Se(e) {
  const t = /* @__PURE__ */ new Map();
  if (e.length === 0)
    return t;
  try {
    const o = e.map((s, r) => {
      const a = oe(s);
      return {
        id: s.id || s.name || `input_${r}`,
        query: a
      };
    }), n = await V(o);
    if (n.success && n.data)
      for (let s = 0; s < n.data.length; s++) {
        const r = n.data[s], a = e[s], c = a.type.toLowerCase();
        if (r.results && r.results.length > 0) {
          const i = r.results[0];
          i.score >= 100 ? t.set(a, i.name) : t.set(a, U(c));
        } else
          t.set(a, U(c));
      }
    else
      for (const s of e)
        t.set(s, v(s.type.toLowerCase()));
  } catch (o) {
    console.warn("[Gofakeit] Multi-function search failed, falling back to default functions:", o);
    for (const n of e)
      t.set(n, v(n.type.toLowerCase()));
  }
  return t;
}
function Ae(e) {
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
function b(e, t = "info") {
  console.log(`[Gofakeit ${t.toUpperCase()}] ${e}`);
}
const M = /* @__PURE__ */ new Map();
function G(e, t, o = "success") {
  if (!(e instanceof HTMLElement)) return;
  Ce(e);
  const n = document.createElement("div");
  n.textContent = t, n.style.position = "fixed", n.style.fontFamily = "Arial, sans-serif", n.style.fontSize = "11px", n.style.padding = "3px 8px", n.style.borderRadius = "6px", n.style.boxShadow = "0 2px 6px rgba(0,0,0,0.25)", n.style.zIndex = "2147483647", n.style.opacity = "0", n.style.transform = "translateY(-6px)", n.style.transition = "opacity 200ms ease, transform 200ms ease", n.style.pointerEvents = "none", o === "error" ? (n.style.background = C.error, n.style.color = "#fff", n.style.border = `1px solid ${C.error}`) : (n.style.background = C.primary, n.style.color = "#000");
  const s = () => {
    const h = e.getBoundingClientRect(), E = window.innerHeight || document.documentElement.clientHeight, T = window.innerWidth || document.documentElement.clientWidth;
    if (h.bottom <= 0 || h.top >= E || h.right <= 0 || h.left >= T) {
      n.style.display = "none";
      return;
    }
    n.style.display === "none" && (n.style.display = "block");
    const l = h.top - 8, p = h.left;
    n.style.top = `${l}px`, n.style.left = `${p}px`;
  };
  document.body.appendChild(n), s(), requestAnimationFrame(() => {
    n.style.opacity = "1", n.style.transform = "translateY(-12px)";
  });
  const r = () => s(), a = () => s();
  window.addEventListener("scroll", r, !0), window.addEventListener("resize", a, !0);
  let c = null;
  if (typeof ResizeObserver < "u") {
    c = new ResizeObserver(() => s());
    try {
      c.observe(e);
    } catch {
    }
  }
  const i = () => {
    if (window.removeEventListener("scroll", r, !0), window.removeEventListener("resize", a, !0), c) {
      try {
        c.disconnect();
      } catch {
      }
      c = null;
    }
    n.parentNode && n.parentNode.removeChild(n), M.delete(e);
  }, d = setTimeout(() => {
    n.style.opacity = "0", n.style.transform = "translateY(-6px)", setTimeout(i, 220);
  }, 6e3);
  M.set(e, { badge: n, timeout: d, cleanup: i });
}
function Ce(e) {
  if (e instanceof HTMLInputElement && e.type === "radio" && e.name)
    document.querySelectorAll(
      `input[type="radio"][name="${e.name}"]`
    ).forEach((o) => {
      const n = M.get(o);
      n && (clearTimeout(n.timeout), n.cleanup(), M.delete(o));
    });
  else {
    const t = M.get(e);
    t && (clearTimeout(t.timeout), t.cleanup(), M.delete(e));
  }
}
window.autofill = async (e) => {
  try {
    const t = D();
    if (e)
      if (typeof e == "string") {
        const o = document.querySelector(e);
        o ? (o.scrollIntoView({ behavior: "smooth", block: "start" }), setTimeout(async () => {
          await x(e, t), w(
            `✅ ${e} section filled successfully!`,
            "success"
          );
        }, 500)) : w("❌ Element not found: " + e, "error");
      } else
        await x(e, t), w("✅ Element filled successfully!", "success");
    else
      await x(void 0, t), w("✅ All fields filled successfully!", "success");
  } catch (t) {
    w("❌ Error filling fields: " + t.message, "error");
  }
};
window.handleCategorySelection = async () => {
  const e = document.getElementById("categorySelector"), t = e.value;
  if (t)
    try {
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
      let s = null;
      if (n) {
        const r = document.querySelectorAll("h4");
        for (const a of r)
          if (a.textContent?.includes(n)) {
            s = a;
            break;
          }
      }
      if (s)
        s.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      else {
        const r = document.getElementById("categories");
        r && r.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(async () => {
        const r = document.getElementById(t);
        if (!r) {
          w("❌ Category container not found!", "error");
          return;
        }
        try {
          const a = D();
          await x(r, a);
          let c = 0;
          r.querySelectorAll(
            "input, textarea, select"
          ).forEach((d) => {
            d instanceof HTMLInputElement ? d.type === "checkbox" || d.type === "radio" ? d.checked && c++ : d.value && c++ : (d instanceof HTMLTextAreaElement || d instanceof HTMLSelectElement) && d.value && c++;
          });
          const u = e.options[e.selectedIndex].text;
          w(
            `✅ ${u} filled successfully! (${c} fields)`,
            "success"
          );
        } catch (a) {
          console.warn("Failed to fill category:", a), w(
            "❌ Error filling category: " + a.message,
            "error"
          );
        }
        e.value = "";
      }, 500);
    } catch (o) {
      w("❌ Error filling category: " + o.message, "error"), e.value = "";
    }
};
function D() {
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
    const e = D();
    await x(void 0, e);
    const t = e.smart ? "Smart Mode" : "Manual Mode", o = e.staggered ? ` (${e.staggerDelay}ms delay)` : " (no stagger)";
    w(
      `✅ All fields filled with ${t}${o}!`,
      "success"
    );
  } catch (e) {
    w("❌ Error filling fields: " + e.message, "error");
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
  const e = document.querySelector(".main-content");
  if (!e) return;
  e.querySelectorAll("input, textarea, select").forEach((o) => {
    o.type === "checkbox" || o.type === "radio" ? o.checked = !1 : o.value = "";
  }), w("🧹 All fields cleared!", "success");
};
function w(e, t) {
  const o = document.getElementById("status");
  o.textContent = e, o.style.display = "block", o.className = `status ${t} show`, setTimeout(() => {
    o.classList.remove("show"), setTimeout(() => {
      o.style.display = "none";
    }, 300);
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
