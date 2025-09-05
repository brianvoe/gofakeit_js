import { GOFAKEIT_COLORS } from './styles';
import { handleDateTimeInput } from './input-datetime';
import { handleTextInput, handleTextarea, getTextarea, setTextInput, setTextarea } from './input-text';
import { handleCheckbox, handleRadio, handleSelectWithFunction } from './input-misc';
import { handleNumberInput, handleRangeInput, getRangeInput, setNumberInput, setRangeInput } from './input-number';
import { callMultiFunc, MultiFuncRequest, searchMultiFunc, FuncSearchRequest } from './api';

// Settings interface for autofill configuration
export interface AutofillSettings {
  smart?: boolean;
  staggered?: boolean;
  staggerDelay?: number;
}

// ============================================================================
// MAIN PUBLIC FUNCTIONS (Entry Points)
// ============================================================================

// Unified autofill function that handles all cases
export async function autofill(target?: HTMLElement | Element, settings?: AutofillSettings): Promise<boolean | void> {
  const defaultSettings: AutofillSettings = { smart: true }; // Default to true for backward compatibility
  const finalSettings = { ...defaultSettings, ...settings };
  
  // No parameters - autofill all form fields on the page
  if (!target) {
    return autofillAll(finalSettings);
  }
  
  // If target is a container (has form fields), autofill the container
  if (target instanceof HTMLElement && hasFormFields(target)) {
    return autofillContainer(target, finalSettings);
  }
  
  // If target is a form element, autofill just that element
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
    const success = await autofillElement(target, finalSettings);
    if (!success) {
      showNotification('Failed to autofill the specified element', 'error');
    }
    return success;
  }
  
  // If target is a container but doesn't have form fields, try to find a container
  if (target instanceof HTMLElement) {
    const container = findFormContainer(target);
    if (container) {
      return autofillContainer(container, finalSettings);
    }
  }
  
  // For non-form elements, return false instead of falling back to autofill all
  return false;
}

// Autofill all form fields on the page
async function autofillAll(settings: AutofillSettings): Promise<void> {
  const elements = queryFormElements();
  const smartMode = settings.smart ?? true;

  // Smart mode: Fill ALL form fields (except those explicitly excluded)
  // Manual mode: Only fill fields with data-gofakeit attributes
  const targetsBase = smartMode
    ? elements
    : elements.filter((el) => (el as Element).hasAttribute('data-gofakeit'));
  const targets = targetsBase.filter((el) => !isDataGofakeitFalse(el));

  if (targets.length === 0) {
    if (!smartMode) {
      showNotification('No data-gofakeit fields exist. Turn on Smart mode to fill all form fields.', 'info');
    } else {
      showNotification('No form fields found to autofill', 'info');
    }
    return;
  }

  console.log(`[Gofakeit] Found ${targets.length} elements to generate data for`);
  showNotification(`Starting data generation for ${targets.length} fields...`, 'info');

  const results = await processElements(targets, settings);
  showResults(results.success, results.failed, 'Autofill');
}

// Autofill all fields within a specific container
async function autofillContainer(container: HTMLElement, settings: AutofillSettings): Promise<void> {
  const elements = queryFormElements(container);
  const smartMode = settings.smart ?? true;

  // Smart mode: Fill ALL form fields in container (except those explicitly excluded)
  // Manual mode: Only fill fields with data-gofakeit attributes
  const targetsBase = smartMode
    ? elements
    : elements.filter((el) => (el as Element).hasAttribute('data-gofakeit'));
  const targets = targetsBase.filter((el) => !isDataGofakeitFalse(el));

  if (targets.length === 0) {
    if (!smartMode) {
      showNotification('No data-gofakeit fields exist in this section. Turn on Smart mode to fill all form fields.', 'info');
    } else {
      showNotification('No form fields found in this container', 'info');
    }
    return;
  }
  
  console.log(`[Gofakeit] Found ${targets.length} elements to generate data for in container`);
  showNotification(`Starting data generation for ${targets.length} fields...`, 'info');
  
  const results = await processElements(targets, settings);
  showResults(results.success, results.failed, 'Container autofill');
}

