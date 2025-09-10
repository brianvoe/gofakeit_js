const E = "https://api.gofakeit.com/funcs";
async function C(c, e) {
  const { func: t, params: n } = S(c), s = { ...n, ...e || {} };
  return w("POST", `${E}/${t}`, s);
}
async function x(c) {
  if (c.length === 0)
    return {
      success: !1,
      error: "No functions provided"
    };
  const e = c.map(
    (t, n) => {
      const { func: s, id: r, params: a } = t, { func: o, params: i } = S(s), d = { ...i, ...a || {} };
      return {
        id: r || `req_${n}`,
        func: o,
        params: d
      };
    }
  );
  return w(
    "POST",
    `${E}/multi`,
    e
  );
}
async function L(c) {
  return c.length === 0 ? {
    success: !1,
    error: "No search queries provided"
  } : w(
    "POST",
    `${E}/search`,
    c
  );
}
async function w(c, e, t) {
  try {
    const n = {
      method: c,
      headers: {
        "Content-Type": "application/json"
      }
    };
    c === "POST" && t && (n.body = JSON.stringify(t));
    const s = await fetch(e, n);
    if (!s.ok)
      return {
        success: !1,
        error: `HTTP error! status: ${s.status}`,
        status: s.status
      };
    let r;
    return e.includes("/multi") || e.includes("/search") ? r = await s.json() : r = await s.text(), {
      success: !0,
      data: r
    };
  } catch (n) {
    return {
      success: !1,
      error: n instanceof Error ? n.message : "Unknown error"
    };
  }
}
function S(c) {
  const e = c.indexOf("?");
  if (e !== -1) {
    const t = c.substring(0, e), n = c.substring(e + 1), s = {}, r = new URLSearchParams(n);
    for (const [a, o] of r.entries()) {
      const i = parseFloat(o);
      s[a] = isNaN(i) ? o : i;
    }
    return { func: t, params: s };
  } else
    return { func: c, params: {} };
}
const b = {
  primary: "#ffa000",
  white: "#ffffff",
  error: "#ff3860",
  text: "#333333"
}, v = {
  // px
  half: 8,
  // px
  quarter: 4
  // px
}, A = {
  radius: 4
}, T = {
  size: 12,
  // px
  family: "Helvetica, Arial, sans-serif"
};
var I = /* @__PURE__ */ ((c) => (c.IDLE = "idle", c.STARTING = "starting", c.INITIALIZING = "initializing", c.DETERMINING_FUNCTIONS = "determining_functions", c.GETTING_VALUES = "getting_values", c.SETTING_VALUES = "setting_values", c.COMPLETED = "completed", c.ERROR = "error", c))(I || {});
class M {
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
        const a = document.querySelectorAll(e);
        if (a.length === 0) {
          this.debug("error", `No element found with selector: "${e}"`), this.updateStatus(
            "error"
            /* ERROR */
          ), this.state.elements = [];
          return;
        }
        a.forEach((o) => {
          if (o instanceof HTMLInputElement || o instanceof HTMLTextAreaElement || o instanceof HTMLSelectElement) {
            if (this.shouldSkipElement(o)) return;
            t.push(o);
          } else
            o.querySelectorAll("input, textarea, select").forEach((h) => {
              this.shouldSkipElement(h) || t.push(h);
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
          e.querySelectorAll("input, textarea, select").forEach((i) => {
            this.shouldSkipElement(i) || t.push(i);
          });
    } else
      document.querySelectorAll("input, textarea, select").forEach((i) => {
        this.shouldSkipElement(i) || t.push(i);
      });
    const n = this.settings.mode ?? "auto", s = [];
    for (const a of t) {
      const o = a.getAttribute("data-gofakeit");
      typeof o == "string" && o.trim().toLowerCase() === "false" || n === "manual" && !o || s.push(a);
    }
    const r = [];
    for (const a of s) {
      const o = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      r.push({
        id: o,
        name: a.getAttribute("name") || "",
        element: a,
        type: this.getElementType(a),
        function: "",
        search: this.getElementSearch(a),
        value: "",
        error: ""
      });
    }
    this.state.elements = r, r.length > 0 && this.debug(
      "info",
      `Found ${r.length} elements to generate data for`
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
    const t = [], n = e.id, s = e.getAttribute("aria-labelledby");
    if (s && s.split(/\s+/).forEach((l) => {
      const u = document.getElementById(l);
      u && u.textContent && t.push(u.textContent);
    }), n) {
      const l = document.querySelector(
        'label[for="' + n.replace(/"/g, '\\"') + '"]'
      );
      l && l.textContent && t.push(l.textContent);
    }
    const r = e.closest("label");
    r && r.textContent && t.push(r.textContent);
    const a = e.previousElementSibling;
    a && a.tagName === "LABEL" && a.textContent && t.push(a.textContent);
    const o = t.join(" ").toLowerCase(), i = e instanceof HTMLInputElement ? e.type.toLowerCase() : "", d = (e.getAttribute("name") || "").toLowerCase(), h = (e.id || "").toLowerCase(), p = e instanceof HTMLInputElement ? (e.placeholder || "").toLowerCase() : "", y = e instanceof HTMLInputElement ? (e.autocomplete || "").toLowerCase() : "", g = (e.getAttribute("aria-label") || "").toLowerCase();
    return [
      i,
      d,
      h,
      p,
      y,
      g,
      o
    ].filter((l) => l && l.trim()).join(" ").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
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
      const n = this.getElementFunction(t.element);
      n !== null ? t.function = n : e.push(t);
    }
    if (e.length > 0) {
      this.debug(
        "info",
        `${e.length} elements need function search`
      );
      const t = e.map((s, r) => ({
        id: s.element.id || s.element.getAttribute("name") || `input_${r}`,
        query: s.search
      })), n = await L(t);
      if (n.success && n.data)
        for (let s = 0; s < n.data.length; s++) {
          const r = n.data[s], a = e[s];
          r.results && r.results.length > 0 ? a.function = r.results[0].name : a.function = this.getElementFunctionFallback(a.element);
        }
      else
        for (const s of e)
          s.function = this.getElementFunctionFallback(s.element);
    }
    this.debug("info", "Function determination complete");
  }
  getElementFunction(e) {
    const t = e.getAttribute("data-gofakeit"), n = this.getElementType(e);
    return t && t !== "true" ? t : t === "true" ? this.elementTypeNeedsSearch(n) ? null : this.getElementFunctionFallback(e) : this.elementTypeNeedsSearch(n) ? null : this.getElementFunctionFallback(e);
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
          const n = e.getAttribute("min"), s = e.getAttribute("max");
          return n || s ? "daterange" : "date";
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
          const n = e.getAttribute("min"), s = e.getAttribute("max");
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
      (a) => a.function && !a.error
    );
    if (e.length === 0) {
      this.debug("info", "No elements need value generation");
      return;
    }
    this.debug(
      "info",
      `Getting values for ${e.length} elements from API`
    );
    const t = [], n = [], s = [];
    for (const a of e) {
      if (a.type === "radio" && a.name && n.includes(a.name))
        continue;
      const o = {
        id: a.id,
        func: a.function
      };
      switch (a.type) {
        case "select":
          o.params = this.paramsSelect(a.element);
          break;
        case "radio": {
          const i = e.filter(
            (d) => d.type === "radio" && d.name === a.name
          );
          o.params = this.paramsRadio(i), a.name && n.push(a.name);
          break;
        }
        case "date":
        case "datetime-local":
        case "month": {
          const i = this.paramsDate(a);
          i && (i.startdate || i.enddate) && (o.func = "daterange"), o.params = i;
          break;
        }
        case "time": {
          o.params = { format: "HH:mm" };
          break;
        }
        case "week": {
          const i = this.paramsWeek(a);
          i && (i.startdate || i.enddate) ? (o.func = "daterange", o.params = i) : (o.func = "date", o.params = i);
          break;
        }
        case "number":
        case "range": {
          const i = this.paramsNumber(a);
          o.params = i;
          break;
        }
      }
      t.push(o), s.push(a);
    }
    const r = await x(t);
    if (r.success && r.data)
      for (let a = 0; a < r.data.length; a++) {
        const o = r.data[a], i = s[a];
        o.value !== null && o.value !== void 0 ? i.value = String(o.value) : o.error ? i.error = o.error : i.error = "Unknown API error";
      }
    else
      for (const a of e)
        a.error = r.error || "API request failed";
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
      const n = this.state.elements[t];
      let s = null;
      switch (n.type) {
        case "radio":
          n.name && !e.includes(n.name) && (e.push(n.name), s = this.setRadioGroup(n));
          break;
        default:
          n.value !== void 0 && n.value !== null && !n.error && this.setElementValue(n), s = n;
          break;
      }
      this.settings.badges && this.settings.badges > 0 && s && this.showBadge(s), this.settings.stagger && this.settings.stagger > 0 && t < this.state.elements.length - 1 && await new Promise(
        (r) => setTimeout(r, this.settings.stagger)
      );
    }
    this.debug("info", "Value application complete");
  }
  setRadioGroup(e) {
    const n = this.state.elements.filter(
      (s) => s.type === "radio" && s.name === e.name
    ).find((s) => {
      const r = s.element;
      if ((r.hasAttribute("value") || r.value !== "on") && r.value === e.value)
        return !0;
      const o = document.querySelector(`label[for="${r.id}"]`);
      return !!(o && o.textContent && o.textContent.trim() === e.value || r.id === e.value);
    });
    if (n && !n.error) {
      const s = n.element.name;
      return s && document.querySelectorAll(
        `input[type="radio"][name="${s}"]`
      ).forEach((a) => {
        a.checked = !1;
      }), n.element.checked = !0, n.element.dispatchEvent(
        new Event("change", { bubbles: !0 })
      ), n;
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
    const n = t === "true" || t === !0;
    e.checked = n, e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  setRadioValue(e, t) {
    if (t === "true" || t === !0) {
      const s = e.name;
      s && document.querySelectorAll(
        `input[type="radio"][name="${s}"]`
      ).forEach((a) => {
        a !== e && (a.checked = !1);
      }), e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 }));
    } else
      e.checked = !1, e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  setSelectValue(e, t) {
    if (Array.from(e.options).find(
      (a) => a.value === t
    )) {
      e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 }));
      return;
    }
    const s = Array.from(e.options).find(
      (a) => a.textContent?.toLowerCase().includes(t.toLowerCase())
    );
    if (s) {
      e.value = s.value, e.dispatchEvent(new Event("change", { bubbles: !0 }));
      return;
    }
    const r = Array.from(e.options).filter(
      (a) => a.value && a.value.trim() !== ""
    );
    if (r.length > 0) {
      const a = r[Math.floor(Math.random() * r.length)];
      e.value = a.value, e.dispatchEvent(new Event("change", { bubbles: !0 }));
    }
  }
  showBadge(e) {
    this.removeBadge(e.id);
    const t = document.createElement("div");
    t.id = `gofakeit-badge-${e.id}`;
    const n = !!(e.error && e.error.trim() !== "");
    t.textContent = n ? e.error : e.function;
    const s = {
      position: "fixed",
      zIndex: "999999",
      padding: `${v.quarter}px ${v.half}px`,
      borderRadius: `${A.radius}px`,
      fontSize: `${T.size}px`,
      fontWeight: "bold",
      fontFamily: T.family,
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      pointerEvents: "none",
      userSelect: "none",
      transition: "opacity 0.3s ease-in-out",
      opacity: "0",
      whiteSpace: "nowrap",
      backgroundColor: n ? b.error : b.primary,
      color: n ? b.white : b.text
    };
    Object.assign(t.style, s), document.body.appendChild(t);
    let r = null, a = null, o = !0, i = 0;
    const d = 100, h = this.getScrollableParents(e.element), p = /* @__PURE__ */ new Map(), y = (f) => {
      const m = f.getBoundingClientRect();
      if (m.top < 0 || m.left < 0 || m.bottom > window.innerHeight || m.right > window.innerWidth)
        return !1;
      for (const l of h) {
        let u = p.get(l);
        if (u || (u = l.getBoundingClientRect(), p.set(l, u)), m.top < u.top || m.left < u.left || m.bottom > u.bottom || m.right > u.right)
          return !1;
      }
      return !0;
    }, g = () => {
      const f = e.element.getBoundingClientRect();
      if (!r || f.top !== r.top || f.left !== r.left || f.width !== r.width || f.height !== r.height) {
        r = f;
        const l = performance.now();
        if (l - i > d && (o = y(e.element), i = l, p.clear()), o) {
          const u = f.top - 30, k = f.left;
          t.style.cssText += `top:${u}px;left:${k}px;display:block;`;
        } else
          t.style.display = "none";
      }
      a = requestAnimationFrame(g);
    };
    g(), t._animationId = a, requestAnimationFrame(() => {
      t.style.opacity = "1";
    }), setTimeout(() => {
      this.removeBadge(e.id);
    }, this.settings.badges);
  }
  // Helper method to cache scrollable parents
  getScrollableParents(e) {
    const t = [];
    let n = e.parentElement;
    for (; n && n !== document.body; ) {
      const s = getComputedStyle(n), r = s.overflow + s.overflowY + s.overflowX;
      (r.includes("scroll") || r.includes("auto")) && t.push(n), n = n.parentElement;
    }
    return t;
  }
  removeBadge(e) {
    const t = document.getElementById(
      `gofakeit-badge-${e}`
    );
    if (!t)
      return;
    const n = t._animationId;
    n && (cancelAnimationFrame(n), t._animationId = null), t.style.opacity = "0", setTimeout(() => {
      t.parentNode && t.remove();
    }, 300);
  }
  // ============================================================================
  // PARAMETER GENERATION FUNCTIONS
  // ============================================================================
  paramsSelect(e) {
    const t = Array.from(e.options).map((n) => n.value).filter((n) => n !== "");
    if (t.length > 0)
      return {
        strs: t
      };
  }
  paramsRadio(e) {
    const t = e.map((n) => {
      const s = n.element;
      if (s.hasAttribute("value") || s.value && s.value.trim() !== "" && s.value !== "on")
        return s.value;
      const a = document.querySelector(`label[for="${s.id}"]`);
      return a && a.textContent ? a.textContent.trim() : s.id;
    }).filter((n) => n !== "");
    if (t.length > 0)
      return {
        strs: t
      };
  }
  convertDateToWeek(e) {
    try {
      const t = /* @__PURE__ */ new Date(e + "T00:00:00"), n = t.getFullYear(), s = new Date(n, 0, 1), r = Math.floor(
        (t.getTime() - s.getTime()) / (1440 * 60 * 1e3)
      ), a = Math.ceil((r + s.getDay() + 1) / 7);
      return `${n}-W${a.toString().padStart(2, "0")}`;
    } catch {
      return `${(/* @__PURE__ */ new Date()).getFullYear()}-W01`;
    }
  }
  convertWeekToDate(e) {
    try {
      const t = e.match(/^(\d{4})-W(\d{2})$/);
      if (!t)
        throw new Error("Invalid week format");
      const n = parseInt(t[1]), s = parseInt(t[2]), r = new Date(n, 0, 1), a = (s - 1) * 7, o = new Date(
        r.getTime() + a * 24 * 60 * 60 * 1e3
      ), i = (o.getMonth() + 1).toString().padStart(2, "0"), d = o.getDate().toString().padStart(2, "0");
      return `${n}-${i}-${d}`;
    } catch {
      return `${(/* @__PURE__ */ new Date()).getFullYear()}-01-01`;
    }
  }
  paramsDate(e) {
    const t = e.element, n = t.getAttribute("min"), s = t.getAttribute("max");
    let r;
    switch (e.type) {
      case "datetime-local":
        r = "yyyy-MM-ddTHH:mm";
        break;
      case "month":
        r = "yyyy-MM";
        break;
      case "date":
      default:
        r = "yyyy-MM-dd";
        break;
    }
    const a = {
      format: r
    };
    return !n && !s || (n && (a.startdate = n), s && (a.enddate = s)), a;
  }
  paramsWeek(e) {
    const t = e.element, n = t.getAttribute("min"), s = t.getAttribute("max"), r = {
      format: "yyyy-MM-dd"
      // Week inputs use date format for API calls
    };
    return n && (r.startdate = this.convertWeekToDate(n)), s && (r.enddate = this.convertWeekToDate(s)), r;
  }
  paramsNumber(e) {
    const t = e.element, n = t.getAttribute("min"), s = t.getAttribute("max"), r = {};
    return n && (r.min = parseInt(n, 10)), s && (r.max = parseInt(s, 10)), r;
  }
  // ============================================================================
  // MISC UTILITY FUNCTIONS
  // ============================================================================
  // Debug logging function controlled by settings.debug
  debug(e, t) {
    if (this.settings.debug) {
      const n = `[Gofakeit] ${e.toUpperCase()}:`;
      switch (e) {
        case "error":
          console.error(n, t);
          break;
        case "warning":
          console.warn(n, t);
          break;
        case "info":
        default:
          console.log(n, t);
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
      (s) => s.value && !s.error
    ), t = this.state.elements.filter((s) => s.error), n = {
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
    ) : this.debug("warning", "No fields were processed"), n;
  }
}
export {
  M as Autofill,
  I as AutofillStatus,
  C as fetchFunc,
  x as fetchFuncMulti,
  L as fetchFuncSearch
};
//# sourceMappingURL=index.js.map
