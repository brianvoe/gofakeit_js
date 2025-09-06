import {
  fetchFuncMulti,
  FetchFuncMultiRequest,
  fetchFuncSearch,
  FetchFuncSearchRequest,
} from './api';

export interface AutofillSettings {
  mode?: 'auto' | 'manual';
  staggered?: boolean;
  staggerDelay?: number;
  onStatusChange?: (status: string, state: AutofillState) => void;
}

export interface AutofillState {
  status: string;
  inputs: AutofillElement[];
}

export interface AutofillElement {
  id: string; // id of the element
  element: Element; // element to autofill
  type: string; // input type
  function: string; // function that will be used to autofill the input
  search: string; // search query that will be used to autofill the input
  value: string; // value of the autofill result
  error: string; // error message
}

export interface AutofillResult {
  elements: AutofillElement[];
  error?: string;
}

export class Autofill {
  public settings: AutofillSettings;
  public state: AutofillState;

  constructor(settings: AutofillSettings = {}) {
    this.settings = {
      mode: 'auto',
      staggered: true,
      staggerDelay: 50,
      ...settings,
    };

    this.state = {
      status: 'idle',
      inputs: [],
    };
  }

  // ============================================================================
  // MAIN AUTOFILL FUNCTION
  // ============================================================================

  async autofill(
    target?: HTMLElement | Element | string
  ): Promise<boolean | void> {
    this.updateStatus('starting');
    this.state.inputs = []; // Clear previous inputs

    // Step 1: Get all target elements based on the target parameter
    const { elements, error } = this.getElements(target);

    if (error) {
      console.warn(`[Gofakeit] ${error}`);
      this.showNotification(error, 'error');
      this.updateStatus('error');
      return false;
    }

    if (elements.length === 0) {
      this.showNotification('No form fields found to autofill', 'info');
      // Only set to idle if we're not already in error state
      if (this.state.status !== 'error') {
        this.updateStatus('idle');
      }
      return false;
    }

    this.state.inputs = elements;

    console.log(
      `[Gofakeit] Found ${elements.length} elements to generate data for`
    );
    this.showNotification(
      `Starting data generation for ${elements.length} fields...`,
      'info'
    );

    // Step 2: Determine functions for inputs that need search
    await this.setElementFunctions();
    this.updateStatus('determining_functions');

    // Step 3: Get values for all inputs via multi-function API
    await this.getElementValues();
    this.updateStatus('getting_values');

    // Step 4: set values to the actual form elements
    await this.setElementValues();
    this.updateStatus('setting_values');

    this.updateStatus('completed');
    return true;
  }

  // ============================================================================
  // Step 1: Get all target elements based on the target parameter
  // ============================================================================

  // Public method to get form elements based on target parameter
  public getElements(target?: HTMLElement | Element | string): AutofillResult {
    // Step 1: Determine the search scope
    let searchScope: HTMLElement | Document = document;

    if (target) {
      if (typeof target === 'string') {
        const elements = document.querySelectorAll(target);
        if (elements.length === 0) {
          return {
            elements: [],
            error: `No element found with selector: "${target}"`,
          };
        }
        // Use the first element as the search scope
        searchScope = elements[0] as HTMLElement;
      } else if (target instanceof HTMLElement || target instanceof Element) {
        searchScope = target as HTMLElement;
      }
    }

    // Step 2: Find all form elements within the search scope
    const selector = 'input, textarea, select';
    const nodeList = searchScope.querySelectorAll(selector);
    const allFormElements: Element[] = [];

    nodeList.forEach(el => {
      // Skip hidden, disabled, or readonly elements
      if (el instanceof HTMLInputElement) {
        if (el.type === 'hidden' || el.disabled || el.readOnly) return;
      } else if (el instanceof HTMLTextAreaElement) {
        if (el.disabled || el.readOnly) return;
      } else if (el instanceof HTMLSelectElement) {
        if (el.disabled) return;
      }

      allFormElements.push(el);
    });

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
      autofillElements.push({
        id: this.getElementId(element),
        element,
        type: this.getElementType(element),
        function: '',
        search: this.getElementSearch(element as HTMLInputElement),
        value: '',
        error: '',
      });
    }