// Main autofill function that routes to specific handlers
async function autofillElement(element: Element, settings: AutofillSettings): Promise<boolean> {
  const gofakeitFunc = element.getAttribute('data-gofakeit');
  if (typeof gofakeitFunc === 'string' && gofakeitFunc.trim().toLowerCase() === 'false') {
    return false;
  }
  
  const smartMode = settings.smart ?? true;
  // Smart mode: Fill any form field (even without data-gofakeit attribute)
  // Manual mode: Only fill fields that have data-gofakeit attributes
  if (!gofakeitFunc && !smartMode) {
    return false;
  }

  try {
    // Handle select dropdowns
    if (element instanceof HTMLSelectElement) {
      const funcToUse = (gofakeitFunc && gofakeitFunc !== 'true') ? gofakeitFunc : 'true';
      const { success, usedFunc } = await handleSelectWithFunction(element, funcToUse);
      if (success) {
        showFuncBadge(element, usedFunc, settings);
      }
      return success;
    }
    
    // Handle textarea elements
    if (element instanceof HTMLTextAreaElement) {
      const funcToUse = (gofakeitFunc && gofakeitFunc !== 'true') ? gofakeitFunc : 'sentence';
      const { success, usedFunc } = await handleTextarea(element, funcToUse);
      if (success) {
        showFuncBadge(element, usedFunc, settings);
      }
      return success;
    }
    
    // Handle input elements
    if (element instanceof HTMLInputElement) {
      const inputType = element.type.toLowerCase();
      
      // Handle checkbox inputs
      if (inputType === 'checkbox') {
        const passToHandler = (gofakeitFunc && gofakeitFunc !== 'true') ? gofakeitFunc : 'true';
        const { success, usedFunc } = await handleCheckbox(element, passToHandler);
        if (success) {
          showFuncBadge(element, usedFunc, settings);
        }
        return success;
      }
      
      // Handle radio inputs
      if (inputType === 'radio') {
        const passToHandler = (gofakeitFunc && gofakeitFunc !== 'true') ? gofakeitFunc : 'true';
        const { success, usedFunc, selectedElement } = await handleRadio(element, passToHandler);
        if (success) {
          // Show function badge over the selected radio button, not the original one
          const elementToShowBadge = selectedElement || element;
          showFuncBadge(elementToShowBadge, usedFunc, settings);
        }
        return success;
      }
      
      // Handle range inputs
      if (inputType === 'range') {
        const { success, usedFunc } = await handleRangeInput(element);
        if (success) {
          showFuncBadge(element, usedFunc, settings);
        }
        return success;
      }
      
      // Handle all other input types (text, email, tel, password, search, url, color, number, date, etc.)
      const inferred = (gofakeitFunc && gofakeitFunc !== 'true') ? gofakeitFunc : await searchFunctionForInput(element);
      
      // Route to appropriate handler based on input type
      if (inputType === 'number') {
        const { success, usedFunc } = await handleNumberInput(element, inferred);
        if (success) {
          showFuncBadge(element, usedFunc, settings);
        }
        return success;
      }
      
      if (inputType === 'date' || inputType === 'time' || inputType === 'datetime-local' || 
          inputType === 'month' || inputType === 'week') {
        const { success, usedFunc } = await handleDateTimeInput(element, inferred);
        if (success) {
          showFuncBadge(element, usedFunc, settings);
        }
        return success;
      }
      
      // Handle text inputs (text, email, tel, password, search, url, color, etc.)
      const { success, usedFunc } = await handleTextInput(element, inferred);
      if (success) {
        showFuncBadge(element, usedFunc, settings);
      }
      return success;
    }
    
    console.warn('[Gofakeit] Unsupported element type:', element);
    return false;
    
  } catch (error) {
    console.error('[Gofakeit] Unexpected error generating data for element:', element, error);
    return false;
  }
}

// ============================================================================
// PROCESSING FUNCTIONS (Called by main functions)
// ============================================================================

// Query all form elements that can be autofilled
function queryFormElements(container?: HTMLElement): Element[] {
  const selector = 'input, textarea, select';
  const nodeList = container ? container.querySelectorAll(selector) : document.querySelectorAll(selector);
  const elements: Element[] = [];
  nodeList.forEach((el) => {
    if (el instanceof HTMLInputElement) {
      if (el.type === 'hidden' || el.disabled || el.readOnly) return;
      elements.push(el);
    } else if (el instanceof HTMLTextAreaElement) {
      if (el.disabled || el.readOnly) return;
      elements.push(el);
    } else if (el instanceof HTMLSelectElement) {
      if (el.disabled) return;
      elements.push(el);
    }
  });
  return elements;
}

