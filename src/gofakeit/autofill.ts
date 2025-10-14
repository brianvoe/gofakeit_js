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
  STARTING = 'starting',
  FOUND = 'found',
  DETERMINED = 'determined',
  GENERATED = 'generated',
  SET = 'set',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface AutofillSettings {
  mode?: 'auto' | 'manual';
  stagger?: number;
  badges?: number;
  debug?: boolean;

  // Callbacks
  onStatusChange?: (
    status: AutofillStatus,
    elements: AutofillElement[]
  ) => void;
}

export interface AutofillState {
  status?: AutofillStatus;
  elements: AutofillElement[];
}

export interface AutofillElement {
  id: string; // id of the element
  name: string; // name of the element
  element: Element; // element to autofill
  type: string; // element type
  function: string; // function that will be used to autofill the element
  params?: Record<string, any>; // parameters for the function
  search: string[]; // search queries that will be used to autofill the element
  pattern?: string; // pattern of the element
  value: string; // value of the autofill result
  error: string; // error message
}

export interface AutofillResult {
  elements: AutofillElement[];
  error?: string;
}

export interface AutofillResults {
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
      elements: [],
    };
  }

  public updateSettings(settings: AutofillSettings): void {
    this.settings = { ...this.settings, ...settings };
  }

  // ============================================================================
  // MAIN FILL FUNCTION
  // ============================================================================

  async fill(
    target?: HTMLElement | Element | string,
    functionName?: string,
    params?: Record<string, any>
  ): Promise<AutofillResults> {
    this.state.elements = []; // Clear previous elements
    this.updateStatus(AutofillStatus.STARTING);

    // Step 1: Set all target elements based on the target parameter
    this.setElements(target);
    if (this.state.elements.length === 0) {
      this.debug('info', 'No form fields found to fill');
      this.updateStatus(AutofillStatus.COMPLETED);
      return this.results();
    }
    this.updateStatus(AutofillStatus.FOUND);

    // Step 2: Determine functions for elements that need search
    await this.setElementFunctions(functionName, params);
    this.updateStatus(AutofillStatus.DETERMINED);

    // Step 3: Get values for all elements via multi-function API
    await this.getElementValues();
    this.updateStatus(AutofillStatus.GENERATED);

    // Step 4: set values to the actual form elements
    await this.setElementValues();
    this.updateStatus(AutofillStatus.SET);

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
        search: this.getElementSearch(element),
        pattern: this.getElementPattern(element),
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

  private getElementPattern(element: Element): string {
    const pattern = element.getAttribute('pattern') || '';
    if (!pattern) {
      return '';
    }

    return pattern.replace(/\\\\/g, '\\');
  }

  // Get search query parts for an element
  public getElementSearch(el: Element): string[] {
    const queries: string[] = [];

    // Get label text from various sources (prioritized by relevance)
    const labelTexts: string[] = [];
    const id = el.id;

    // aria-labelledby (highest priority - explicit accessibility)
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
      labelledBy.split(/\s+/).forEach(ref => {
        const labelEl = document.getElementById(ref);
        if (labelEl && labelEl.textContent)
          labelTexts.push(labelEl.textContent);
      });
    }

    // explicit label[for] (high priority - semantic association)
    if (id) {
      const lbl = document.querySelector(
        'label[for="' + id.replace(/"/g, '\\"') + '"]'
      ) as HTMLLabelElement | null;
      if (lbl && lbl.textContent) labelTexts.push(lbl.textContent);
    }

    // implicit parent label (medium priority)
    const closestLabel = el.closest('label');
    if (closestLabel && closestLabel.textContent)
      labelTexts.push(closestLabel.textContent);

    // previous sibling label (lower priority)
    const prev = el.previousElementSibling as HTMLElement | null;
    if (prev && prev.tagName === 'LABEL' && prev.textContent)
      labelTexts.push(prev.textContent);

    // Add each label text as a separate query
    labelTexts.forEach(labelText => {
      if (labelText && labelText.trim()) {
        queries.push(labelText.trim().toLowerCase());
      }
    });

    // Get additional element attributes and add each as separate queries
    const type = el instanceof HTMLInputElement ? el.type.toLowerCase() : '';
    if (type && type.trim()) {
      queries.push(type);
    }

    const name = el.getAttribute('name') || '';
    if (name && name.trim()) {
      queries.push(name.toLowerCase());
    }

    const elementId = el.id || '';
    if (elementId && elementId.trim()) {
      queries.push(elementId.toLowerCase());
    }

    const placeholder =
      el instanceof HTMLInputElement ? el.placeholder || '' : '';
    if (placeholder && placeholder.trim()) {
      queries.push(placeholder.toLowerCase());
    }

    const autocomplete =
      el instanceof HTMLInputElement ? el.autocomplete || '' : '';
    if (autocomplete && autocomplete.trim()) {
      queries.push(autocomplete.toLowerCase());
    }

    const ariaLabel = el.getAttribute('aria-label') || '';
    if (ariaLabel && ariaLabel.trim()) {
      queries.push(ariaLabel.toLowerCase());
    }

    // Filter out empty queries and return
    return queries.filter(query => query && query.trim());
  }

  // ============================================================================
  // Step 2: Determine functions for elements that need search
  // ============================================================================

  public async setElementFunctions(
    functionOverride?: string,
    params?: Record<string, any>
  ): Promise<void> {
    this.debug(
      'info',
      `Determining functions for ${this.state.elements.length} elements`
    );

    // If function override is provided, apply it to all elements
    if (functionOverride) {
      this.debug('info', `Using function override: ${functionOverride}`);
      for (const el of this.state.elements) {
        el.function = functionOverride;
        if (params) {
          el.params = params;
        }
      }
      return;
    }

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

      // Create search requests using separate query parts
      const searchRequests: FetchFuncSearchRequest[] =
        elementsNeedingSearch.map((el, index) => {
          return {
            id:
              el.element.id ||
              el.element.getAttribute('name') ||
              `input_${index}`,
            queries: el.search,
          };
        });

      const response = await fetchFuncSearch(searchRequests);

      if (response.results && !response.error) {
        // Handle both single object and array responses
        const searchResults = Array.isArray(response.results)
          ? response.results
          : [response.results];

        // Map results back to elements - use first result regardless of score
        for (
          let i = 0;
          i < searchResults.length && i < elementsNeedingSearch.length;
          i++
        ) {
          const searchResult = searchResults[i];
          const el = elementsNeedingSearch[i];

          if (searchResult.results && searchResult.results.length > 0) {
            // Use the first result, not based on score
            el.function = searchResult.results[0].name;
          } else {
            // Fallback to type-specific function if no search results
            el.function = this.getElementFunctionFallback(el.element);
          }
        }

        // If we have more elements than search results, use fallback for remaining elements
        for (
          let i = searchResults.length;
          i < elementsNeedingSearch.length;
          i++
        ) {
          elementsNeedingSearch[i].function = this.getElementFunctionFallback(
            elementsNeedingSearch[i].element
          );
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
    const pattern = this.getElementPattern(element);
    const elementType = this.getElementType(element);

    // If the fuction has a value and it's not 'true', use it directly
    if (gofakeitFunc && gofakeitFunc !== 'true') {
      // Specific function provided - use it directly
      return gofakeitFunc;
    } else if (pattern && pattern.trim() !== '') {
      return 'regex';
    } else {
      // No function specified - check if element type needs search
      const needsSearch = this.elementTypeNeedsSearch(elementType);

      if (needsSearch) {
        // Element type needs search - return null
        return null;
      } else {
        // Element type doesn't need search - use fallback function
        return this.getElementFunctionFallback(element);
      }
    }
  }

  private elementTypeNeedsSearch(elementType: string): boolean {
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
      'color',
    ];
    return !skipSearchTypes.includes(elementType);
  }

  // If the element doesnt have a function and search doesnt return a function,
  // we will use a fallback function
  private getElementFunctionFallback(element: Element): string {
    if (element instanceof HTMLInputElement) {
      const elementType = element.type.toLowerCase();

      switch (elementType) {
        case 'date':
        case 'datetime-local':
        case 'month':
        case 'week': {
          // Check if input has min/max attributes to determine if it should use daterange
          const min = element.getAttribute('min');
          const max = element.getAttribute('max');
          return min || max ? 'daterange' : 'date';
        }
        case 'time':
          return 'time';
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
        case 'range': {
          // Check if input has min/max attributes to determine if it should use number with parameters
          const min = element.getAttribute('min');
          const max = element.getAttribute('max');
          return min || max ? 'number' : 'number'; // Both use 'number' function, but with different parameters
        }
        case 'color':
          return 'hexcolor';
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
    const requestToElementMap: AutofillElement[] = []; // Map requests to elements

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

      // Use custom params if provided, otherwise use default parameter logic
      if (el.params) {
        request.params = el.params;
      } else if (el.function === 'regex') {
        request.params = { lang: 'js', str: el.pattern || '' };
      } else {
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
          case 'date':
          case 'datetime-local':
          case 'month': {
            const params = this.paramsDate(el);
            if (params && (params.startdate || params.enddate)) {
              request.func = 'daterange';
              request.params = params;
            } else {
              request.params = params;
            }
            break;
          }
          case 'time': {
            // For time inputs, use 'time' function with format
            request.params = { format: 'HH:mm' };
            break;
          }
          case 'week': {
            const params = this.paramsWeek(el);
            if (params && (params.startdate || params.enddate)) {
              request.func = 'daterange';
              request.params = params;
            } else {
              request.func = 'date';
              request.params = params;
            }
            break;
          }
          case 'number':
          case 'range': {
            const params = this.paramsNumber(el);
            request.params = params;
            break;
          }
          // Add other element type cases here as needed
          default:
            // No special parameters needed
            break;
        }
      }

      requests.push(request);
      requestToElementMap.push(el);
    }

    const response = await fetchFuncMulti(requests);

    if (response.results && !response.error) {
      // Map results back to elements using the correct mapping
      for (let i = 0; i < response.results.length; i++) {
        const result = response.results[i];
        const el = requestToElementMap[i];

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
        this.showBadge(elementToShowBadge);
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
    const selectedRadio = radioGroup.find(radioEl => {
      const input = radioEl.element as HTMLInputElement;

      // Check if the value attribute is explicitly set
      const hasExplicitValue = input.hasAttribute('value');

      // First try to match by value attribute if it's explicitly set or not the default "on"
      if (
        (hasExplicitValue || input.value !== 'on') &&
        input.value === el.value
      ) {
        return true;
      }

      // If value is "on" (default) or no match, try to match by label text
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label && label.textContent && label.textContent.trim() === el.value) {
        return true;
      }

      // Final fallback: match by id
      if (input.id === el.value) {
        return true;
      }

      return false;
    });

    if (selectedRadio && !selectedRadio.error) {
      // Uncheck all radios in the same group first
      const radioName = (selectedRadio.element as HTMLInputElement).name;
      if (radioName) {
        const otherRadios = document.querySelectorAll(
          `input[type="radio"][name="${radioName}"]`
        );
        otherRadios.forEach(radio => {
          (radio as HTMLInputElement).checked = false;
        });
      }

      // Check the selected radio button
      (selectedRadio.element as HTMLInputElement).checked = true;
      (selectedRadio.element as HTMLInputElement).dispatchEvent(
        new Event('change', { bubbles: true })
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
        case 'date':
        case 'time':
        case 'datetime-local':
        case 'month':
        case 'color':
          this.setGeneralValue(element, el.value);
          break;
        case 'week':
          // Convert date value to week format
          this.setGeneralValue(element, this.convertDateToWeek(el.value));
          break;
        default:
          this.setGeneralValue(element, el.value);
      }
    } else if (element instanceof HTMLTextAreaElement) {
      this.setGeneralValue(element, el.value);
    } else if (element instanceof HTMLSelectElement) {
      this.setSelectValue(element, el.value);
    }
  }

  // ============================================================================
  // ELEMENT TYPE SPECIFIC FUNCTIONS
  // ============================================================================

  private setGeneralValue(
    element: HTMLInputElement | HTMLTextAreaElement,
    value: string
  ): void {
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

  private showBadge(el: AutofillElement): void {
    // Remove any existing badge for this element
    this.removeBadge(el.id);

    // Create badge element with optimized styling
    const badge = document.createElement('div');
    badge.id = `gofakeit-badge-${el.id}`;
    const isError = Boolean(el.error && el.error.trim() !== '');
    badge.textContent = isError ? el.error : el.function;

    // Batch all style changes to minimize reflows
    const badgeStyles = {
      position: 'fixed',
      zIndex: '999999',
      padding: `${GOFAKEIT_SPACING.quarter}px ${GOFAKEIT_SPACING.half}px`,
      borderRadius: `${GOFAKEIT_BORDER.radius}px`,
      fontSize: `${GOFAKEIT_FONT.size}px`,
      fontWeight: 'bold',
      fontFamily: GOFAKEIT_FONT.family,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      pointerEvents: 'none',
      userSelect: 'none',
      transition: 'opacity var(--timing) ease-in-out',
      opacity: '0',
      whiteSpace: 'nowrap',
      backgroundColor: isError
        ? GOFAKEIT_COLORS.error
        : GOFAKEIT_COLORS.primary,
      color: isError ? GOFAKEIT_COLORS.white : GOFAKEIT_COLORS.text,
    };

    // Apply all styles at once
    Object.assign(badge.style, badgeStyles);

    // Append badge to body
    document.body.appendChild(badge);

    // Performance optimizations
    let lastRect: DOMRect | null = null;
    let animationId: number | null = null;
    let isVisible = true;
    let lastVisibilityCheck = 0;
    const VISIBILITY_CHECK_INTERVAL = 100; // Check visibility every 100ms instead of every frame

    // Cache scrollable parents to avoid repeated DOM traversal
    const scrollableParents = this.getScrollableParents(el.element);
    const parentRects = new Map<Element, DOMRect>();

    // Function to check if element is visible (optimized)
    const checkElementVisibility = (element: Element): boolean => {
      const rect = element.getBoundingClientRect();

      // Quick window viewport check first
      if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom > window.innerHeight ||
        rect.right > window.innerWidth
      ) {
        return false;
      }

      // Check cached scrollable parents
      for (const parent of scrollableParents) {
        let parentRect = parentRects.get(parent);
        if (!parentRect) {
          parentRect = parent.getBoundingClientRect();
          parentRects.set(parent, parentRect);
        }

        // Check if element is within parent bounds
        if (
          rect.top < parentRect.top ||
          rect.left < parentRect.left ||
          rect.bottom > parentRect.bottom ||
          rect.right > parentRect.right
        ) {
          return false;
        }
      }

      return true;
    };

    // Optimized position update function
    const updateBadgePosition = () => {
      const rect = el.element.getBoundingClientRect();

      // Check if element has moved (position or size changed)
      const hasMoved =
        !lastRect ||
        rect.top !== lastRect.top ||
        rect.left !== lastRect.left ||
        rect.width !== lastRect.width ||
        rect.height !== lastRect.height;

      if (hasMoved) {
        lastRect = rect;

        // Only check visibility periodically to reduce DOM queries
        const now = performance.now();
        if (now - lastVisibilityCheck > VISIBILITY_CHECK_INTERVAL) {
          isVisible = checkElementVisibility(el.element);
          lastVisibilityCheck = now;
          // Clear parent rects cache periodically
          parentRects.clear();
        }

        if (isVisible) {
          // Position badge above the element
          const top = rect.top - 30; // Offset based upon badge size
          const left = rect.left;

          // Batch style updates to minimize reflows
          badge.style.cssText += `top:${top}px;left:${left}px;display:block;`;
        } else {
          // Hide badge if element is not visible
          badge.style.display = 'none';
        }
      }

      // Continue the animation loop
      animationId = requestAnimationFrame(updateBadgePosition);
    };

    // Start the position tracking loop
    updateBadgePosition();

    // Store animation ID for cleanup
    (badge as any)._animationId = animationId;

    // Trigger fade-in animation
    requestAnimationFrame(() => {
      badge.style.opacity = '1';
    });

    // Auto-remove after duration with fade-out animation
    setTimeout(() => {
      this.removeBadge(el.id);
    }, this.settings.badges);
  }

  // Helper method to cache scrollable parents
  private getScrollableParents(element: Element): Element[] {
    const scrollableParents: Element[] = [];
    let parent = element.parentElement;

    while (parent && parent !== document.body) {
      const style = getComputedStyle(parent);
      const overflow = style.overflow + style.overflowY + style.overflowX;

      if (overflow.includes('scroll') || overflow.includes('auto')) {
        scrollableParents.push(parent);
      }

      parent = parent.parentElement;
    }

    return scrollableParents;
  }

  private removeBadge(autofillElementId: string): void {
    const existingBadge = document.getElementById(
      `gofakeit-badge-${autofillElementId}`
    );

    // If badge doesn't exist, return
    if (!existingBadge) {
      return;
    }

    // Clean up animation frame immediately
    const animationId = (existingBadge as any)._animationId;
    if (animationId) {
      cancelAnimationFrame(animationId);
      (existingBadge as any)._animationId = null; // Clear reference
    }

    // Trigger fade-out animation
    existingBadge.style.opacity = '0';

    // Remove element after animation completes
    setTimeout(() => {
      // Double-check badge still exists before removing
      if (existingBadge.parentNode) {
        existingBadge.remove();
      }
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
      .map(el => {
        const input = el.element as HTMLInputElement;

        // Check if the value attribute is explicitly set
        const hasExplicitValue = input.hasAttribute('value');

        // Use value attribute if it's explicitly set or if it's not the default "on"
        if (
          hasExplicitValue ||
          (input.value && input.value.trim() !== '' && input.value !== 'on')
        ) {
          return input.value;
        }

        // Fallback to label text
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && label.textContent) {
          return label.textContent.trim();
        }

        // Final fallback to id
        return input.id;
      })
      .filter(value => value !== ''); // Filter out empty values

    if (values.length > 0) {
      return {
        strs: values,
      };
    }
    return undefined;
  }

  private convertDateToWeek(dateValue: string): string {
    // Convert date string (yyyy-MM-dd) to week format (yyyy-Www)
    try {
      const date = new Date(dateValue + 'T00:00:00');
      const year = date.getFullYear();

      // Get the week number using ISO week calculation
      const startOfYear = new Date(year, 0, 1);
      const days = Math.floor(
        (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
      );
      const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

      // Format as yyyy-Www (with leading zero for week number)
      return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
    } catch (error) {
      // If conversion fails, return a default week value
      const currentYear = new Date().getFullYear();
      return `${currentYear}-W01`;
    }
  }

  private convertWeekToDate(weekValue: string): string {
    // Convert week format (yyyy-Www) to date format (yyyy-MM-dd)
    try {
      const match = weekValue.match(/^(\d{4})-W(\d{2})$/);
      if (!match) {
        throw new Error('Invalid week format');
      }

      const year = parseInt(match[1]);
      const week = parseInt(match[2]);

      // Calculate the date for the first day of the week
      const jan1 = new Date(year, 0, 1);
      const daysToAdd = (week - 1) * 7;
      const targetDate = new Date(
        jan1.getTime() + daysToAdd * 24 * 60 * 60 * 1000
      );

      // Format as yyyy-MM-dd
      const month = (targetDate.getMonth() + 1).toString().padStart(2, '0');
      const day = targetDate.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      // If conversion fails, return a default date
      const currentYear = new Date().getFullYear();
      return `${currentYear}-01-01`;
    }
  }

  private paramsDate(el: AutofillElement): FetchFuncParams | undefined {
    const input = el.element as HTMLInputElement;
    const min = input.getAttribute('min');
    const max = input.getAttribute('max');

    // Determine format based on input type
    let format: string;
    switch (el.type) {
      case 'datetime-local':
        format = 'yyyy-MM-ddTHH:mm';
        break;
      case 'month':
        format = 'yyyy-MM';
        break;
      case 'date':
      default:
        format = 'yyyy-MM-dd';
        break;
    }

    const params: any = {
      format: format,
    };

    // If no min/max attributes, return just format
    if (!min && !max) {
      return params;
    }

    // Set startdate (min) or allow api to use default
    if (min) {
      params.startdate = min;
    }

    // Set enddate (max) or allow api to use default
    if (max) {
      params.enddate = max;
    }

    return params;
  }

  private paramsWeek(el: AutofillElement): FetchFuncParams {
    const input = el.element as HTMLInputElement;
    const min = input.getAttribute('min');
    const max = input.getAttribute('max');

    const params: any = {
      format: 'yyyy-MM-dd', // Week inputs use date format for API calls
    };

    // Convert week format min/max attributes to date format for API
    if (min) {
      params.startdate = this.convertWeekToDate(min);
    }

    if (max) {
      params.enddate = this.convertWeekToDate(max);
    }

    return params;
  }

  private paramsNumber(el: AutofillElement): FetchFuncParams {
    const input = el.element as HTMLInputElement;
    const min = input.getAttribute('min');
    const max = input.getAttribute('max');

    const params: any = {};

    if (min) {
      params.min = parseInt(min, 10);
    }
    if (max) {
      params.max = parseInt(max, 10);
    }
    return params;
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
      elements: [],
    };
  }

  // Update status and trigger callback
  private updateStatus(status: AutofillStatus): void {
    this.state.status = status;
    if (this.settings.onStatusChange) {
      // Create a copy of elements to prevent reference issues
      const elementsCopy = [...this.state.elements];
      this.settings.onStatusChange(status, elementsCopy);
    }
  }

  private results(): AutofillResults {
    const successfulElements = this.state.elements.filter(
      element => element.value && !element.error
    );
    const failedElements = this.state.elements.filter(element => element.error);

    // Prepare results data for callback
    const resultsData: AutofillResults = {
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
}