    return { elements: autofillElements };
  }

  private getElementId(element: Element): string {
    return element.id || element.getAttribute('name') || '';
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

  // Get the comprehensive search string for an input element
  private getElementSearch(input: Element): string {
    // Get label text from various sources
    const labelTexts: string[] = [];
    const id = input.id;

    // aria-labelledby
    const labelledBy = input.getAttribute('aria-labelledby');
    if (labelledBy) {
      labelledBy.split(/\s+/).forEach(ref => {
        const el = document.getElementById(ref);
        if (el && el.textContent) labelTexts.push(el.textContent);
      });
    }

    // explicit label[for]
    if (id) {
      try {
        const lbl = document.querySelector(
          'label[for="' + id.replace(/"/g, '\\"') + '"]'
        ) as HTMLLabelElement | null;
        if (lbl && lbl.textContent) labelTexts.push(lbl.textContent);
      } catch {
        /* ignore */
      }
    }

    // implicit parent label
    const closestLabel = input.closest('label');
    if (closestLabel && closestLabel.textContent)
      labelTexts.push(closestLabel.textContent);

    // previous sibling label (common in some UIs)
    const prev = input.previousElementSibling as HTMLElement | null;
    if (prev && prev.tagName === 'LABEL' && prev.textContent)
      labelTexts.push(prev.textContent);

    const labelText = labelTexts.join(' ').toLowerCase();

    // Get additional element attributes for comprehensive search
    const type =
      input instanceof HTMLInputElement ? input.type.toLowerCase() : '';
    const name = (input.getAttribute('name') || '').toLowerCase();
    const inputId = (input.id || '').toLowerCase();
    const placeholder =
      input instanceof HTMLInputElement
        ? (input.placeholder || '').toLowerCase()
        : '';
    const autocomplete =
      input instanceof HTMLInputElement
        ? (input.autocomplete || '').toLowerCase()
        : '';
    const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();

    // Build a comprehensive search query with all available information
    const queryParts = [
      type,
      name,
      inputId,
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

    return searchQuery || 'text input';
  }

  // ============================================================================
  // Step 2: Determine functions for inputs that need search
  // ============================================================================

  private async setElementFunctions(): Promise<void> {
    console.log(
      `[Gofakeit] Determining functions for ${this.state.inputs.length} inputs`
    );

    // Step 1: Loop through inputs and set functions for types that don't need search
    const inputsNeedingSearch: AutofillElement[] = [];

    for (const input of this.state.inputs) {
      const functionName = this.getElementFunction(input.element);

      if (functionName !== null) {
        // Function determined - use it directly
        input.function = functionName;
      } else {
        // Function needs search - add to search array
        inputsNeedingSearch.push(input);
      }
    }

    // Step 2: Handle inputs that need search
    if (inputsNeedingSearch.length > 0) {
      console.log(
        `[Gofakeit] ${inputsNeedingSearch.length} inputs need function search`
      );

      // Create search requests using existing search values from state
      const searchRequests: FetchFuncSearchRequest[] = inputsNeedingSearch.map(
        (input, index) => {
          return {
            id:
              input.element.id ||
              input.element.getAttribute('name') ||
              `input_${index}`,
            query: input.search,
          };
        }
      );

      try {
        const response = await fetchFuncSearch(searchRequests);

        if (response.success && response.data) {
          // Map results back to inputs - use first result regardless of score
          for (let i = 0; i < response.data.length; i++) {
            const searchResult = response.data[i];
            const input = inputsNeedingSearch[i];

            if (searchResult.results && searchResult.results.length > 0) {
              // Use the first result, not based on score
              input.function = searchResult.results[0].name;
            } else {
              // Fallback to type-specific function if no search results
              input.function = this.getElementFunctionFallback(input.element);
            }
          }
        } else {
          // Fallback to type-specific functions if search fails
          for (const input of inputsNeedingSearch) {
            input.function = this.getElementFunctionFallback(input.element);
          }
        }
      } catch (error) {
        console.warn(
          '[Gofakeit] Function search failed, using fallback functions:',
          error
        );
        // Fallback to type-specific functions for all inputs
        for (const input of inputsNeedingSearch) {
          input.function = this.getElementFunctionFallback(input.element);
        }
      }
    }

    console.log('[Gofakeit] Function determination complete');
  }

  private getElementFunction(element: Element): string | null {
    const gofakeitFunc = element.getAttribute('data-gofakeit');
    const inputType = this.getElementType(element);

    if (gofakeitFunc && gofakeitFunc !== 'true') {
      // Specific function provided - use it directly
      return gofakeitFunc;
    } else if (gofakeitFunc === 'true') {
      // Function is 'true' - needs search
      return null;
    } else {
      // No function specified - check if input type needs search
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
      const needsSearch = !skipSearchTypes.includes(inputType);

      if (needsSearch) {
        // Input type needs search - return null
        return null;
      } else {
        // Input type doesn't need search - use fallback function
        return this.getElementFunctionFallback(element);
      }
    }
  }

  // If the element doesnt have a function and search doesnt return a function,
  // we will use a fallback function
  private getElementFunctionFallback(element: Element): string {
    if (element instanceof HTMLInputElement) {
      const inputType = element.type.toLowerCase();

      switch (inputType) {
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
          return 'bool';
        default:
          return 'word';
      }
    } else if (element instanceof HTMLTextAreaElement) {
      return 'sentence';
    } else if (element instanceof HTMLSelectElement) {
      // TODO: We need to defautl to random string but we need to figure
      // out how to set all the params for the multi request
      return 'bool';
    }

    return 'word';
  }

  // ============================================================================
  // Step 3: Get values for all inputs via multi-function API
  // ============================================================================

  // Get values for all inputs via multi-function API
  private async getElementValues(): Promise<void> {
    const inputsNeedingValues = this.state.inputs.filter(
      input => input.function && !input.error
    );

    if (inputsNeedingValues.length === 0) {
      console.log('[Gofakeit] No inputs need value generation');
      return;
    }

    console.log(
      `[Gofakeit] Getting values for ${inputsNeedingValues.length} inputs from API`
    );

    const requests: FetchFuncMultiRequest[] = inputsNeedingValues.map(
      input => ({
        id: input.id,
        func: input.function,
      })
    );

    try {
      const response = await fetchFuncMulti(requests);

      if (response.success && response.data) {
        // Map results back to inputs
        for (let i = 0; i < response.data.length; i++) {
          const result = response.data[i];
          const input = inputsNeedingValues[i];

          if (result.success && result.data) {
            input.value = result.data;
          } else {
            input.error = result.error || 'Unknown API error';
          }
        }
      } else {
        // Set error for all inputs if the request failed
        for (const input of inputsNeedingValues) {
          input.error = response.error || 'API request failed';
        }
      }
    } catch (error) {
      console.error('[Gofakeit] API call failed:', error);
      // Set error for all inputs
      for (const input of inputsNeedingValues) {
        input.error = `API call failed: ${error}`;
      }
    }

    console.log('[Gofakeit] Value generation complete');
  }

  // ============================================================================
  // Step 4: Set values to the actual form elements
  // ============================================================================

  // Set values to the actual form elements
  private async setElementValues(): Promise<void> {
    const inputsToApply = this.state.inputs.filter(
      input => input.value !== undefined && input.value !== null && !input.error
    );

    if (inputsToApply.length === 0) {
      console.log('[Gofakeit] No inputs to apply values to');
      return;
    }

    console.log(`[Gofakeit] Applying values to ${inputsToApply.length} inputs`);

    // Apply values with optional staggering
    if (
      this.settings.staggered &&
      this.settings.staggerDelay &&
      this.settings.staggerDelay > 0
    ) {
      for (let i = 0; i < inputsToApply.length; i++) {
        const input = inputsToApply[i];
        this.setInputValue(input);

        // Add delay between applications (except for the last one)
        if (i < inputsToApply.length - 1) {
          await new Promise(resolve =>
            setTimeout(resolve, this.settings.staggerDelay)
          );
        }
      }
    } else {
      // Apply all values at once
      for (const input of inputsToApply) {
        this.setInputValue(input);
      }
    }

    console.log('[Gofakeit] Value application complete');
    this.showDetailedResults();
  }

  private setInputValue(input: AutofillElement): void {
    try {
      const element = input.element;

      if (element instanceof HTMLInputElement) {
        const inputType = element.type.toLowerCase();

        switch (inputType) {
          case 'checkbox':
            this.setCheckboxValue(element, input.value);
            break;
          case 'radio':
            this.setRadioValue(element, input.value);
            break;
          case 'number':
          case 'range':
            this.setNumberValue(element, input.value);
            break;
          case 'date':
          case 'time':
          case 'datetime-local':
          case 'month':
          case 'week':
            this.setDateTimeValue(element, input.value);
            break;
          default:
            this.setTextValue(element, input.value);
        }
      } else if (element instanceof HTMLTextAreaElement) {
        this.setTextareaValue(element, input.value);
      } else if (element instanceof HTMLSelectElement) {
        this.setSelectValue(element, input.value);
      }
    } catch (error) {
      input.error = `Value application failed: ${error}`;
    }
  }

  // ============================================================================
  // INPUT TYPE SPECIFIC FUNCTIONS
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

  // ============================================================================
  // MISC UTILITY FUNCTIONS
  // ============================================================================

  // Update status and trigger callback
  private updateStatus(status: string): void {
    this.state.status = status;
    if (this.settings.onStatusChange) {
      // Create a copy of state to prevent reference issues
      const stateCopy = { ...this.state, inputs: [...this.state.inputs] };
      this.settings.onStatusChange(status, stateCopy);
    }
  }

  // Simple notification function (can be overridden by the consuming application)
  private showNotification(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ): void {
    console.log(`[Gofakeit] ${type.toUpperCase()}: ${message}`);
  }

  private showDetailedResults(): void {
    const successfulInputs = this.state.inputs.filter(
      input => input.value && !input.error
    );
    const failedInputs = this.state.inputs.filter(input => input.error);

    console.log(`\n🎯 Autofill Results Summary:`);
    console.log(`   Total inputs: ${this.state.inputs.length}`);
    console.log(`   Successful: ${successfulInputs.length}`);
    console.log(`   Failed: ${failedInputs.length}`);

    if (successfulInputs.length > 0) {
      console.log(`\n📋 Successful Fields:`);
      successfulInputs.forEach((input, index) => {
        const elementInfo = this.getElementInfo(input.element);
        console.log(
          `  ${index + 1}. ${elementInfo} → ${input.function} → "${input.value}"`
        );
      });
    }

    if (failedInputs.length > 0) {
      console.log(`\n⚠️ Failed Fields:`);
      failedInputs.forEach((input, index) => {
        const elementInfo = this.getElementInfo(input.element);
        console.log(
          `  ${index + 1}. ${elementInfo} → ${input.function} → ERROR: ${input.error}`
        );
      });
    }

    // Show notification
    if (successfulInputs.length > 0 && failedInputs.length === 0) {
      this.showNotification(
        `Successfully generated data for ${successfulInputs.length} fields!`,
        'success'
      );
    } else if (successfulInputs.length > 0 && failedInputs.length > 0) {
      this.showNotification(
        `Generated data for ${successfulInputs.length} fields, ${failedInputs.length} failed`,
        'info'
      );
    } else if (failedInputs.length > 0) {
      this.showNotification(
        `Failed to generate data for ${failedInputs.length} fields`,
        'error'
      );
    } else {
      this.showNotification('No fields were processed', 'info');
    }
  }

  // Get a descriptive string for an element
  private getElementInfo(element: Element): string {
    const tagName = element.tagName.toLowerCase();
    const type = element instanceof HTMLInputElement ? element.type : '';
    const id = element.id ? `#${element.id}` : '';
    const name = element.getAttribute('name')
      ? `[name="${element.getAttribute('name')}"]`
      : '';
    const className = element.className
      ? `.${element.className.split(' ').join('.')}`
      : '';

    return `${tagName}${type ? `[type="${type}"]` : ''}${id}${name}${className}`;
  }

  public handleError(element: Element, error: string): void {
    console.error(
      `[Gofakeit] Error for element ${this.getElementInfo(element)}:`,
      error
    );

    // Find the corresponding input in state and set error
    const input = this.state.inputs.find(input => input.element === element);
    if (input) {
      input.error = error;
    }
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