function isDataGofakeitFalse(el: Element): boolean {
  const val = (el as Element).getAttribute && (el as Element).getAttribute('data-gofakeit');
  return typeof val === 'string' && val.trim().toLowerCase() === 'false';
}

// Get unique elements, handling checkbox and radio groups
function getUniqueElements(elements: Element[]): Element[] {
  const uniqueElements: Element[] = [];
  const processedGroups = new Set<string>();
  
  for (const element of elements) {
    if (element instanceof HTMLInputElement) {
      const inputType = element.type.toLowerCase();
      
      if (inputType === 'checkbox' || inputType === 'radio') {
        const name = element.name;
        if (name && processedGroups.has(name)) {
          // Skip if we've already processed this group
          continue;
        }
        if (name) {
          processedGroups.add(name);
        }
      }
    }
    
    uniqueElements.push(element);
  }
  
  return uniqueElements;
}

// Process multiple elements and track results using batched API calls
async function processElements(elements: Element[], settings: AutofillSettings): Promise<{ success: number, failed: number }> {
  let successfulCount = 0;
  let failedCount = 0;
  
  // Get unique elements to avoid processing checkbox/radio groups multiple times
  const uniqueElements = getUniqueElements(elements);

  // Separate input elements from other elements
  const searchInputElements: HTMLInputElement[] = [];
  const otherElements: Element[] = [];
  
  for (const element of uniqueElements) {
    const gofakeitFunc = element.getAttribute('data-gofakeit');
    
    // Check if element has a specific function value (not "true" or "false")
    const hasSpecificFunction = gofakeitFunc && 
      gofakeitFunc.trim().toLowerCase() !== 'true' && 
      gofakeitFunc.trim().toLowerCase() !== 'false';
    
    if (element instanceof HTMLInputElement) {
      const inputType = element.type.toLowerCase();
      if (needsSearchApi(inputType) && !hasSpecificFunction) {
        // Only use search API for elements that need it and don't have specific functions
        searchInputElements.push(element);
      } else {
        // For excluded input types or elements with specific functions, add them to otherElements
        otherElements.push(element);
      }
    } else {
      otherElements.push(element);
    }
  }

  // Use search API to get functions for all searchable input elements at once
  let inputFunctionMap = new Map<HTMLInputElement, string>();
  if (searchInputElements.length > 0) {
    try {
      inputFunctionMap = await searchFunctionsForInputs(searchInputElements);
    } catch (error) {
      console.warn('[Gofakeit Autofill] Search API failed, falling back to individual function detection:', error);
      // Fallback to individual function detection
      for (const element of searchInputElements) {
        const func = await getElementFunction(element, settings);
        if (func) {
          inputFunctionMap.set(element, func);
        }
      }
    }
  }

  // Process excluded elements individually (they don't use batch API)
  const excludedElements: Element[] = [];
  const batchElements: { element: Element, func: string }[] = [];
  
  // Add input elements with their search API functions to batch
  searchInputElements.forEach(element => {
    const func = inputFunctionMap.get(element);
    if (func) {
      batchElements.push({ element, func });
    }
  });
  
  // Process other elements (select, textarea, checkbox, radio, etc.)
  for (const element of otherElements) {
    try {
      const func = await getElementFunction(element, settings);
      if (func) {
        // Check if this is an excluded type that should be processed individually
        if (element instanceof HTMLInputElement) {
          const inputType = element.type.toLowerCase();
          if (['checkbox', 'radio', 'range', 'file', 'button', 'submit', 'reset', 'image', 'color', 'date', 'time', 'datetime-local', 'month', 'week'].includes(inputType)) {
            // Process excluded types individually
            excludedElements.push(element);
            continue;
          }
        }
        // Add to batch for other types (select, textarea, etc.)
        batchElements.push({ element, func });
      }
    } catch (error) {
      failedCount++;
      console.warn(`[Gofakeit Autofill] Failed to get function for element:`, element, error);
    }
  }

  // Process excluded elements with appropriate timing
  const testMode = (globalThis as any).__GOFAKEIT_TEST_MODE__;
  const staggered = testMode ? false : (settings.staggered ?? true);
  
  if (staggered) {
    // Process excluded elements individually with staggered timing
    for (let i = 0; i < excludedElements.length; i++) {
      const element = excludedElements[i];
      const staggerDelay = settings.staggerDelay ?? 50;
      
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, staggerDelay));
      }
      
      try {
        const success = await autofillElement(element, settings);
        if (success) {
          successfulCount++;
        } else {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
        console.warn(`[Gofakeit Autofill] Failed to process excluded element:`, element, error);
      }
    }
  } else {
    // Process excluded elements all at once for fast mode
    const promises = excludedElements.map(async (element) => {
      try {
        const success = await autofillElement(element, settings);
        return success;
      } catch (error) {
        console.warn(`[Gofakeit Autofill] Failed to process excluded element:`, element, error);
        return false;
      }
    });
    
    const results = await Promise.all(promises);
    results.forEach(success => {
      if (success) {
        successfulCount++;
      } else {
        failedCount++;
      }
    });
  }

  // Process batch elements if any exist
  if (batchElements.length === 0) {
    return { success: successfulCount, failed: failedCount };
  }

  // Create batch requests
  const requests: MultiFuncRequest[] = batchElements.map((item, index) => ({
    id: `req_${index}`,
    func: item.func
  }));

  // Make single batch API call
  const batchResponse = await callMultiFunc(requests);
  
  if (!batchResponse.success || !batchResponse.data) {
    console.error('[Gofakeit Autofill] Batch API call failed:', batchResponse.error);
    return { success: successfulCount, failed: failedCount + batchElements.length };
  }

  // Process responses using existing handlers with staggered timing
  for (let i = 0; i < batchElements.length; i++) {
    const { element, func } = batchElements[i];
    const response = batchResponse.data[i];
    
    // Add staggered delay for visual effect if enabled
    const testMode = (globalThis as any).__GOFAKEIT_TEST_MODE__;
    const staggered = testMode ? false : (settings.staggered ?? true);
    const staggerDelay = settings.staggerDelay ?? 50;
    if (staggered && i > 0) {
      await new Promise(resolve => setTimeout(resolve, staggerDelay));
    }
    
    if (response && response.error) {
      // Handle API errors - display error message above the field
      failedCount++;
      console.warn(`[Gofakeit Autofill] API error for element:`, element, response.error);
      showFunctionBadge(element, response.error, 'error');
    } else if (response && response.value !== null) {
      try {
        // Use the existing autofillElement function with the batch response value
        const success = await autofillElementWithValue(element, func, response.value, settings);
        if (success) {
          successfulCount++;
          
          // Monitor if the value gets cleared after a short delay
          setTimeout(() => {
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
              if (element.value === '') {
                console.warn('[Gofakeit Autofill] Value was cleared for element:', element);
              }
            } else if (element instanceof HTMLSelectElement) {
              if (element.value === '') {
                console.warn('[Gofakeit Autofill] Value was cleared for select:', element);
              }
            }
          }, 1000);
        } else {
          failedCount++;
        }
      } catch (error) {
        failedCount++;
        console.warn(`[Gofakeit Autofill] Failed to apply value to element:`, element, error);
      }
    } else {
      failedCount++;
      console.warn(`[Gofakeit Autofill] No valid response for element:`, element);
    }
  }

  return { success: successfulCount, failed: failedCount };
}

