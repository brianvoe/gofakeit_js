import {
  fetchFuncMulti,
  FetchFuncMultiRequest,
  fetchFuncSearch,
  FetchFuncSearchRequest,
  FetchFuncParams,
} from './api';
import {
  GOFAKEIT_COLORS,
  GOFAKEIT_SPACING,
  GOFAKEIT_BORDER,
  GOFAKEIT_FONT,
} from './styles';

export enum AutofillStatus {
  IDLE = 'idle',
  STARTING = 'starting',
  INITIALIZING = 'initializing',
  DETERMINING_FUNCTIONS = 'determining_functions',
  GETTING_VALUES = 'getting_values',
  SETTING_VALUES = 'setting_values',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface AutofillSettings {
  mode?: 'auto' | 'manual';
  stagger?: number;
  badges?: number;
  debug?: boolean;

  // Callbacks
  onStatusChange?: (status: AutofillStatus, state: AutofillState) => void;
}

export interface AutofillState {
  status: AutofillStatus;
  elements: AutofillElement[];
}

export interface AutofillElement {
  id: string; // id of the element
  name: string; // name of the element
  element: Element; // element to autofill
  type: string; // element type
  function: string; // function that will be used to autofill the element
  search: string; // search query that will be used to autofill the element
  value: string; // value of the autofill result
  error: string; // error message
}

export interface AutofillResult {
  elements: AutofillElement[];
  error?: string;
}

export interface Results {
  success: number;
  failed: number;
  elements: AutofillElement[];
}

export class Autofill {
  public settings: AutofillSettings;
  public state: AutofillState;

  constructor(settings: AutofillSettings = {}) {
    this.settings = {
      mode: 'auto',
      stagger: 50,
      badges: 3000,
      debug: false,
      ...settings,
    };

    this.state = {
      status: AutofillStatus.IDLE,
      elements: [],
    };
  }

  // ============================================================================
  // MAIN FILL FUNCTION
  // ============================================================================

  async fill(target?: HTMLElement | Element | string): Promise<Results> {
    this.updateStatus(AutofillStatus.STARTING);
    this.state.elements = []; // Clear previous elements

    // Step 1: Set all target elements based on the target parameter
    this.setElements(target);

    if (this.state.elements.length === 0) {
      this.debug('info', 'No form fields found to fill');
      // Only set to idle if we're not already in error state
      if (this.state.status !== AutofillStatus.ERROR) {
        this.updateStatus(AutofillStatus.IDLE);
      }
      return this.results();
    }

    // Step 2: Determine functions for elements that need search
    await this.setElementFunctions();
    this.updateStatus(AutofillStatus.DETERMINING_FUNCTIONS);

    // Step 3: Get values for all elements via multi-function API
    await this.getElementValues();
    this.updateStatus(AutofillStatus.GETTING_VALUES);

    // Step 4: set values to the actual form elements
    await this.setElementValues();
    this.updateStatus(AutofillStatus.SETTING_VALUES);

    // Return the results
    this.updateStatus(AutofillStatus.COMPLETED);
    return this.results();
  }

  // ============================================================================
  // Step 1: Set all target elements based on the target parameter
  // ============================================================================

  // Public method to set form elements based on target parameter
  public setElements(target?: HTMLElement | Element | string): void {
    const allFormElements: Element[] = [];

    if (target) {
      if (typeof target === 'string') {
        // For string selectors, get the matching elements and search within them
        const elements = document.querySelectorAll(target);
        if (elements.length === 0) {
          this.debug('error', `No element found with selector: "${target}"`);
          this.updateStatus(AutofillStatus.ERROR);
          this.state.elements = [];
          return;
        }
        // Search within each matching element for form elements
        elements.forEach(el => {
          if (
            el instanceof HTMLInputElement ||
            el instanceof HTMLTextAreaElement ||
            el instanceof HTMLSelectElement
          ) {
            // If the element itself is a form element, add it
            if (this.shouldSkipElement(el)) return;
            allFormElements.push(el);
          } else {
            // If it's not a form element, search within it for form elements
            const selector = 'input, textarea, select';
            const nodeList = el.querySelectorAll(selector);

            nodeList.forEach(formEl => {
              // Skip hidden, disabled, or readonly elements
              if (this.shouldSkipElement(formEl)) return;
              allFormElements.push(formEl);
            });
          }
        });
      } else if (target instanceof HTMLElement || target instanceof Element) {
        // For element targets, check if the element itself is a form element
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        ) {
          // Skip hidden, disabled, or readonly elements
          if (this.shouldSkipElement(target)) {
            this.state.elements = [];
            return;
          }
          allFormElements.push(target);
        } else {
          // If it's not a form element, search within it
          const selector = 'input, textarea, select';
          const nodeList = target.querySelectorAll(selector);

          nodeList.forEach(el => {
            // Skip hidden, disabled, or readonly elements
            if (this.shouldSkipElement(el)) return;
            allFormElements.push(el);
          });
        }
      }
    } else {
      // No target specified, search the entire document
      const selector = 'input, textarea, select';
      const nodeList = document.querySelectorAll(selector);

      nodeList.forEach(el => {
        // Skip hidden, disabled, or readonly elements
        if (this.shouldSkipElement(el)) return;
        allFormElements.push(el);
      });
    }

