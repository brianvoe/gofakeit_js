(function() {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver((s) => {
    for (const o of s)
      if (o.type === "childList")
        for (const r of o.addedNodes) r.tagName === "LINK" && r.rel === "modulepreload" && n(r);
  }).observe(document, {
    childList: !0,
    subtree: !0
  });
  function t(s) {
    const o = {};
    return s.integrity && (o.integrity = s.integrity), s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? o.credentials = "include" : s.crossOrigin === "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o;
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const o = t(s);
    fetch(s.href, o);
  }
})();
const y = "https://api.gofakeit.com/funcs";
async function E(a) {
  if (a.length === 0)
    return {
      success: !1,
      error: "No functions provided"
    };
  const e = a.map((t, n) => {
    const { func: s, id: o } = t, r = s.indexOf("?");
    if (r !== -1) {
      const i = s.substring(0, r), c = s.substring(r + 1), d = {}, f = new URLSearchParams(c);
      for (const [l, m] of f.entries()) {
        const p = parseFloat(m);
        d[l] = isNaN(p) ? m : p;
      }
      return {
        id: o || `req_${n}`,
        func: i,
        params: d
      };
    } else
      return {
        id: o || `req_${n}`,
        func: s,
        params: t.params
      };
  });
  return w("POST", `${y}/multi`, e);
}
async function b(a) {
  return a.length === 0 ? {
    success: !1,
    error: "No search queries provided"
  } : T("POST", `${y}/search`, a);
}
async function w(a, e, t) {
  try {
    const n = {
      method: a,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(t)
    }, s = await fetch(e, n);
    return s.ok ? {
      success: !0,
      data: await s.json()
    } : {
      success: !1,
      error: `HTTP error! status: ${s.status}`,
      status: s.status
    };
  } catch (n) {
    return console.error(`[Gofakeit Autofill] Error in ${a} request to ${e}:`, n), {
      success: !1,
      error: n instanceof Error ? n.message : "Unknown error"
    };
  }
}
async function T(a, e, t) {
  try {
    const n = {
      method: a,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(t)
    }, s = await fetch(e, n);
    return s.ok ? {
      success: !0,
      data: await s.json()
    } : {
      success: !1,
      error: `HTTP error! status: ${s.status}`,
      status: s.status
    };
  } catch (n) {
    return console.error(`[Gofakeit Autofill] Error in ${a} request to ${e}:`, n), {
      success: !1,
      error: n instanceof Error ? n.message : "Unknown error"
    };
  }
}
class h {
  settings;
  state;
  constructor(e = {}) {
    this.settings = {
      mode: "auto",
      staggered: !0,
      staggerDelay: 50,
      ...e
    }, this.state = {
      status: "idle",
      inputs: []
    };
  }
  // Update status and trigger callback
  updateStatus(e) {
    if (this.state.status = e, this.settings.onStatusChange) {
      const t = { ...this.state, inputs: [...this.state.inputs] };
      this.settings.onStatusChange(e, t);
    }
  }
  // Public API methods
  async autofill(e) {
    this.updateStatus("starting"), this.state.inputs = [];
    const t = this.getElements(e);
    if (t.error)
      return console.warn(`[Gofakeit] ${t.error}`), this.showNotification(t.error, "error"), this.updateStatus("error"), !1;
    if (t.elements.length === 0)
      return this.showNotification("No form fields found to autofill", "info"), this.state.status !== "error" && this.updateStatus("idle"), !1;
    const n = t.elements;
    console.log(`[Gofakeit] Found ${n.length} elements to generate data for`), this.showNotification(`Starting data generation for ${n.length} fields...`, "info");
    try {
      return await this.initializeInputs(n), this.updateStatus("initializing"), await this.determineFunctions(), this.updateStatus("determining_functions"), await this.getValues(), this.updateStatus("getting_values"), await this.applyValues(), this.updateStatus("applying_values"), this.updateStatus("completed"), !0;
    } catch (s) {
      return console.error("[Gofakeit] Autofill process failed:", s), this.updateStatus("error"), !1;
    }
  }
  // Public method to get form elements based on target parameter
  getElements(e) {
    if (!e)
      return { elements: this.queryFormElements() };
    if (typeof e == "string") {
      const t = document.querySelectorAll(e);
      if (t.length === 0)
        return {
          elements: [],
          error: `No element found with selector: "${e}"`
        };
      if (t.length === 1) {
        const s = t[0];
        return (s.tagName === "INPUT" || s.tagName === "TEXTAREA" || s.tagName === "SELECT") && s.hasAttribute("data-gofakeit") ? { elements: [s] } : s.querySelectorAll("input, textarea, select").length > 0 ? { elements: this.queryFormElements(s) } : { elements: [] };
      }
      const n = [];
      return t.forEach((s) => {
        const o = s;
        (o.tagName === "INPUT" || o.tagName === "TEXTAREA" || o.tagName === "SELECT") && o.hasAttribute("data-gofakeit") ? n.push(s) : o.querySelectorAll("input, textarea, select").length > 0 && n.push(...this.queryFormElements(o));
      }), { elements: n };
    }
    if (e instanceof HTMLElement) {
      if ((e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.tagName === "SELECT") && e.hasAttribute("data-gofakeit"))
        return { elements: [e] };
      if (e.querySelectorAll("input, textarea, select").length > 0)
        return { elements: this.queryFormElements(e) };
      const n = this.findFormContainer(e);
      return n ? { elements: this.queryFormElements(n) } : {
        elements: [],
        error: "Element is not a form field and does not contain form fields"
      };
    }
    if (e instanceof Element) {
      const t = e;
      if ((t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT") && t.hasAttribute("data-gofakeit"))
        return { elements: [e] };
      if (t.querySelectorAll("input, textarea, select").length > 0)
        return { elements: this.queryFormElements(t) };
      const s = this.findFormContainer(e);
      return s ? { elements: this.queryFormElements(s) } : {
        elements: [],
        error: "Element is not a form field and does not contain form fields"
      };
    }
    return { elements: [] };
  }
  resetState() {
    this.state = {
      status: "idle",
      inputs: []
    };
  }
  // ============================================================================
  // PROCESSING FUNCTIONS (Called by main functions)
  // ============================================================================
  // Query all form elements that can be autofilled
  queryFormElements(e) {
    const t = "input, textarea, select", n = e ? e.querySelectorAll(t) : document.querySelectorAll(t), s = [];
    return n.forEach((o) => {
      if (o instanceof HTMLInputElement) {
        if (o.type === "hidden" || o.disabled || o.readOnly) return;
        s.push(o);
      } else if (o instanceof HTMLTextAreaElement) {
        if (o.disabled || o.readOnly) return;
        s.push(o);
      } else if (o instanceof HTMLSelectElement) {
        if (o.disabled) return;
        s.push(o);
      }
    }), s;
  }
  // Get unique elements, handling checkbox and radio groups
  getUniqueElements(e) {
    const t = [], n = /* @__PURE__ */ new Set();
    for (const s of e) {
      if (s instanceof HTMLInputElement) {
        const o = s.type.toLowerCase();
        if (o === "checkbox" || o === "radio") {
          const r = s.name;
          if (r && n.has(r))
            continue;
          r && n.add(r);
        }
      }
      t.push(s);
    }
    return t;
  }
  // ============================================================================
  // NEW STEP-BY-STEP AUTOFILL PROCESS
  // ============================================================================
  // Step 1: Initialize inputs array with all target elements
  async initializeInputs(e) {
    const t = this.getUniqueElements(e);
    for (const n of t) {
      const s = n.getAttribute("data-gofakeit"), o = this.settings.mode ?? "auto";
      if (typeof s == "string" && s.trim().toLowerCase() === "false" || !s && o === "manual")
        continue;
      let r = "unknown";
      n instanceof HTMLInputElement ? r = n.type.toLowerCase() : n instanceof HTMLTextAreaElement ? r = "textarea" : n instanceof HTMLSelectElement && (r = "select");
      let i = "";
      s && s !== "true" ? i = s : s === "true" ? i = this.getInputTypeFunction(n, s) : i = "";
      const c = {
        element: n,
        type: r,
        function: i,
        value: "",
        error: ""
      };
      this.state.inputs.push(c);
    }
    console.log(`[Gofakeit] Initialized ${this.state.inputs.length} inputs`);
  }
  // Step 2: Determine functions for inputs that need search
  async determineFunctions() {
    const e = this.state.inputs.filter(
      (n) => !n.function && this.needsSearchApi(n.type)
    );
    if (e.length === 0) {
      console.log("[Gofakeit] No inputs need function search");
      return;
    }
    console.log(`[Gofakeit] Determining functions for ${e.length} inputs`);
    const t = e.map((n, s) => {
      const o = n.element, r = this.createSearchQuery(o);
      return {
        id: n.element.id || n.element.getAttribute("name") || `input_${s}`,
        query: r
      };
    });
    try {
      const n = await b(t);
      if (n.success && n.data)
        for (let s = 0; s < n.data.length; s++) {
          const o = n.data[s], r = e[s];
          if (o.results && o.results.length > 0) {
            const i = o.results[0];
            i.score >= 100 ? r.function = i.name : r.function = this.getTypeSpecificFallback(r.type);
          } else
            r.function = this.getTypeSpecificFallback(r.type);
        }
      else
        for (const s of e)
          s.function = this.getDefaultFunctionForInputType(s.type);
    } catch (n) {
      console.warn("[Gofakeit] Function search failed, using fallback functions:", n);
      for (const s of e)
        s.function = this.getDefaultFunctionForInputType(s.type);
    }
    console.log("[Gofakeit] Function determination complete");
  }
  // Step 3: Get values for all inputs via multi-function API
  async getValues() {
    const e = this.state.inputs.filter(
      (s) => s.function && !s.error
    );
    if (e.length === 0) {
      console.log("[Gofakeit] No inputs need value generation");
      return;
    }
    console.log(`[Gofakeit] Getting values for ${e.length} inputs`);
    const t = [], n = [];
    for (const s of e)
      this.isLocalGenerationFunction(s.function) ? n.push(s) : t.push(s);
    for (const s of n)
      try {
        s.value = this.generateLocalValue(s.function);
      } catch (o) {
        s.error = String(o);
      }
    if (t.length > 0) {
      const s = t.map((o, r) => ({
        id: `req_${r}`,
        func: o.function
      }));
      try {
        const o = await E(s);
        if (o.success && o.data)
          for (let r = 0; r < o.data.length; r++) {
            const i = o.data[r], c = t[r];
            i && i.error ? c.error = i.error : i && i.value !== null ? c.value = i.value : c.error = "No valid response received";
          }
        else
          for (const r of t)
            r.error = o.error || "Batch API call failed";
      } catch (o) {
        console.error("[Gofakeit] Batch API call failed:", o);
        for (const r of t)
          r.error = String(o);
      }
    }
    console.log("[Gofakeit] Value generation complete");
  }
  // Check if a function is a local generation function
  isLocalGenerationFunction(e) {
    return ["generateTime", "generateMonth", "generateWeek", "generateDate", "generateDateTime"].includes(e);
  }
  // Generate local values for date/time functions
  generateLocalValue(e) {
    switch (e) {
      case "generateTime":
        return this.generateTime();
      case "generateMonth":
        return this.generateMonth();
      case "generateWeek":
        return this.generateWeek();
      case "generateDate":
        return this.generateDate();
      case "generateDateTime":
        return this.generateDateTime();
      default:
        throw new Error(`Unknown local generation function: ${e}`);
    }
  }
  // Step 4: Apply values to the actual form elements
  async applyValues() {
    const e = this.state.inputs.filter(
      (o) => o.value !== void 0 && o.value !== null && !o.error
    );
    if (e.length === 0) {
      console.log("[Gofakeit] No values to apply");
      return;
    }
    console.log(`[Gofakeit] Applying values to ${e.length} inputs`);
    const n = globalThis.__GOFAKEIT_TEST_MODE__ ? !1 : this.settings.staggered ?? !0, s = this.settings.staggerDelay ?? 50;
    for (let o = 0; o < e.length; o++) {
      const r = e[o];
      n && o > 0 && await new Promise((i) => setTimeout(i, s));
      try {
        await this.applyValueToElement(r.element, r.function, r.value) || (r.error = "Failed to apply value to element");
      } catch (i) {
        r.error = String(i), console.warn("[Gofakeit] Failed to apply value to element:", r.element, i);
      }
    }
    this.showDetailedResults(), console.log("[Gofakeit] Value application complete");
  }
  // Helper method to apply a value to a specific element
  async applyValueToElement(e, t, n) {
    try {
      if (e instanceof HTMLSelectElement)
        return this.setSelectValue(e, n), !0;
      if (e instanceof HTMLTextAreaElement)
        return this.setTextareaValue(e, n), !0;
      if (e instanceof HTMLInputElement) {
        const s = e.type.toLowerCase();
        return s === "checkbox" ? (this.setCheckboxValue(e, n), !0) : s === "radio" ? (this.setRadioValue(e, n), !0) : s === "number" ? (this.setNumberValue(e, n), !0) : s === "range" ? (this.setRangeValue(e, n), !0) : s === "date" || s === "time" || s === "datetime-local" || s === "month" || s === "week" ? (this.setDateTimeValue(e, n), !0) : (this.setTextValue(e, n), !0);
      }
      return console.warn("[Gofakeit] Unsupported element type:", e), !1;
    } catch (s) {
      return console.error("[Gofakeit] Unexpected error applying value to element:", e, s), !1;
    }
  }
  // ============================================================================
  // UTILITY FUNCTIONS (Called by various functions)
  // ============================================================================
  // Handle error display and field highlighting
  handleError(e, t, n) {
    e instanceof HTMLElement && (e.style.border = "2px solid #dc3545", setTimeout(() => {
      e.style.border = "";
    }, 5e3)), console.warn("[Gofakeit] Error for element:", e, n ? `Invalid function: ${n}` : t);
  }
  // Extract nearby/associated label text for context
  getAssociatedLabelText(e) {
    const t = [], n = e.id, s = e.getAttribute("aria-labelledby");
    if (s && s.split(/\s+/).forEach((i) => {
      const c = document.getElementById(i);
      c && c.textContent && t.push(c.textContent);
    }), n)
      try {
        const i = document.querySelector('label[for="' + n.replace(/"/g, '\\"') + '"]');
        i && i.textContent && t.push(i.textContent);
      } catch {
      }
    const o = e.closest("label");
    o && o.textContent && t.push(o.textContent);
    const r = e.previousElementSibling;
    return r && r.tagName === "LABEL" && r.textContent && t.push(r.textContent), t.join(" ").toLowerCase();
  }
  // Determine if an input type needs search API for function detection
  needsSearchApi(e) {
    return !["checkbox", "radio", "select", "range", "file", "button", "submit", "reset", "image", "week", "date", "time", "datetime-local", "month"].includes(e);
  }
  // Get a default function for input types that don't need search API
  getDefaultFunctionForInputType(e) {
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
  // Get type-specific fallback functions for when search API doesn't find good matches
  getTypeSpecificFallback(e) {
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
        return "hexcolor";
      case "text":
      default:
        return "word";
    }
  }
  // Create a comprehensive search query from input field characteristics
  createSearchQuery(e) {
    const t = e.type.toLowerCase(), n = (e.name || "").toLowerCase(), s = (e.id || "").toLowerCase(), o = (e.placeholder || "").toLowerCase(), r = (e.autocomplete || "").toLowerCase(), i = (e.getAttribute("aria-label") || "").toLowerCase(), c = this.getAssociatedLabelText(e);
    return [
      t,
      n,
      s,
      o,
      r,
      i,
      c
    ].filter((l) => l && l.trim()).join(" ").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim() || "text input";
  }
  // Find the closest container that has form fields with data-gofakeit attributes
  findFormContainer(e) {
    if (e.querySelectorAll("input, textarea, select").length > 0)
      return e;
    let n = e.parentElement;
    for (; n; ) {
      if (n.querySelectorAll("input, textarea, select").length > 0)
        return n;
      n = n.parentElement;
    }
    return null;
  }
  // Simple notification function (can be overridden by the consuming application)
  showNotification(e, t = "info") {
    console.log(`[Gofakeit ${t.toUpperCase()}] ${e}`);
  }
  // ============================================================================
  // RESULTS DISPLAY
  // ============================================================================
  // Show detailed results using AutofillElement objects
  showDetailedResults() {
    const e = this.state.inputs.filter((n) => n.value && !n.error), t = this.state.inputs.filter((n) => n.error);
    console.log("[Gofakeit] Autofill Results Summary:"), console.log(`✅ Successful: ${e.length} fields`), console.log(`❌ Failed: ${t.length} fields`), e.length > 0 && (console.log(`
📋 Successful Fields:`), e.forEach((n, s) => {
      const o = this.getElementInfo(n.element);
      console.log(`  ${s + 1}. ${o} → ${n.function} → "${n.value}"`);
    })), t.length > 0 && (console.log(`
⚠️ Failed Fields:`), t.forEach((n, s) => {
      const o = this.getElementInfo(n.element);
      console.log(`  ${s + 1}. ${o} → ${n.function} → ERROR: ${n.error}`);
    })), e.length > 0 && t.length === 0 ? this.showNotification(`Successfully generated data for ${e.length} fields!`, "success") : e.length > 0 && t.length > 0 ? this.showNotification(`Generated data for ${e.length} fields, ${t.length} failed`, "info") : t.length > 0 ? this.showNotification(`Failed to generate data for ${t.length} fields`, "error") : this.showNotification("No fields were processed", "info");
  }
  // Get a descriptive string for an element
  getElementInfo(e) {
    let t = "";
    if (e instanceof HTMLInputElement) {
      const n = e.type || "text", s = e.name || e.id || "unnamed", o = this.getAssociatedLabelText(e);
      t = `input[type="${n}"][name="${s}"]`, o && (t += ` (${o})`);
    } else if (e instanceof HTMLTextAreaElement) {
      const n = e.name || e.id || "unnamed", s = this.getAssociatedLabelText(e);
      t = `textarea[name="${n}"]`, s && (t += ` (${s})`);
    } else if (e instanceof HTMLSelectElement) {
      const n = e.name || e.id || "unnamed", s = this.getAssociatedLabelText(e);
      t = `select[name="${n}"]`, s && (t += ` (${s})`);
    } else
      t = e.tagName.toLowerCase(), e.id && (t += `#${e.id}`), e.className && (t += `.${e.className.split(" ").join(".")}`);
    return t;
  }
  // ============================================================================
  // INPUT TYPE HANDLERS
  // ============================================================================
  // Get function name for any input type
  getInputTypeFunction(e, t) {
    if (e instanceof HTMLInputElement)
      switch (e.type.toLowerCase()) {
        case "date":
        case "time":
        case "datetime-local":
        case "month":
        case "week":
          return this.getDateTimeFunction(e, t);
        case "number":
          return this.getNumberFunction(t);
        case "range":
          return this.getNumberFunction(t);
        case "checkbox":
          return this.getCheckboxFunction(t);
        case "radio":
          return this.getRadioFunction(t);
        default:
          return this.getTextFunction(e, t);
      }
    else {
      if (e instanceof HTMLTextAreaElement)
        return this.getTextFunction(e, t);
      if (e instanceof HTMLSelectElement)
        return this.getSelectFunction(t);
    }
    return t;
  }
  // Get function name for date/time inputs
  getDateTimeFunction(e, t) {
    const n = e.type.toLowerCase();
    return n === "date" ? t === "true" ? "generateDate" : t : n === "datetime-local" ? t === "true" ? "generateDateTime" : t : n === "time" ? t === "true" ? "generateTime" : t : n === "month" ? t === "true" ? "generateMonth" : t : n === "week" && t === "true" ? "generateWeek" : t;
  }
  // Set date/time input value
  setDateTimeValue(e, t) {
    e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  // Get function name for text inputs
  getTextFunction(e, t) {
    const n = e.type.toLowerCase();
    if (t === "true")
      switch (n) {
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
  // Set text input value
  setTextValue(e, t) {
    e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  // Set textarea value
  setTextareaValue(e, t) {
    e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  // Get function name for number inputs
  getNumberFunction(e) {
    return e === "true" ? "number" : e;
  }
  // Set number input value
  setNumberValue(e, t) {
    e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  // Set range input value
  setRangeValue(e, t) {
    e.value = t, e.dispatchEvent(new Event("input", { bubbles: !0 })), e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  // Get function name for checkbox inputs
  getCheckboxFunction(e) {
    return e === "true" ? "bool" : e;
  }
  // Set checkbox value
  setCheckboxValue(e, t) {
    let n;
    typeof t == "boolean" ? n = t : n = t.toLowerCase() === "true", e.checked = n, e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  // Get function name for radio inputs
  getRadioFunction(e) {
    return e === "true" ? "bool" : e;
  }
  // Set radio value
  setRadioValue(e, t) {
    let n;
    typeof t == "boolean" ? n = t : n = t.toLowerCase() === "true";
    const s = e.name;
    if (s && document.querySelectorAll(`input[type="radio"][name="${s}"]`).forEach((i) => {
      i.checked = !1;
    }), n)
      e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 }));
    else {
      const r = e.name;
      if (r) {
        const i = document.querySelectorAll(`input[type="radio"][name="${r}"]`);
        Array.from(i).some((d) => d.checked) || (e.checked = !0, e.dispatchEvent(new Event("change", { bubbles: !0 })));
      }
    }
    const o = e.name;
    if (o) {
      const r = document.querySelectorAll(`input[type="radio"][name="${o}"]`);
      if (!Array.from(r).some((c) => c.checked) && r.length > 0) {
        const c = r[0];
        c.checked = !0, c.dispatchEvent(new Event("change", { bubbles: !0 }));
      }
    }
  }
  // Get function name for select inputs
  getSelectFunction(e) {
    return e === "true" ? "word" : e;
  }
  // Set select value
  setSelectValue(e, t) {
    const n = Array.from(e.options), s = n.find(
      (o) => o.textContent?.toLowerCase().includes(t.toLowerCase()) || o.value.toLowerCase().includes(t.toLowerCase())
    );
    if (s)
      e.value = s.value;
    else if (n.length > 0) {
      const o = n.filter((r) => r.value !== "");
      if (o.length > 0) {
        const r = Math.floor(Math.random() * o.length);
        e.value = o[r].value;
      } else
        e.selectedIndex = 0;
    }
    e.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  // ============================================================================
  // DATE/TIME GENERATION FUNCTIONS
  // ============================================================================
  // Generate time string (HH:MM format)
  generateTime() {
    const e = Math.floor(Math.random() * 24).toString().padStart(2, "0"), t = Math.floor(Math.random() * 60).toString().padStart(2, "0");
    return `${e}:${t}`;
  }
  // Generate month string (YYYY-MM format)
  generateMonth() {
    const e = Math.floor(Math.random() * 30) + 1990, t = Math.floor(Math.random() * 12) + 1;
    return `${e}-${t.toString().padStart(2, "0")}`;
  }
  // Generate week string (YYYY-W## format)
  generateWeek() {
    const e = Math.floor(Math.random() * 30) + 1990, t = Math.floor(Math.random() * 52) + 1;
    return `${e}-W${t.toString().padStart(2, "0")}`;
  }
  // Generate date string (YYYY-MM-DD format)
  generateDate() {
    const e = Math.floor(Math.random() * 30) + 1990, t = Math.floor(Math.random() * 12) + 1, n = Math.floor(Math.random() * 28) + 1;
    return `${e}-${t.toString().padStart(2, "0")}-${n.toString().padStart(2, "0")}`;
  }
  // Generate datetime-local string (YYYY-MM-DDTHH:MM format)
  generateDateTime() {
    const e = this.generateDate(), t = this.generateTime();
    return `${e}T${t}`;
  }
}
window.autofill = async (a) => {
  try {
    const e = g();
    if (a)
      if (typeof a == "string") {
        const t = document.querySelector(a);
        t ? (t.scrollIntoView({ behavior: "smooth", block: "start" }), setTimeout(async () => {
          await new h(e).autofill(a), u(
            `✅ ${a} section filled successfully!`,
            "success"
          );
        }, 500)) : u("❌ Element not found: " + a, "error");
      } else
        await new AutofillManager(e).autofill(a), u("✅ Element filled successfully!", "success");
    else
      await new AutofillManager(e).autofill(void 0), u("✅ All fields filled successfully!", "success");
  } catch (e) {
    u("❌ Error filling fields: " + e.message, "error");
  }
};
window.handleCategorySelection = async () => {
  const a = document.getElementById("categorySelector"), e = a.value;
  if (e)
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
      }[e];
      let s = null;
      if (n) {
        const o = document.querySelectorAll("h4");
        for (const r of o)
          if (r.textContent?.includes(n)) {
            s = r;
            break;
          }
      }
      if (s)
        s.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      else {
        const o = document.getElementById("categories");
        o && o.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setTimeout(async () => {
        const o = document.getElementById(e);
        if (!o) {
          u("❌ Category container not found!", "error");
          return;
        }
        try {
          const r = g();
          await new h(r).autofill(o);
          let c = 0;
          o.querySelectorAll(
            "input, textarea, select"
          ).forEach((l) => {
            l instanceof HTMLInputElement ? l.type === "checkbox" || l.type === "radio" ? l.checked && c++ : l.value && c++ : (l instanceof HTMLTextAreaElement || l instanceof HTMLSelectElement) && l.value && c++;
          });
          const f = a.options[a.selectedIndex].text;
          u(
            `✅ ${f} filled successfully! (${c} fields)`,
            "success"
          );
        } catch (r) {
          console.warn("Failed to fill category:", r), u(
            "❌ Error filling category: " + r.message,
            "error"
          );
        }
        a.value = "";
      }, 500);
    } catch (t) {
      u("❌ Error filling category: " + t.message, "error"), a.value = "";
    }
};
function g() {
  const a = document.querySelector('input[name="mode"]:checked').value, e = document.querySelector('input[name="staggered"]:checked').value === "on", t = parseInt(
    document.getElementById("staggerDelay").value
  );
  return {
    mode: a,
    staggered: e,
    staggerDelay: t,
    onStatusChange: (n, s) => {
      console.log(`[Status Update] ${n}:`, s);
      const o = document.getElementById("statusDisplay");
      if (o) {
        const r = {
          idle: "Ready",
          starting: "Starting...",
          initializing: "Initializing inputs...",
          determining_functions: "Determining functions...",
          getting_values: "Getting values...",
          applying_values: "Applying values...",
          completed: "Completed!",
          error: "Error occurred"
        }[n] || n;
        o.textContent = r, o.className = `status-badge ${n}`;
      }
      if (n === "getting_values" || n === "applying_values") {
        const r = s.inputs.filter((c) => c.value || c.error).length, i = s.inputs.length;
        i > 0 && u(`Processing ${r}/${i} fields...`, "info");
      }
    }
  };
}
window.autofillWithCurrentSettings = async () => {
  try {
    const a = g();
    await new h(a).autofill(void 0);
    const t = a.mode === "auto" ? "Auto Mode" : "Manual Mode", n = a.staggered ? ` (${a.staggerDelay}ms delay)` : " (no stagger)";
    u(
      `✅ All fields filled with ${t}${n}!`,
      "success"
    );
  } catch (a) {
    u("❌ Error filling fields: " + a.message, "error");
  }
};
document.addEventListener("DOMContentLoaded", function() {
  const a = document.getElementById("staggerDelay"), e = document.getElementById("staggerDelayValue"), t = document.getElementById("themeToggle"), n = t.querySelector(".theme-icon");
  if (a && e && a.addEventListener("input", function() {
    e.textContent = this.value;
  }), t) {
    const s = localStorage.getItem("theme"), o = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    s === "light" || s === null && !o ? (document.documentElement.setAttribute("data-theme", "light"), n.textContent = "🌙") : n.textContent = "☀️", t.addEventListener("click", function() {
      document.documentElement.hasAttribute("data-theme") && document.documentElement.getAttribute("data-theme") === "light" ? (document.documentElement.removeAttribute("data-theme"), localStorage.setItem("theme", "dark"), n.textContent = "☀️") : (document.documentElement.setAttribute("data-theme", "light"), localStorage.setItem("theme", "light"), n.textContent = "🌙");
    }), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(i) {
      localStorage.getItem("theme") === null && (i.matches ? (document.documentElement.removeAttribute("data-theme"), n.textContent = "☀️") : (document.documentElement.setAttribute("data-theme", "light"), n.textContent = "🌙"));
    });
  }
});
window.clearAll = () => {
  const a = document.querySelector(".main-content");
  if (!a) return;
  a.querySelectorAll("input, textarea, select").forEach((t) => {
    t.type === "checkbox" || t.type === "radio" ? t.checked = !1 : t.value = "";
  }), u("🧹 All fields cleared!", "success");
};
function u(a, e) {
  const t = document.getElementById("status");
  t.textContent = a, t.style.display = "block", t.className = `status ${e} show`, setTimeout(() => {
    t.classList.remove("show"), setTimeout(() => {
      t.style.display = "none";
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