// Get the function name for an element (same logic as autofillElement but returns function name)
async function getElementFunction(element: Element, settings: AutofillSettings): Promise<string | null> {
  const gofakeitFunc = element.getAttribute('data-gofakeit');
  if (typeof gofakeitFunc === 'string' && gofakeitFunc.trim().toLowerCase() === 'false') {
    return null;
  }
  
  const smartMode = settings.smart ?? true;
  if (!gofakeitFunc && !smartMode) {
    return null;
  }

  try {
    // Handle select dropdowns
    if (element instanceof HTMLSelectElement) {
      return (gofakeitFunc && gofakeitFunc !== 'true') ? gofakeitFunc : 'word';
    }
    
    // Handle textarea elements
    if (element instanceof HTMLTextAreaElement) {
      return getTextarea(gofakeitFunc || 'true');
    }
    
    // Handle input elements
    if (element instanceof HTMLInputElement) {
      const inputType = element.type.toLowerCase();
      
      // Handle checkbox inputs
      if (inputType === 'checkbox') {
        return (gofakeitFunc && gofakeitFunc !== 'true') ? gofakeitFunc : 'bool';
      }
      
      // Handle radio inputs
      if (inputType === 'radio') {
        return (gofakeitFunc && gofakeitFunc !== 'true') ? gofakeitFunc : 'true';
      }
      
      // Handle range inputs
      if (inputType === 'range') {
        return getRangeInput(element);
      }
      
      // For text inputs with specific functions, return the function directly
      if (gofakeitFunc && gofakeitFunc !== 'true') {
        return gofakeitFunc;
      }
      
      // For all other input types, use search API (this is a fallback for individual elements)
      return await searchFunctionForInput(element);
    }
    
    console.warn('[Gofakeit] Unsupported element type for batching:', element);
    return null;
    
  } catch (error) {
    console.error('[Gofakeit] Unexpected error getting function for element:', element, error);
    return null;
  }
}