    // Step 3: Filter elements based on mode and data-gofakeit attributes
    const mode = this.settings.mode ?? 'auto';
    const filteredElements: Element[] = [];

    for (const element of allFormElements) {
      const gofakeitFunc = element.getAttribute('data-gofakeit');

      // Skip if explicitly disabled
      if (
        typeof gofakeitFunc === 'string' &&
        gofakeitFunc.trim().toLowerCase() === 'false'
      ) {
        continue;
      }

      // In manual mode, only include elements with data-gofakeit attribute
      if (mode === 'manual' && !gofakeitFunc) {
        continue;
      }

      // In auto mode, include all elements (with or without data-gofakeit)
      filteredElements.push(element);
    }

    // Loop through filteredElements and create AutofillElement objects
    const autofillElements: AutofillElement[] = [];
    for (const element of filteredElements) {
      // random 8 digit alphanumeric string
      const id =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // add new element to the autofillElements array
      autofillElements.push({
        id: id,
        name: element.getAttribute('name') || '',
        element,
        type: this.getElementType(element),
        function: '',
        search: this.getElementSearch(element as HTMLInputElement),
        value: '',
        error: '',
      });
    }

    this.state.elements = autofillElements;

    // Debug output for element selection
    if (autofillElements.length > 0) {
      this.debug(
        'info',
        `Found ${autofillElements.length} elements to generate data for`
      );
    }
  }

  // Check if an element should be skipped (hidden, disabled, or readonly)
  public shouldSkipElement(element: Element): boolean {
    if (element instanceof HTMLInputElement) {
      return element.type === 'hidden' || element.disabled || element.readOnly;
    } else if (element instanceof HTMLTextAreaElement) {
      return element.disabled || element.readOnly;
    } else if (element instanceof HTMLSelectElement) {
      return element.disabled;
    }
    return false;
  }

  // Get the element type
  private getElementType(element: Element): string {
    if (element instanceof HTMLInputElement) {
      return element.type.toLowerCase();
    } else if (element instanceof HTMLTextAreaElement) {
      return 'textarea';
    } else if (element instanceof HTMLSelectElement) {
      return 'select';
    }
    return 'unknown';
  }

  // Get the comprehensive search string for an element
  public getElementSearch(el: Element): string {
    // Get label text from various sources
    const labelTexts: string[] = [];
    const id = el.id;

    // aria-labelledby
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
      labelledBy.split(/\s+/).forEach(ref => {
        const labelEl = document.getElementById(ref);
        if (labelEl && labelEl.textContent)
          labelTexts.push(labelEl.textContent);
      });
    }

    // explicit label[for]
    if (id) {
      const lbl = document.querySelector(
        'label[for="' + id.replace(/"/g, '\\"') + '"]'
      ) as HTMLLabelElement | null;
      if (lbl && lbl.textContent) labelTexts.push(lbl.textContent);
    }

    // implicit parent label
    const closestLabel = el.closest('label');
    if (closestLabel && closestLabel.textContent)
      labelTexts.push(closestLabel.textContent);

    // previous sibling label (common in some UIs)
    const prev = el.previousElementSibling as HTMLElement | null;
    if (prev && prev.tagName === 'LABEL' && prev.textContent)
      labelTexts.push(prev.textContent);

    const labelText = labelTexts.join(' ').toLowerCase();

    // Get additional element attributes for comprehensive search
    const type = el instanceof HTMLInputElement ? el.type.toLowerCase() : '';
    const name = (el.getAttribute('name') || '').toLowerCase();
    const elementId = (el.id || '').toLowerCase();
    const placeholder =
      el instanceof HTMLInputElement
        ? (el.placeholder || '').toLowerCase()
        : '';
    const autocomplete =
      el instanceof HTMLInputElement
        ? (el.autocomplete || '').toLowerCase()
        : '';
    const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();

    // Build a comprehensive search query with all available information
    const queryParts = [
      type,
      name,
      elementId,
      placeholder,
      autocomplete,
      ariaLabel,
      labelText,
    ].filter(part => part && part.trim());

    // Join all parts with spaces to create a comprehensive search query
    const searchQuery = queryParts
      .join(' ')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    return searchQuery;
  }

