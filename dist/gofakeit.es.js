(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n);
  new MutationObserver((n) => {
    for (const a of n)
      if (a.type === "childList")
        for (const o of a.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && s(o);
  }).observe(document, {
    childList: !0,
    subtree: !0
  });
  function t(n) {
    const a = {};
    return n.integrity && (a.integrity = n.integrity), n.referrerPolicy && (a.referrerPolicy = n.referrerPolicy), n.crossOrigin === "use-credentials" ? a.credentials = "include" : n.crossOrigin === "anonymous" ? a.credentials = "omit" : a.credentials = "same-origin", a;
  }
  function s(n) {
    if (n.ep) return;
    n.ep = !0;
    const a = t(n);
    fetch(n.href, a);
  }
})();
const k = "https://api.gofakeit.com/funcs";
async function A(r) {
  if (r.length === 0)
    return {
      success: !1,
      error: "No functions provided"
    };
  const e = r.map(
    (t, s) => {
      const { func: n, id: a, params: o } = t, { func: i, params: c } = $(n), l = { ...c, ...o || {} };
      return {
        id: a || `req_${s}`,
        func: i,
        params: l
      };
    }
  );
  return C(
    "POST",
    `${k}/multi`,
    e
  );
}
async function M(r) {
  return r.length === 0 ? {
    success: !1,
    error: "No search queries provided"
  } : C(
    "POST",
    `${k}/search`,
    r
  );
}
async function C(r, e, t) {
  try {
    const s = {
      method: r,
      headers: {
        "Content-Type": "application/json"
      }
    };
    r === "POST" && t && (s.body = JSON.stringify(t));
    const n = await fetch(e, s);
    if (!n.ok)
      return {
        success: !1,
        error: `HTTP error! status: ${n.status}`,
        status: n.status
      };
    let a;
    return e.includes("/multi") || e.includes("/search") ? a = await n.json() : a = await n.text(), {
      success: !0,
      data: a
    };
  } catch (s) {
    return {
      success: !1,
      error: s instanceof Error ? s.message : "Unknown error"
    };
  }
}
function $(r) {
  const e = r.indexOf("?");
  if (e !== -1) {
    const t = r.substring(0, e), s = r.substring(e + 1), n = {}, a = new URLSearchParams(s);
    for (const [o, i] of a.entries()) {
      const c = parseFloat(i);
      n[o] = isNaN(c) ? i : c;
    }
    return { func: t, params: n };
  } else
    return { func: r, params: {} };
}
const E = {
  primary: "#ffa000",
  white: "#ffffff",
  error: "#ff3860",
  text: "#333333"
}, T = {
  // px
  half: 8,
  // px
  quarter: 4
  // px
}, N = {
  radius: 4
}, x = {
  size: 12,
  // px
  family: "Helvetica, Arial, sans-serif"
};
var L = /* @__PURE__ */ ((r) => (r.IDLE = "idle", r.STARTING = "starting", r.INITIALIZING = "initializing", r.DETERMINING_FUNCTIONS = "determining_functions", r.GETTING_VALUES = "getting_values", r.SETTING_VALUES = "setting_values", r.COMPLETED = "completed", r.ERROR = "error", r))(L || {});
class y {
  settings;
  state;
  constructor(e = {}) {
    this.settings = {
      mode: "auto",
      stagger: 50,
      badges: 3e3,
      debug: !1,
      ...e
    }, this.state = {
      status: "idle",
      elements: []
    };
  }
  // ============================================================================
  // MAIN FILL FUNCTION
  // ============================================================================
  async fill(e) {
    return this.updateStatus(
      "starting"
      /* STARTING */
    ), this.state.elements = [], this.setElements(e), this.state.elements.length === 0 ? (this.debug("info", "No form fields found to fill"), this.state.status !== "error" && this.updateStatus(
      "idle"
      /* IDLE */
    ), this.results()) : (await this.setElementFunctions(), this.updateStatus(
      "determining_functions"
      /* DETERMINING_FUNCTIONS */
    ), await this.getElementValues(), this.updateStatus(
      "getting_values"
      /* GETTING_VALUES */
    ), await this.setElementValues(), this.updateStatus(
      "setting_values"
      /* SETTING_VALUES */
    ), this.updateStatus(
      "completed"
      /* COMPLETED */
    ), this.results());
  }
  // ============================================================================
  // Step 1: Set all target elements based on the target parameter
  // ============================================================================
  // Public method to set form elements based on target parameter
  setElements(e) {
    const t = [];
    if (e) {
      if (typeof e == "string") {
        const o = document.querySelectorAll(e);
        if (o.length === 0) {
          this.debug("error", `No element found with selector: "${e}"`), this.updateStatus(
            "error"
            /* ERROR */
          ), this.state.elements = [];
          return;
        }
        o.forEach((i) => {
          if (i instanceof HTMLInputElement || i instanceof HTMLTextAreaElement || i instanceof HTMLSelectElement) {
            if (this.shouldSkipElement(i)) return;
            t.push(i);
          } else
            i.querySelectorAll("input, textarea, select").forEach((p) => {
              this.shouldSkipElement(p) || t.push(p);
            });
        });
      } else if (e instanceof HTMLElement || e instanceof Element)
        if (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) {
          if (this.shouldSkipElement(e)) {
            this.state.elements = [];
            return;
          }
          t.push(e);
        } else
          e.querySelectorAll("input, textarea, select").forEach((c) => {
            this.shouldSkipElement(c) || t.push(c);
          });
    } else
      document.querySelectorAll("input, textarea, select").forEach((c) => {
        this.shouldSkipElement(c) || t.push(c);
      });
    const s = this.settings.mode ?? "auto", n = [];
    for (const o of t) {
      const i = o.getAttribute("data-gofakeit");
      typeof i == "string" && i.trim().toLowerCase() === "false" || s === "manual" && !i || n.push(o);
    }
    const a = [];
    for (const o of n) {
      const i = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      a.push({
        id: i,
        name: o.getAttribute("name") || "",
        element: o,
        type: this.getElementType(o),
        function: "",
        search: this.getElementSearch(o),
        value: "",
        error: ""
      });
    }
    this.state.elements = a, a.length > 0 && this.debug(
      "info",
      `Found ${a.length} elements to generate data for`
    );
  }
  // Check if an element should be skipped (hidden, disabled, or readonly)
  shouldSkipElement(e) {
    return e instanceof HTMLInputElement ? e.type === "hidden" || e.disabled || e.readOnly : e instanceof HTMLTextAreaElement ? e.disabled || e.readOnly : e instanceof HTMLSelectElement ? e.disabled : !1;
  }
  // Get the element type
  getElementType(e) {
    return e instanceof HTMLInputElement ? e.type.toLowerCase() : e instanceof HTMLTextAreaElement ? "textarea" : e instanceof HTMLSelectElement ? "select" : "unknown";
  }
  // Get the comprehensive search string for an element
  getElementSearch(e) {
    const t = [], s = e.id, n = e.getAttribute("aria-labelledby");
    if (n && n.split(/\s+/).forEach((u) => {
      const f = document.getElementById(u);
      f && f.textContent && t.push(f.textContent);
    }), s) {
      const u = document.querySelector(
        'label[for="' + s.replace(/"/g, '\\"') + '"]'
      );
      u && u.textContent && t.push(u.textContent);
    }
    const a = e.closest("label");
    a && a.textContent && t.push(a.textContent);
    const o = e.previousElementSibling;
    o && o.tagName === "LABEL" && o.textContent && t.push(o.textContent);
    const i = t.join(" ").toLowerCase(), c = e instanceof HTMLInputElement ? e.type.toLowerCase() : "", l = (e.getAttribute("name") || "").toLowerCase(), p = (e.id || "").toLowerCase(), d = e instanceof HTMLInputElement ? (e.placeholder || "").toLowerCase() : "", v = e instanceof HTMLInputElement ? (e.autocomplete || "").toLowerCase() : "", b = (e.getAttribute("aria-label") || "").toLowerCase();
    return [
      c,
      l,
      p,
      d,
      v,
      b,
      i
    ].filter((u) => u && u.trim()).join(" ").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  // ============================================================================
  // Step 2: Determine functions for elements that need search
  // ============================================================================
  async setElementFunctions() {
    this.debug(
      "info",
      `Determining functions for ${this.state.elements.length} elements`
    );
    const e = [];
    for (const t of this.state.elements) {
      const s = this.getElementFunction(t.element);
      s !== null ? t.function = s : e.push(t);
    }
    if (e.length > 0) {
      this.debug(
        "info",
        `${e.length} elements need function search`
      );
      const t = e.map((n, a) => ({
        id: n.element.id || n.element.getAttribute("name") || `input_${a}`,
        query: n.search
      })), s = await M(t);
      if (s.success && s.data)
        for (let n = 0; n < s.data.length; n++) {
          const a = s.data[n], o = e[n];
          a.results && a.results.length > 0 ? o.function = a.results[0].name : o.function = this.getElementFunctionFallback(o.element);
        }
      else
        for (const n of e)
          n.function = this.getElementFunctionFallback(n.element);
    }
    this.debug("info", "Function determination complete");
  }
  getElementFunction(e) {
    const t = e.getAttribute("data-gofakeit"), s = this.getElementType(e);
    return t && t !== "true" ? t : t === "true" ? this.elementTypeNeedsSearch(s) ? null : this.getElementFunctionFallback(e) : this.elementTypeNeedsSearch(s) ? null : this.getElementFunctionFallback(e);
  }
  elementTypeNeedsSearch(e) {
    return ![
      "checkbox",
      "radio",
      "select",
      "number",
      "range",
      "file",
      "button",
      "submit",
      "reset",
      "image",
      "week",
      "date",
      "time",
      "datetime-local",
      "month",
      "color"
    ].includes(e);
  }
  // If the element doesnt have a function and search doesnt return a function,
  // we will use a fallback function
  getElementFunctionFallback(e) {
    if (e instanceof HTMLInputElement)
      switch (e.type.toLowerCase()) {
        case "date":
        case "datetime-local":
        case "month":
        case "week": {
          const s = e.getAttribute("min"), n = e.getAttribute("max");
          return s || n ? "daterange" : "date";
        }
        case "time":
          return "time";
        case "text":
          return "word";
        case "email":
          return "email";
        case "tel":
          return "phone";
        case "url":
          return "url";
        case "password":
          return "password";
        case "search":
          return "word";
        case "number":
        case "range": {
          const s = e.getAttribute("min"), n = e.getAttribute("max");
          return "number";
        }
        case "color":
          return "hexcolor";
        case "checkbox":
          return "bool";
        case "radio":
          return "randomstring";
        default:
          return "word";
      }
    else {
      if (e instanceof HTMLTextAreaElement)
        return "sentence";
      if (e instanceof HTMLSelectElement)
        return "randomstring";
    }
    return "word";
  }
  // ============================================================================
  // Step 3: Get values for all elements via multi-function API
  // ============================================================================
  // Get values for all elements via multi-function API
  async getElementValues() {
    this.debug("info", "Starting value generation...");
    const e = this.state.elements.filter(
      (o) => o.function && !o.error
    );
    if (e.length === 0) {
      this.debug("info", "No elements need value generation");
      return;
    }
    this.debug(
      "info",
      `Getting values for ${e.length} elements from API`
    );
    const t = [], s = [], n = [];
    for (const o of e) {
      if (o.type === "radio" && o.name && s.includes(o.name))
        continue;
      const i = {
        id: o.id,
        func: o.function
      };
      switch (o.type) {
        case "select":
          i.params = this.paramsSelect(o.element);
          break;
        case "radio": {
          const c = e.filter(
            (l) => l.type === "radio" && l.name === o.name
          );
          i.params = this.paramsRadio(c), o.name && s.push(o.name);
          break;
        }
        case "date":
        case "datetime-local":
        case "month": {
          const c = this.paramsDate(o);
          c && (c.startdate || c.enddate) && (i.func = "daterange"), i.params = c;
          break;
        }
        case "time": {
          i.params = { format: "HH:mm" };
          break;
        }
        case "week": {
          const c = this.paramsWeek(o);
          c && (c.startdate || c.enddate) ? (i.func = "daterange", i.params = c) : (i.func = "date", i.params = c);
          break;
        }
        case "number":
        case "range": {
          const c = this.paramsNumber(o);
          i.params = c;
          break;
        }
      }
      t.push(i), n.push(o);
    }
    const a = await A(t);
    if (a.success && a.data)
      for (let o = 0; o < a.data.length; o++) {
        const i = a.data[o], c = n[o];
        i.value !== null && i.value !== void 0 ? c.value = String(i.value) : i.error ? c.error = i.error : c.error = "Unknown API error";
      }
    else
      for (const o of e)
        o.error = a.error || "API request failed";
    this.debug("info", "Value generation complete");
  }
  // ============================================================================
  // Step 4: Set values to the actual form elements
  // ============================================================================
  // Set values to the actual form elements
  async setElementValues() {
    if (this.debug("info", "Starting value application..."), this.state.elements.length === 0) {
      this.debug("info", "No elements to apply values to");
      return;
    }
    this.debug("info", `Processing ${this.state.elements.length} elements`);
    const e = [];
    for (let t = 0; t < this.state.elements.length; t++) {
      const s = this.state.elements[t];
      let n = null;
      switch (s.type) {
        case "radio":
          s.name && !e.includes(s.name) && (e.push(s.name), n = this.setRadioGroup(s));
          break;
        default:
          s.value !== void 0 && s.value !== null && !s.error && this.setElementValue(s), n = s;
          break;
      }
      this.settings.badges && this.settings.badges > 0 && n && this.showBadge(n), this.settings.stagger && this.settings.stagger > 0 && t < this.state.elements.length - 1 && await new Promise(
        (a) => setTimeout(a, this.settings.stagger)
      );
    }
    this.debug("info", "Value application complete");
  }
  setRadioGroup(e) {
    const s = this.state.elements.filter(
      (n) => n.type === "radio" && n.name === e.name
    ).find((n) => {
      const a = n.element;
      if ((a.hasAttribute("value") || a.value !== "on") && a.value === e.value)
        return !0;
      const i = document.querySelector(`label[for="${a.id}"]`);
      return !!(i && i.textContent && i.textContent.trim() === e.value || a.id === e.value);
    });
    if (s && !s.error) {
      const n = s.element.name;
      return n && document.querySelectorAll(
        `input[type="radio"][name="${n}"]`
      ).forEach((o) => {
        o.checked = !1;
      }), s.element.checked = !0, s.element.dispatchEvent(
        new Event("change", { bubbles: !0 })
      ), s;
    } else if (e.error)
      return e;
    return null;
  }
  setElementValue(e) {
    const t = e.element;
    if (t instanceof HTMLInputElement)
      switch (t.type.toLowerCase()) {
        case "checkbox":
          this.setCheckboxValue(t, e.value);
          break;
        case "radio":
          this.setRadioValue(t, e.value);
          break;
        case "number":
        case "range":
        case "date":
        case "time":
        case "datetime-local":
        case "month":
        case "color":
          this.setGeneralValue(t, e.value);
          break;
        case "week":
          this.setGeneralValue(t, this.convertDateToWeek(e.value));
          break;
        default:
          this.setGeneralValue(t, e.value);
      }
    else t instanceof HTMLTextAreaElement ? this.setGeneralValue(t, e.value) : t instanceof HTMLSelectElement && this.setSelectValue(t, e.value);
  }
  // ============================================================================
  // ELEMENT TYPE SPECIFIC FUNCTIONS
  // ============================================================================
  setGeneralValue(e, t) {
    e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  setCheckboxValue(e, t) {
    const s = t === "true" || t === !0;
    e.checked = s, e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  setRadioValue(e, t) {
    if (t === "true" || t === !0) {
      const n = e.name;
      n && document.querySelectorAll(
        `input[type="radio"][name="${n}"]`
      ).forEach((o) => {
        o !== e && (o.checked = !1);
      }), e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 }));
    } else
      e.checked = !1, e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  setSelectValue(e, t) {
    if (Array.from(e.options).find(
      (o) => o.value === t
    )) {
      e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 }));
      return;
    }
    const n = Array.from(e.options).find(
      (o) => o.textContent?.toLowerCase().includes(t.toLowerCase())
    );
    if (n) {
      e.value = n.value, e.dispatchEvent(new Event("change", { bubbles: !0 }));
      return;
    }
    const a = Array.from(e.options).filter(
      (o) => o.value && o.value.trim() !== ""
    );
    if (a.length > 0) {
      const o = a[Math.floor(Math.random() * a.length)];
      e.value = o.value, e.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }
  showBadge(e) {
    this.removeBadge(e.id);
    const t = document.createElement("div");
    t.id = `gofakeit-badge-${e.id}`;
    const s = !!(e.error && e.error.trim() !== "");
    t.textContent = s ? e.error : e.function;
    const n = {
      position: "fixed",
      zIndex: "999999",
      padding: `${T.quarter}px ${T.half}px`,
      borderRadius: `${N.radius}px`,
      fontSize: `${x.size}px`,
      fontWeight: "bold",
      fontFamily: x.family,
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      pointerEvents: "none",
      userSelect: "none",
      transition: "opacity 0.3s ease-in-out",
      opacity: "0",
      whiteSpace: "nowrap",
      backgroundColor: s ? E.error : E.primary,
      color: s ? E.white : E.text
    };
    Object.assign(t.style, n), document.body.appendChild(t);
    let a = null, o = null, i = !0, c = 0;
    const l = 100, p = this.getScrollableParents(e.element), d = /* @__PURE__ */ new Map(), v = (g) => {
      const h = g.getBoundingClientRect();
      if (h.top < 0 || h.left < 0 || h.bottom > window.innerHeight || h.right > window.innerWidth)
        return !1;
      for (const u of p) {
        let f = d.get(u);
        if (f || (f = u.getBoundingClientRect(), d.set(u, f)), h.top < f.top || h.left < f.left || h.bottom > f.bottom || h.right > f.right)
          return !1;
      }
      return !0;
    }, b = () => {
      const g = e.element.getBoundingClientRect();
      if (!a || g.top !== a.top || g.left !== a.left || g.width !== a.width || g.height !== a.height) {
        a = g;
        const u = performance.now();
        if (u - c > l && (i = v(e.element), c = u, d.clear()), i) {
          const f = g.top - 30, I = g.left;
          t.style.cssText += `top:${f}px;left:${I}px;display:block;`;
        } else
          t.style.display = "none";
      }
      o = requestAnimationFrame(b);
    };
    b(), t._animationId = o, requestAnimationFrame(() => {
      t.style.opacity = "1";
    }), setTimeout(() => {
      this.removeBadge(e.id);
    }, this.settings.badges);
  }
  // Helper method to cache scrollable parents
  getScrollableParents(e) {
    const t = [];
    let s = e.parentElement;
    for (; s && s !== document.body; ) {
      const n = getComputedStyle(s), a = n.overflow + n.overflowY + n.overflowX;
      (a.includes("scroll") || a.includes("auto")) && t.push(s), s = s.parentElement;
    }
    return t;
  }
  removeBadge(e) {
    const t = document.getElementById(
      `gofakeit-badge-${e}`
    );
    if (!t)
      return;
    const s = t._animationId;
    s && (cancelAnimationFrame(s), t._animationId = null), t.style.opacity = "0", setTimeout(() => {
      t.parentNode && t.remove();
    }, 300);
  }
  // ============================================================================
  // PARAMETER GENERATION FUNCTIONS
  // ============================================================================
  paramsSelect(e) {
    const t = Array.from(e.options).map((s) => s.value).filter((s) => s !== "");
    if (t.length > 0)
      return {
        strs: t
      };
  }
  paramsRadio(e) {
    const t = e.map((s) => {
      const n = s.element;
      if (n.hasAttribute("value") || n.value && n.value.trim() !== "" && n.value !== "on")
        return n.value;
      const o = document.querySelector(`label[for="${n.id}"]`);
      return o && o.textContent ? o.textContent.trim() : n.id;
    }).filter((s) => s !== "");
    if (t.length > 0)
      return {
        strs: t
      };
  }
  convertDateToWeek(e) {
    try {
      const t = /* @__PURE__ */ new Date(e + "T00:00:00"), s = t.getFullYear(), n = new Date(s, 0, 1), a = Math.floor(
        (t.getTime() - n.getTime()) / (1440 * 60 * 1e3)
      ), o = Math.ceil((a + n.getDay() + 1) / 7);
      return `${s}-W${o.toString().padStart(2, "0")}`;
    } catch {
      return `${(/* @__PURE__ */ new Date()).getFullYear()}-W01`;
    }
  }
  convertWeekToDate(e) {
    try {
      const t = e.match(/^(\d{4})-W(\d{2})$/);
      if (!t)
        throw new Error("Invalid week format");
      const s = parseInt(t[1]), n = parseInt(t[2]), a = new Date(s, 0, 1), o = (n - 1) * 7, i = new Date(
        a.getTime() + o * 24 * 60 * 60 * 1e3
      ), c = (i.getMonth() + 1).toString().padStart(2, "0"), l = i.getDate().toString().padStart(2, "0");
      return `${s}-${c}-${l}`;
    } catch {
      return `${(/* @__PURE__ */ new Date()).getFullYear()}-01-01`;
    }
  }
  paramsDate(e) {
    const t = e.element, s = t.getAttribute("min"), n = t.getAttribute("max");
    let a;
    switch (e.type) {
      case "datetime-local":
        a = "yyyy-MM-ddTHH:mm";
        break;
      case "month":
        a = "yyyy-MM";
        break;
      case "date":
      default:
        a = "yyyy-MM-dd";
        break;
    }
    const o = {
      format: a
    };
    return !s && !n || (s && (o.startdate = s), n && (o.enddate = n)), o;
  }
  paramsWeek(e) {
    const t = e.element, s = t.getAttribute("min"), n = t.getAttribute("max"), a = {
      format: "yyyy-MM-dd"
      // Week inputs use date format for API calls
    };
    return s && (a.startdate = this.convertWeekToDate(s)), n && (a.enddate = this.convertWeekToDate(n)), a;
  }
  paramsNumber(e) {
    const t = e.element, s = t.getAttribute("min"), n = t.getAttribute("max"), a = {};
    return s && (a.min = parseInt(s, 10)), n && (a.max = parseInt(n, 10)), a;
  }
  // ============================================================================
  // MISC UTILITY FUNCTIONS
  // ============================================================================
  // Debug logging function controlled by settings.debug
  debug(e, t) {
    if (this.settings.debug) {
      const s = `[Gofakeit] ${e.toUpperCase()}:`;
      switch (e) {
        case "error":
          console.error(s, t);
          break;
        case "warning":
          console.warn(s, t);
          break;
        case "info":
        default:
          console.log(s, t);
          break;
      }
    }
  }
  // Reset state to initial values - useful for testing
  resetState() {
    this.state = {
      status: "idle",
      elements: []
    };
  }
  // Update status and trigger callback
  updateStatus(e) {
    if (this.state.status = e, this.settings.onStatusChange) {
      const t = { ...this.state, elements: [...this.state.elements] };
      this.settings.onStatusChange(e, t);
    }
  }
  results() {
    const e = this.state.elements.filter(
      (n) => n.value && !n.error
    ), t = this.state.elements.filter((n) => n.error), s = {
      success: e.length,
      failed: t.length,
      elements: this.state.elements
    };
    return this.debug("info", `
🎯 Autofill Results Summary:`), this.debug("info", `   Total elements: ${this.state.elements.length}`), this.debug("info", `   Successful: ${e.length}`), this.debug("info", `   Failed: ${t.length}`), e.length > 0 && t.length === 0 ? this.debug(
      "warning",
      `Successfully generated data for ${e.length} fields!`
    ) : e.length > 0 && t.length > 0 ? this.debug(
      "warning",
      `Generated data for ${e.length} fields, ${t.length} failed`
    ) : t.length > 0 ? this.debug(
      "error",
      `Failed to generate data for ${t.length} fields`
    ) : this.debug("warning", "No fields were processed"), s;
  }
}
function F() {
  const r = document.getElementById("sidebar"), e = document.getElementById("sidebarToggle"), t = document.getElementById("sidebarOverlay");
  function s() {
    r.classList.add("open"), t.classList.add("active"), e.classList.add("active"), document.body.style.overflow = "hidden";
  }
  function n() {
    r.classList.remove("open"), t.classList.remove("active"), e.classList.remove("active"), document.body.style.overflow = "";
  }
  e && e.addEventListener("click", () => {
    r.classList.contains("open") ? n() : s();
  }), t && t.addEventListener("click", n), document.addEventListener("keydown", (i) => {
    i.key === "Escape" && r.classList.contains("open") && n();
  });
  function a() {
    window.innerWidth <= 768 && s();
  }
  document.querySelectorAll(
    'button[onclick*="autofill"]'
  ).forEach((i) => {
    i.addEventListener("click", a);
  });
}
document.addEventListener("DOMContentLoaded", F);
function w(r, e = 0) {
  if (!r)
    return;
  if (window.innerWidth <= 768) {
    const s = document.querySelector(".mobile-header"), o = (s ? s.offsetHeight : 60) + 16, i = r.style.scrollMarginTop;
    r.style.scrollMarginTop = o + "px", r.scrollIntoView({
      behavior: "smooth",
      block: "start"
    }), setTimeout(() => {
      r.style.scrollMarginTop = i;
    }, 500);
  } else
    r.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}