// Show function badge with a slight delay for visual effect
function showFuncBadge(element: Element, func: string, settings?: AutofillSettings): void {
  const testMode = (globalThis as any).__GOFAKEIT_TEST_MODE__;
  const staggered = testMode ? false : (settings?.staggered ?? true);
  const staggerDelay = settings?.staggerDelay ?? 50;
  
  // Only delay the badge if staggered is enabled, using the staggerDelay from settings
  const actualDelay = staggered ? staggerDelay : 0;
  setTimeout(() => {
    showFunctionBadge(element, func);
  }, actualDelay);
}

// Autofill an element with a pre-fetched value (for batch processing)
async function autofillElementWithValue(element: Element, func: string, value: string, settings?: AutofillSettings): Promise<boolean> {
  try {
    // Handle select dropdowns
    if (element instanceof HTMLSelectElement) {
      const { success, usedFunc } = await handleSelectWithFunction(element, func, value);
      if (success) {
        showFuncBadge(element, usedFunc, settings);
      }
      return success;
    }
    
    // Handle textarea elements
    if (element instanceof HTMLTextAreaElement) {
      setTextarea(element, value);
      showFuncBadge(element, func, settings);
      return true;
    }
    
    // Handle input elements
    if (element instanceof HTMLInputElement) {
      const inputType = element.type.toLowerCase();
      
      // Handle checkbox inputs
      if (inputType === 'checkbox') {
        const { success, usedFunc } = await handleCheckbox(element, func, value);
        if (success) {
          showFuncBadge(element, usedFunc, settings);
        }
        return success;
      }
      
      // Handle radio inputs
      if (inputType === 'radio') {
        const { success, usedFunc } = await handleRadio(element, func, value);
        if (success) {
          showFuncBadge(element, usedFunc, settings);
        }
        return success;
      }
      
      // Handle number inputs
      if (inputType === 'number') {
        setNumberInput(element, value);
        showFuncBadge(element, func, settings);
        return true;
      }
      
      // Handle range inputs
      if (inputType === 'range') {
        setRangeInput(element, value);
        showFuncBadge(element, func, settings);
        return true;
      }
      
      // Handle date/time inputs
      if (inputType === 'date' || inputType === 'time' || inputType === 'datetime-local' || 
          inputType === 'month' || inputType === 'week') {
        const { success, usedFunc } = await handleDateTimeInput(element, func, value);
        if (success) {
          showFuncBadge(element, usedFunc, settings);
        }
        return success;
      }
      
      // Handle text inputs (text, email, tel, password, search, url, color, etc.)
      setTextInput(element, value);
      showFuncBadge(element, func, settings);
      return true;
    }
    
    console.warn('[Gofakeit] Unsupported element type:', element);
    return false;
    
  } catch (error) {
    console.error('[Gofakeit] Unexpected error generating data for element:', element, error);
    return false;
  }
}