  // ============================================================================
  // Step 2: Determine functions for elements that need search
  // ============================================================================

  public async setElementFunctions(): Promise<void> {
    this.debug(
      'info',
      `Determining functions for ${this.state.elements.length} elements`
    );

    // Step 1: Loop through elements and set functions for types that don't need search
    const elementsNeedingSearch: AutofillElement[] = [];

    for (const el of this.state.elements) {
      const functionName = this.getElementFunction(el.element);

      if (functionName !== null) {
        // Function determined - use it directly
        el.function = functionName;
      } else {
        // Function needs search - add to search array
        elementsNeedingSearch.push(el);
      }
    }

    // Step 2: Handle elements that need search
    if (elementsNeedingSearch.length > 0) {
      this.debug(
        'info',
        `${elementsNeedingSearch.length} elements need function search`
      );

      // Create search requests using existing search values from state
      const searchRequests: FetchFuncSearchRequest[] =
        elementsNeedingSearch.map((el, index) => {
          return {
            id:
              el.element.id ||
              el.element.getAttribute('name') ||
              `input_${index}`,
            query: el.search,
          };
        });

      const response = await fetchFuncSearch(searchRequests);

      if (response.success && response.data) {
        // Map results back to elements - use first result regardless of score
        for (let i = 0; i < response.data.length; i++) {
          const searchResult = response.data[i];
          const el = elementsNeedingSearch[i];

          if (searchResult.results && searchResult.results.length > 0) {
            // Use the first result, not based on score
            el.function = searchResult.results[0].name;
          } else {
            // Fallback to type-specific function if no search results
            el.function = this.getElementFunctionFallback(el.element);
          }
        }
      } else {
        // Fallback to type-specific functions if search fails
        for (const el of elementsNeedingSearch) {
          el.function = this.getElementFunctionFallback(el.element);
        }
      }
    }

    this.debug('info', 'Function determination complete');
  }

  public getElementFunction(element: Element): string | null {
    const gofakeitFunc = element.getAttribute('data-gofakeit');
    const elementType = this.getElementType(element);

    if (gofakeitFunc && gofakeitFunc !== 'true') {
      // Specific function provided - use it directly
      return gofakeitFunc;
    } else if (gofakeitFunc === 'true') {
      // Function is 'true' - needs search
      return null;
    } else {
      // No function specified - check if element type needs search
      const skipSearchTypes = [
        'checkbox',
        'radio',
        'select',
        'range',
        'file',
        'button',
        'submit',
        'reset',
        'image',
        'week',
        'date',
        'time',
        'datetime-local',
        'month',
      ];
      const needsSearch = !skipSearchTypes.includes(elementType);

      if (needsSearch) {
        // Element type needs search - return null
        return null;
      } else {
        // Element type doesn't need search - use fallback function
        return this.getElementFunctionFallback(element);
      }
    }
  }

  // If the element doesnt have a function and search doesnt return a function,
  // we will use a fallback function
  private getElementFunctionFallback(element: Element): string {
    if (element instanceof HTMLInputElement) {
      const elementType = element.type.toLowerCase();

      switch (elementType) {
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
        case 'text':
          return 'word';
        case 'email':
          return 'email';
        case 'tel':
          return 'phone';
        case 'url':
          return 'url';
        case 'password':
          return 'password';
        case 'search':
          return 'word';
        case 'number':
        case 'range':
          return 'number';
        case 'checkbox':
          return 'bool';
        case 'radio':
          return 'randomstring';
        default:
          return 'word';
      }
    } else if (element instanceof HTMLTextAreaElement) {
      return 'sentence';
    } else if (element instanceof HTMLSelectElement) {
      return 'randomstring';
    }

    return 'word';
  }

  // ============================================================================
  // Step 3: Get values for all elements via multi-function API
  // ============================================================================