window.autofill = async (r) => {
  try {
    const e = S();
    if (r)
      if (typeof r == "string") {
        const t = document.querySelector(r);
        t ? (w(t), setTimeout(async () => {
          await new y(e).fill(r), m(
            `✅ ${r} section filled successfully!`,
            "success"
          );
        }, 500)) : m("❌ Element not found: " + r, "error");
      } else
        await new y(e).fill(r), m("✅ Element filled successfully!", "success");
    else
      await new y(e).fill(void 0), m("✅ All fields filled successfully!", "success");
  } catch (e) {
    m("❌ Error filling fields: " + e.message, "error");
  }
};
window.handleCategorySelection = async () => {
  const r = document.getElementById("categorySelector"), e = r.value;
  if (e)
    try {
      const s = {
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
      }[e];
      let n = null;
      if (s) {
        const a = document.querySelectorAll("h4");
        for (const o of a)
          if (o.textContent?.includes(s)) {
            n = o;
            break;
          }
      }
      if (n)
        w(n);
      else {
        const a = document.getElementById("categories");
        a && w(a);
      }
      setTimeout(async () => {
        const a = document.getElementById(e);
        if (!a) {
          m("❌ Category container not found!", "error");
          return;
        }
        try {
          const o = S();
          await new y(o).fill(a);
          let c = 0;
          a.querySelectorAll(
            "input, textarea, select"
          ).forEach((d) => {
            d instanceof HTMLInputElement ? d.type === "checkbox" || d.type === "radio" ? d.checked && c++ : d.value && c++ : (d instanceof HTMLTextAreaElement || d instanceof HTMLSelectElement) && d.value && c++;
          });
          const p = r.options[r.selectedIndex].text;
          m(
            `✅ ${p} filled successfully! (${c} fields)`,
            "success"
          );
        } catch (o) {
          console.warn("Failed to fill category:", o), m(
            "❌ Error filling category: " + o.message,
            "error"
          );
        }
        r.value = "";
      }, 500);
    } catch (t) {
      m("❌ Error filling category: " + t.message, "error"), r.value = "";
    }
};
function S() {
  const r = document.querySelector('input[name="mode"]:checked').value, e = parseInt(document.getElementById("stagger").value), t = parseInt(document.getElementById("badges").value), s = document.getElementById("debugMode").checked;
  return {
    mode: r,
    stagger: e,
    badges: t,
    debug: s,
    onStatusChange: (n, a) => {
      if (s) {
        const i = (/* @__PURE__ */ new Date()).toLocaleTimeString();
        console.log(
          `%c[Status ${i}] ${n === "error" ? "❌" : n === "idle" ? "⏸️" : "🔄"} ${n.toUpperCase()}:`,
          "color: #9c27b0; font-weight: bold; background: #f3e5f5; padding: 2px 4px; border-radius: 3px;",
          a
        );
      }
      if (n === L.STARTING) {
        const i = document.getElementById("sidebar"), c = document.getElementById("sidebarOverlay"), l = document.getElementById("sidebarToggle");
        i && i.classList.contains("open") && (i.classList.remove("open"), c && c.classList.remove("active"), l && l.classList.remove("active"), document.body.style.overflow = "");
      }
      const o = document.getElementById("status");
      if (o) {
        const i = {
          idle: "Ready",
          starting: "Starting...",
          initializing: "Initializing inputs...",
          determining_functions: "Determining functions...",
          getting_values: "Getting values...",
          setting_values: "Setting values...",
          completed: "Completed!",
          error: "Error occurred"
        }[n] || n;
        o.textContent = i, o.className = `status ${n}`;
      }
      if (n === "getting_values" || n === "setting_values") {
        const i = a.elements.filter(
          (l) => l.value || l.error
        ).length, c = a.elements.length;
        c > 0 && m(
          `Processing ${i}/${c} fields...`,
          "info"
        );
      }
    }
  };
}
window.autofillWithCurrentSettings = async () => {
  try {
    const r = S();
    await new y(r).fill(void 0);
    const t = r.mode === "auto" ? "Auto Mode" : "Manual Mode", s = r.stagger > 0 ? ` (${r.stagger}ms stagger)` : " (no stagger)";
    m(
      `✅ All fields filled with ${t}${s}!`,
      "success"
    );
  } catch (r) {
    m("❌ Error filling fields: " + r.message, "error");
  }
};
document.addEventListener("DOMContentLoaded", function() {
  const r = document.getElementById("stagger"), e = document.getElementById("staggerValue"), t = document.getElementById("badges"), s = document.getElementById("badgesValue"), n = document.getElementById("themeToggle"), a = n.querySelector(".theme-icon");
  if (r && e && r.addEventListener("input", function() {
    e.textContent = this.value + "ms";
  }), t && s && t.addEventListener("input", function() {
    s.textContent = this.value + "ms";
  }), n) {
    const o = localStorage.getItem("theme"), i = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    o === "light" || o === null && !i ? (document.documentElement.setAttribute("data-theme", "light"), a.textContent = "🌙") : a.textContent = "☀️", n.addEventListener("click", function() {
      document.documentElement.hasAttribute("data-theme") && document.documentElement.getAttribute("data-theme") === "light" ? (document.documentElement.removeAttribute("data-theme"), localStorage.setItem("theme", "dark"), a.textContent = "☀️") : (document.documentElement.setAttribute("data-theme", "light"), localStorage.setItem("theme", "light"), a.textContent = "🌙");
    }), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(l) {
      localStorage.getItem("theme") === null && (l.matches ? (document.documentElement.removeAttribute("data-theme"), a.textContent = "☀️") : (document.documentElement.setAttribute("data-theme", "light"), a.textContent = "🌙"));
    });
  }
});
window.clearAll = () => {
  const r = document.querySelector(".main-content");
  if (!r) return;
  r.querySelectorAll("input, textarea, select").forEach((t) => {
    t.type === "checkbox" || t.type === "radio" ? t.checked = !1 : t.value = "";
  }), m("🧹 All fields cleared!", "success");
};
window.clearBadges = () => {
  document.querySelectorAll(
    '[data-gofakeit-badge="true"]'
  ).forEach((e) => e.remove()), m("🎯 All badges cleared!", "success");
};
function m(r, e) {
  const t = document.getElementById("status");
  t.textContent = r, t.className = `status ${e}`;
}
console.log("🎯 Gofakeit Fill Comprehensive Testing loaded!");
console.log(
  "This page tests the search API with various input contexts and categories."
);
console.log(
  "Check the browser network tab to see search API calls in action!"
);
console.log(
  "New features: Badge system, debug mode, and improved error handling!"
);
//# sourceMappingURL=gofakeit.es.js.map