// Show results notification
function showResults(successfulCount: number, failedCount: number, context: string): void {
  // Show successful count notification
  if (successfulCount > 0) {
    console.log(`[Gofakeit] ${context} completed successfully for ${successfulCount} fields`);
    showNotification(`Successfully generated data for ${successfulCount} fields!`, 'success');
  }
  
  // Show failed count notification
  if (failedCount > 0) {
    console.error(`[Gofakeit] ${context} failed for ${failedCount} fields`);
    showNotification(`Failed to generate data for ${failedCount} fields.`, 'error');
  }
  
  // If no fields were processed at all
  if (successfulCount === 0 && failedCount === 0) {
    console.log(`[Gofakeit] ${context} - no fields were processed`);
    showNotification(`No fields were processed.`, 'info');
  }
}

// ============================================================================
// UTILITY FUNCTIONS (Called by various functions)
// ============================================================================

// Handle error display and field highlighting
export function handleError(element: Element, error: string, functionName?: string): void {
  if (element instanceof HTMLElement) {
    element.style.border = `2px solid ${GOFAKEIT_COLORS.error}`;
    
    setTimeout(() => {
      element.style.border = '';
    }, 5000);
  }
  
  const message = functionName ? `Invalid function: ${functionName}` : error;
  showFunctionBadge(element, message, 'error');
}

// Check if an element contains form fields with data-gofakeit attributes
export function hasFormFields(element: HTMLElement): boolean {
  const formFields = element.querySelectorAll('input[data-gofakeit], textarea[data-gofakeit], select[data-gofakeit]');
  return formFields.length > 0;
}

// Check if an element is a form field with data-gofakeit attribute
export function isFormField(element: HTMLElement): boolean {
  return (
    (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') &&
    element.hasAttribute('data-gofakeit')
  );
}

// Global tracking of active function badges
const activeBadges = new Map<Element, { badge: HTMLElement; timeout: ReturnType<typeof setTimeout>; cleanup: () => void }>();

// Remove existing badges for a specific element
function removeExistingBadges(element: Element): void {
  // For radio buttons, remove badges for all radio buttons in the same group
  if (element instanceof HTMLInputElement && element.type === 'radio' && element.name) {
    const radioGroup = document.querySelectorAll(`input[type="radio"][name="${element.name}"]`);
    radioGroup.forEach(radio => {
      const existing = activeBadges.get(radio);
      if (existing) {
        clearTimeout(existing.timeout);
        existing.cleanup();
        activeBadges.delete(radio);
      }
    });
  } else {
    // For other elements, just remove the badge for this specific element
    const existing = activeBadges.get(element);
    if (existing) {
      clearTimeout(existing.timeout);
      existing.cleanup();
      activeBadges.delete(element);
    }
  }
}

// Display a small badge showing the function used for this field
export function showFunctionBadge(element: Element, funcName: string, status: 'success' | 'error' = 'success'): void {
  if (!(element instanceof HTMLElement)) return;

  // Remove any existing badges for this element
  removeExistingBadges(element);

  const badge = document.createElement('div');
  badge.textContent = funcName;
  badge.style.position = 'fixed';
  badge.style.fontFamily = 'Arial, sans-serif';
  badge.style.fontSize = '11px';
  badge.style.padding = '3px 8px';
  badge.style.borderRadius = '6px';
  badge.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
  badge.style.zIndex = '2147483647';
  badge.style.opacity = '0';
  badge.style.transform = 'translateY(-6px)';
  badge.style.transition = 'opacity 200ms ease, transform 200ms ease';
  badge.style.pointerEvents = 'none';

  // Apply styling based on status
  if (status === 'error') {
    badge.style.background = GOFAKEIT_COLORS.error;
    badge.style.color = '#fff';
    badge.style.border = `1px solid ${GOFAKEIT_COLORS.error}`;
  } else {
    badge.style.background = GOFAKEIT_COLORS.primary;
    badge.style.color = '#000';
  }

  const updatePosition = () => {
    const rect = element.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;

    // If the element is completely out of the viewport, hide the badge entirely
    const outOfView = rect.bottom <= 0 || rect.top >= vh || rect.right <= 0 || rect.left >= vw;
    if (outOfView) {
      badge.style.display = 'none';
      return;
    }

    // Otherwise, ensure it's visible and position above-left of the field
    if (badge.style.display === 'none') badge.style.display = 'block';
    const top = rect.top - 8;
    const left = rect.left;
    badge.style.top = `${top}px`;
    badge.style.left = `${left}px`;
  };

  document.body.appendChild(badge);
  updatePosition();

  // Animate in
  requestAnimationFrame(() => {
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(-12px)';
  });

  // Track movement while visible
  const onScroll = () => updatePosition();
  const onResize = () => updatePosition();
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onResize, true);

  // Observe element size/position changes
  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updatePosition());
    try { ro.observe(element); } catch { /* ignore */ }
  }

  // Create cleanup function
  const cleanup = () => {
    window.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onResize, true);
    if (ro) {
      try { ro.disconnect(); } catch { /* ignore */ }
      ro = null;
    }
    if (badge.parentNode) badge.parentNode.removeChild(badge);
    activeBadges.delete(element);
  };

  // Animate out and remove after extended delay
  const DISPLAY_MS = 6000;
  const timeout = setTimeout(() => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(-6px)';
    setTimeout(cleanup, 220);
  }, DISPLAY_MS);

  // Track this badge
  activeBadges.set(element, { badge, timeout, cleanup });
}