  // Get values for all elements via multi-function API
  public async getElementValues(): Promise<void> {
    this.debug('info', 'Starting value generation...');
    const elementsNeedingValues = this.state.elements.filter(
      el => el.function && !el.error
    );

    if (elementsNeedingValues.length === 0) {
      this.debug('info', 'No elements need value generation');
      return;
    }

    this.debug(
      'info',
      `Getting values for ${elementsNeedingValues.length} elements from API`
    );

    const requests: FetchFuncMultiRequest[] = [];
    const processedNames: string[] = []; // Track processed radio group names

    // Process each element, adding parameters based on function type
    for (const el of elementsNeedingValues) {
      // Skip radio elements that are part of a group we've already processed
      if (el.type === 'radio' && el.name && processedNames.includes(el.name)) {
        continue;
      }

      const request: FetchFuncMultiRequest = {
        id: el.id,
        func: el.function,
      };

      // Add parameters based on element type
      switch (el.type) {
        case 'select':
          request.params = this.paramsSelect(el.element as HTMLSelectElement);
          break;
        case 'radio': {
          // For radio groups, get all radio elements with the same name
          const radioGroup = elementsNeedingValues.filter(
            otherEl => otherEl.type === 'radio' && otherEl.name === el.name
          );
          request.params = this.paramsRadio(radioGroup);
          // Mark this radio group as processed
          if (el.name) {
            processedNames.push(el.name);
          }
          break;
        }
        // Add other element type cases here as needed
        default:
          // No special parameters needed
          break;
      }

      requests.push(request);
    }

    const response = await fetchFuncMulti(requests);

    if (response.success && response.data) {
      // Map results back to elements
      for (let i = 0; i < response.data.length; i++) {
        const result = response.data[i];
        const el = elementsNeedingValues[i];

        if (result.value !== null && result.value !== undefined) {
          el.value = String(result.value);
        } else if (result.error) {
          el.error = result.error;
        } else {
          el.error = 'Unknown API error';
        }
      }
    } else {
      // Set error for all elements if the request failed
      for (const el of elementsNeedingValues) {
        el.error = response.error || 'API request failed';
      }
    }

    this.debug('info', 'Value generation complete');
  }

  // ============================================================================
  // Step 4: Set values to the actual form elements
  // ============================================================================

  // Set values to the actual form elements
  public async setElementValues(): Promise<void> {
    this.debug('info', 'Starting value application...');
    if (this.state.elements.length === 0) {
      this.debug('info', 'No elements to apply values to');
      return;
    }

    this.debug('info', `Processing ${this.state.elements.length} elements`);

    // Track processed radio group names to avoid duplicate badges
    const processedRadioNames: string[] = [];

    // Process all elements with optional staggering and show badges for each
    for (let i = 0; i < this.state.elements.length; i++) {
      const el = this.state.elements[i];
      let elementToShowBadge: AutofillElement | null = null;

      // Handle different element types
      switch (el.type) {
        case 'radio':
          // Only process if we haven't already processed this radio group
          if (el.name && !processedRadioNames.includes(el.name)) {
            processedRadioNames.push(el.name);
            elementToShowBadge = this.setRadioGroup(el);
          }
          break;
        default:
          // Only set value if el has a valid value and no error
          if (el.value !== undefined && el.value !== null && !el.error) {
            this.setElementValue(el);
          }
          elementToShowBadge = el;
          break;
      }

      // Show badge for the appropriate element
      if (
        this.settings.badges &&
        this.settings.badges > 0 &&
        elementToShowBadge
      ) {
        this.showBadge(
          elementToShowBadge.error ? 'error' : 'success',
          elementToShowBadge
        );
      }

      // Add delay between applications (except for the last one) if stagger is enabled
      if (
        this.settings.stagger &&
        this.settings.stagger > 0 &&
        i < this.state.elements.length - 1
      ) {
        await new Promise(resolve =>
          setTimeout(resolve, this.settings.stagger)
        );
      }
    }

    this.debug('info', 'Value application complete');
  }

  private setRadioGroup(el: AutofillElement): AutofillElement | null {
    // Find all radio elements in the same group
    const radioGroup = this.state.elements.filter(
      otherEl => otherEl.type === 'radio' && otherEl.name === el.name
    );

    // Find the radio element that matches the returned value
    const selectedRadio = radioGroup.find(
      radioEl => (radioEl.element as HTMLInputElement).value === el.value
    );

    if (selectedRadio && !selectedRadio.error) {
      // Set the value on the matching radio button
      this.setRadioValue(
        selectedRadio.element as HTMLInputElement,
        selectedRadio.value
      );
      // Return the selected radio element for badge display
      return selectedRadio;
    } else if (el.error) {
      // Return the original element if there's an error
      return el;
    }

    return null;
  }