// Extract nearby/associated label text for context
function getAssociatedLabelText(input: HTMLInputElement): string {
  const texts: string[] = [];
  const id = input.id;
  // aria-labelledby
  const labelledBy = input.getAttribute('aria-labelledby');
  if (labelledBy) {
    labelledBy.split(/\s+/).forEach((ref) => {
      const el = document.getElementById(ref);
      if (el && el.textContent) texts.push(el.textContent);
    });
  }
  // explicit label[for]
  if (id) {
    try {
      const lbl = document.querySelector('label[for="' + id.replace(/"/g, '\\"') + '"]') as HTMLLabelElement | null;
      if (lbl && lbl.textContent) texts.push(lbl.textContent);
    } catch { /* ignore */ }
  }
  // implicit parent label
  const closestLabel = input.closest('label');
  if (closestLabel && closestLabel.textContent) texts.push(closestLabel.textContent);
  // previous sibling label (common in some UIs)
  const prev = input.previousElementSibling as HTMLElement | null;
  if (prev && prev.tagName === 'LABEL' && prev.textContent) texts.push(prev.textContent);
  return texts.join(' ').toLowerCase();
}

// Determine if an input type needs search API for function detection
function needsSearchApi(inputType: string): boolean {
  // These input types have their own specific handling and don't need search API
  const skipSearchTypes = ['checkbox', 'radio', 'select', 'range', 'file', 'button', 'submit', 'reset', 'image', 'color', 'week', 'date', 'time', 'datetime-local', 'month'];
  return !skipSearchTypes.includes(inputType);
}

// Get a default function for input types that don't need search API
export function getDefaultFunctionForInputType(inputType: string): string {
  switch (inputType) {
    case 'checkbox':
    case 'radio':
    case 'select':
      return 'true';
    case 'range':
      return 'number?min=0&max=100';
    case 'file':
      return 'word';
    case 'button':
    case 'submit':
    case 'reset':
    case 'image':
      return 'word';
    case 'color':
      return 'hexcolor';
    case 'week':
      return 'generateWeek';
    case 'date':
      return 'generateDate';
    case 'time':
      return 'generateTime';
    case 'datetime-local':
      return 'generateDateTime';
    case 'month':
      return 'generateMonth';
    default:
      return 'word';
  }
}

// Get type-specific fallback functions for when search API doesn't find good matches
function getTypeSpecificFallback(inputType: string): string {
  switch (inputType) {
    case 'email':
      return 'email';
    case 'tel':
      return 'phone';
    case 'number':
      return 'number';
    case 'date':
      return 'date';
    case 'time':
      return 'time';
    case 'datetime-local':
      return 'datetime';
    case 'month':
      return 'month';
    case 'week':
      return 'week';
    case 'url':
      return 'url';
    case 'password':
      return 'password';
    case 'search':
      return 'word';
    case 'color':
      return 'color';
    case 'text':
    default:
      return 'word';
  }
}

// Create a comprehensive search query from input field characteristics
function createSearchQuery(input: HTMLInputElement): string {
  const type = input.type.toLowerCase();
  const name = (input.name || '').toLowerCase();
  const id = (input.id || '').toLowerCase();
  const placeholder = (input.placeholder || '').toLowerCase();
  const autocomplete = (input.autocomplete || '').toLowerCase();
  const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
  const labelText = getAssociatedLabelText(input);

  // Build a comprehensive search query with all available information
  const queryParts = [
    type,
    name,
    id,
    placeholder,
    autocomplete,
    ariaLabel,
    labelText
  ].filter(part => part && part.trim());

  // Join all parts with spaces to create a comprehensive search query
  const searchQuery = queryParts.join(' ').toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  return searchQuery || 'text input';
}

// Search for functions using the API endpoint based on input field characteristics
async function searchFunctionForInput(input: HTMLInputElement): Promise<string> {
  const type = input.type.toLowerCase();
  
  // Skip search API for input types that don't need it
  if (!needsSearchApi(type)) {
    return getDefaultFunctionForInputType(type);
  }

  const searchQuery = createSearchQuery(input);

  try {
    const searchRequest: FuncSearchRequest = {
      id: input.id || input.name || `input_${Date.now()}`,
      query: searchQuery
    };

    const response = await searchMultiFunc([searchRequest]);
    
    if (response.success && response.data && response.data.length > 0) {
      const searchResult = response.data[0];
      if (searchResult.results && searchResult.results.length > 0) {
        // Return the highest scoring function
        const bestMatch = searchResult.results[0];
        return bestMatch.name;
      }
    }
  } catch (error) {
    console.warn('[Gofakeit] Function search failed, falling back to default function:', error);
  }

  // Fallback to default function if search fails
  return getDefaultFunctionForInputType(type);
}

// Search for functions for multiple inputs using the API endpoint
export async function searchFunctionsForInputs(inputs: HTMLInputElement[]): Promise<Map<HTMLInputElement, string>> {
  const functionMap = new Map<HTMLInputElement, string>();
  
  if (inputs.length === 0) {
    return functionMap;
  }

  try {
    // Create search requests for all inputs using the shared createSearchQuery function
    const searchRequests: FuncSearchRequest[] = inputs.map((input, index) => {
      const searchQuery = createSearchQuery(input);
      
      return {
        id: input.id || input.name || `input_${index}`,
        query: searchQuery
      };
    });

    const response = await searchMultiFunc(searchRequests);
    
    if (response.success && response.data) {
      // Map results back to inputs with improved fallback logic
      for (let i = 0; i < response.data.length; i++) {
        const searchResult = response.data[i];
        const input = inputs[i];
        const inputType = input.type.toLowerCase();
        
        if (searchResult.results && searchResult.results.length > 0) {
          const bestMatch = searchResult.results[0];
          // Only use the search result if it has a reasonable score
          if (bestMatch.score >= 100) {
            functionMap.set(input, bestMatch.name);
          } else {
            // Use type-specific fallback for low-scoring results
            functionMap.set(input, getTypeSpecificFallback(inputType));
          }
        } else {
          // Fallback to type-specific function if no search results
          functionMap.set(input, getTypeSpecificFallback(inputType));
        }
      }
    } else {
      // Fallback to default functions for all inputs if search fails
      for (const input of inputs) {
        functionMap.set(input, getDefaultFunctionForInputType(input.type.toLowerCase()));
      }
    }
  } catch (error) {
    console.warn('[Gofakeit] Multi-function search failed, falling back to default functions:', error);
    // Fallback to default functions for all inputs
    for (const input of inputs) {
      functionMap.set(input, getDefaultFunctionForInputType(input.type.toLowerCase()));
    }
  }

  return functionMap;
}

// Find the closest container that has form fields with data-gofakeit attributes
export function findFormContainer(element: HTMLElement): HTMLElement | null {
  // Check if the current element has form fields
  if (hasFormFields(element)) {
    return element;
  }
  
  // Check parent elements
  let parent = element.parentElement;
  while (parent) {
    if (hasFormFields(parent)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  
  return null;
}

// Simple notification function (can be overridden by the consuming application)
function showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  console.log(`[Gofakeit ${type.toUpperCase()}] ${message}`);
}