  private setElementValue(el: AutofillElement): void {
    const element = el.element;

    if (element instanceof HTMLInputElement) {
      const elementType = element.type.toLowerCase();

      switch (elementType) {
        case 'checkbox':
          this.setCheckboxValue(element, el.value);
          break;
        case 'radio':
          this.setRadioValue(element, el.value);
          break;
        case 'number':
        case 'range':
          this.setNumberValue(element, el.value);
          break;
        case 'date':
        case 'time':
        case 'datetime-local':
        case 'month':
        case 'week':
          this.setDateTimeValue(element, el.value);
          break;
        default:
          this.setTextValue(element, el.value);
      }
    } else if (element instanceof HTMLTextAreaElement) {
      this.setTextareaValue(element, el.value);
    } else if (element instanceof HTMLSelectElement) {
      this.setSelectValue(element, el.value);
    }
  }

  // ============================================================================
  // ELEMENT TYPE SPECIFIC FUNCTIONS
  // ============================================================================

  private setDateTimeValue(element: HTMLInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private setTextValue(element: HTMLInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private setTextareaValue(element: HTMLTextAreaElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private setNumberValue(element: HTMLInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private setRangeValue(element: HTMLInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private setCheckboxValue(
    element: HTMLInputElement,
    value: string | boolean
  ): void {
    const boolValue = value === 'true' || value === true;
    element.checked = boolValue;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private setRadioValue(
    element: HTMLInputElement,
    value: string | boolean
  ): void {
    const boolValue = value === 'true' || value === true;

    if (boolValue) {
      // Uncheck other radios in the same group
      const radioName = element.name;
      if (radioName) {
        const otherRadios = document.querySelectorAll(
          `input[type="radio"][name="${radioName}"]`
        );
        otherRadios.forEach(radio => {
          if (radio !== element) {
            (radio as HTMLInputElement).checked = false;
          }
        });
      }

      element.checked = true;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      element.checked = false;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  private setSelectValue(element: HTMLSelectElement, value: string): void {
    // Try to find an option with the exact value
    const exactMatch = Array.from(element.options).find(
      option => option.value === value
    );
    if (exactMatch) {
      element.value = value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    // Try to find an option with matching text content
    const textMatch = Array.from(element.options).find(option =>
      option.textContent?.toLowerCase().includes(value.toLowerCase())
    );
    if (textMatch) {
      element.value = textMatch.value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    // Fallback: select a random non-empty option
    const nonEmptyOptions = Array.from(element.options).filter(
      option => option.value && option.value.trim() !== ''
    );
    if (nonEmptyOptions.length > 0) {
      const randomOption =
        nonEmptyOptions[Math.floor(Math.random() * nonEmptyOptions.length)];
      element.value = randomOption.value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  private showBadge(type: 'success' | 'error', el: AutofillElement): void {
    // Remove any existing badge for this element
    this.removeBadge(el.id);

    // Create badge element
    const badge = document.createElement('div');
    badge.id = `gofakeit-badge-${el.id}`;
    badge.textContent = type === 'success' ? el.function : el.error;

    // Position badge relative to input field
    badge.style.position = 'absolute';
    badge.style.top = '0';
    badge.style.transform = 'translateY(-2px)';
    badge.style.zIndex = '10';
    badge.style.padding = `${GOFAKEIT_SPACING.quarter}px ${GOFAKEIT_SPACING.half}px`;
    badge.style.borderRadius = `${GOFAKEIT_BORDER.radius}px`;
    badge.style.fontSize = `${GOFAKEIT_FONT.size}px`;
    badge.style.fontWeight = 'bold';
    badge.style.fontFamily = GOFAKEIT_FONT.family;
    badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    badge.style.pointerEvents = 'none';
    badge.style.userSelect = 'none';
    badge.style.transition = 'opacity 0.3s ease-in-out';
    badge.style.opacity = '0';
    badge.style.whiteSpace = 'nowrap';

    // Set colors based on type
    if (type === 'success') {
      badge.style.backgroundColor = GOFAKEIT_COLORS.primary;
      badge.style.color = GOFAKEIT_COLORS.text;
    } else {
      badge.style.backgroundColor = GOFAKEIT_COLORS.error;
      badge.style.color = GOFAKEIT_COLORS.white;
    }

    // Make the input field's parent container relative positioned if it isn't already
    const inputParent = el.element.parentElement;
    if (inputParent && getComputedStyle(inputParent).position === 'static') {
      inputParent.style.position = 'relative';
    }

    // Insert badge as sibling element right after the input
    el.element.parentNode?.insertBefore(badge, el.element.nextSibling);

    // Trigger animation
    requestAnimationFrame(() => {
      badge.style.opacity = '1';
    });

    // Auto-remove after duration with fade-out animation
    setTimeout(() => {
      this.removeBadge(el.id);
    }, this.settings.badges);
  }

  private removeBadge(autofillElementId: string): void {
    const existingBadge = document.getElementById(
      `gofakeit-badge-${autofillElementId}`
    );

    // If badge doesn't exist, return
    if (!existingBadge) {
      return;
    }

    // Trigger fade-out animation
    existingBadge.style.opacity = '0';

    // Remove element after animation completes
    setTimeout(() => {
      existingBadge.remove();
    }, 300); // Match the transition duration
  }

  // ============================================================================
  // PARAMETER GENERATION FUNCTIONS
  // ============================================================================

  private paramsSelect(
    element: HTMLSelectElement
  ): FetchFuncParams | undefined {
    const options = Array.from(element.options)
      .map(option => option.value)
      .filter(value => value !== ''); // Filter out empty values

    if (options.length > 0) {
      return {
        strs: options,
      };
    }
    return undefined;
  }

  private paramsRadio(
    radioGroup: AutofillElement[]
  ): FetchFuncParams | undefined {
    const values = radioGroup
      .map(el => (el.element as HTMLInputElement).value)
      .filter(value => value !== ''); // Filter out empty values

    if (values.length > 0) {
      return {
        strs: values,
      };
    }
    return undefined;
  }

  // ============================================================================
  // MISC UTILITY FUNCTIONS
  // ============================================================================

  // Debug logging function controlled by settings.debug
  private debug(type: 'warning' | 'error' | 'info', message: string): void {
    if (this.settings.debug) {
      const prefix = `[Gofakeit] ${type.toUpperCase()}:`;

      switch (type) {
        case 'error':
          console.error(prefix, message);
          break;
        case 'warning':
          console.warn(prefix, message);
          break;
        case 'info':
        default:
          console.log(prefix, message);
          break;
      }
    }
  }

  // Reset state to initial values - useful for testing
  public resetState(): void {
    this.state = {
      status: AutofillStatus.IDLE,
      elements: [],
    };
  }

  // Update status and trigger callback
  private updateStatus(status: AutofillStatus): void {
    this.state.status = status;
    if (this.settings.onStatusChange) {
      // Create a copy of state to prevent reference issues
      const stateCopy = { ...this.state, elements: [...this.state.elements] };
      this.settings.onStatusChange(status, stateCopy);
    }
  }

  private results(): Results {
    const successfulElements = this.state.elements.filter(
      element => element.value && !element.error
    );
    const failedElements = this.state.elements.filter(element => element.error);

    // Prepare results data for callback
    const resultsData: Results = {
      success: successfulElements.length,
      failed: failedElements.length,
      elements: this.state.elements,
    };

    this.debug('info', `\n🎯 Autofill Results Summary:`);
    this.debug('info', `   Total elements: ${this.state.elements.length}`);
    this.debug('info', `   Successful: ${successfulElements.length}`);
    this.debug('info', `   Failed: ${failedElements.length}`);

    // Show notification
    if (successfulElements.length > 0 && failedElements.length === 0) {
      this.debug(
        'warning',
        `Successfully generated data for ${successfulElements.length} fields!`
      );
    } else if (successfulElements.length > 0 && failedElements.length > 0) {
      this.debug(
        'warning',
        `Generated data for ${successfulElements.length} fields, ${failedElements.length} failed`
      );
    } else if (failedElements.length > 0) {
      this.debug(
        'error',
        `Failed to generate data for ${failedElements.length} fields`
      );
    } else {
      this.debug('warning', 'No fields were processed');
    }

    return resultsData;
  }

  // Date/Time generation helpers
  private generateTime(): string {
    const hours = Math.floor(Math.random() * 24)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private generateMonth(): string {
    const year = new Date().getFullYear();
    const month = Math.floor(Math.random() * 12) + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  }

  private generateWeek(): string {
    const year = new Date().getFullYear();
    const week = Math.floor(Math.random() * 52) + 1;
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  private generateDate(): string {
    const year = 2020 + Math.floor(Math.random() * 5);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  private generateDateTime(): string {
    const date = this.generateDate();
    const time = this.generateTime();
    return `${date}T${time}`;
  }
}
