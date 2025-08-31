import { callFunc } from './api';
import { handleError } from './autofill';

// Handle checkbox input elements
export async function handleCheckbox(element: HTMLInputElement, gofakeitFunc: string, value?: string): Promise<{ success: boolean, usedFunc: string }> {
  // Find the checkbox group by name
  const checkboxGroup = findCheckboxGroup(element);
  
  if (checkboxGroup.length === 0) {
    console.warn('[Gofakeit Autofill] No checkbox group found for element:', element);
    return { success: false, usedFunc: 'bool' };
  }
  
  // Use boolean function if 'true' is passed, otherwise use the provided function
  const functionToCall = gofakeitFunc === 'true' ? 'bool' : gofakeitFunc;
  
  // If value is provided (from batch), use it directly
  if (value !== undefined) {
    // Clear all checkboxes first
    checkboxGroup.forEach(cb => {
      cb.checked = false;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // For boolean values, check if it's true
    const boolValue = String(value).toLowerCase() === 'true' || value === '1' || String(value).toLowerCase() === 'yes';
    if (boolValue && checkboxGroup.length > 0) {
      // Select the first checkbox if value is true
      checkboxGroup[0].checked = true;
      checkboxGroup[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    return { success: true, usedFunc: functionToCall };
  }
  
  // For checkbox groups, we want to select multiple checkboxes
  if (gofakeitFunc === 'true') {
    // Select roughly half of the checkboxes in the group
    const numToSelect = Math.max(1, Math.ceil(checkboxGroup.length / 2));
    
    // Clear all checkboxes first
    checkboxGroup.forEach(cb => {
      cb.checked = false;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Select random checkboxes using API
    const selectedIndices = new Set<number>();
    for (let i = 0; i < numToSelect; i++) {
      const boolResponse = await callFunc('bool');
      if (boolResponse.success) {
        const shouldSelect = boolResponse.data!.toLowerCase() === 'true' || boolResponse.data!.toLowerCase() === '1';
        if (shouldSelect) {
          // Find an unselected checkbox
          const availableIndices = Array.from({ length: checkboxGroup.length }, (_, i) => i)
            .filter(i => !selectedIndices.has(i));
          
          if (availableIndices.length > 0) {
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            selectedIndices.add(randomIndex);
            checkboxGroup[randomIndex].checked = true;
            checkboxGroup[randomIndex].dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    }
  } else {
    // For custom functions, use the response to determine which checkboxes to select
    const response = await callFunc(functionToCall);
    
    if (!response.success) {
      console.warn(`[Gofakeit Autofill] Error for function ${functionToCall}:`, response.error);
      
      if (response.status === 400) {
        handleError(element, '', functionToCall);
      }
      return { success: false, usedFunc: functionToCall };
    }
    
    // Clear all checkboxes first
    checkboxGroup.forEach(cb => {
      cb.checked = false;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Parse the response to determine which checkboxes to select
    const values = response.data!.split(',').map(v => v.trim());
    
    checkboxGroup.forEach((cb, index) => {
      const shouldCheck = values.includes(cb.value) || values.includes(index.toString());
      cb.checked = shouldCheck;
      cb.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  
  return { success: true, usedFunc: functionToCall };
}

// Handle radio inputs
export async function handleRadio(element: HTMLInputElement, gofakeitFunc: string, value?: string): Promise<{ success: boolean, usedFunc: string, selectedElement?: HTMLInputElement }> {
  const radioGroup = findRadioGroup(element);
  // For radio buttons, when 'true' is passed, we actually use 'bool' function
  const functionToCall = gofakeitFunc === 'true' ? 'bool' : gofakeitFunc;
  
  // If a specific value is provided, try to select that radio button
  if (value !== undefined) {
    // Clear all radio buttons first
    radioGroup.forEach((rb: HTMLInputElement) => {
      rb.checked = false;
      rb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Try to find by value first, then by index
    let selectedRadio = radioGroup.find((rb: HTMLInputElement) => rb.value === value);
    if (!selectedRadio && !isNaN(Number(value))) {
      const index = parseInt(value);
      if (index >= 0 && index < radioGroup.length) {
        selectedRadio = radioGroup[index];
      }
    }
    
    // If no match found, select the first one
    if (selectedRadio) {
      selectedRadio.checked = true;
      selectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    return { success: true, usedFunc: functionToCall, selectedElement: selectedRadio };
  }
  
  // For radio groups, we want to select exactly one radio button
  if (gofakeitFunc === 'true') {
    // Clear all radio buttons first
    radioGroup.forEach((rb: HTMLInputElement) => {
      rb.checked = false;
      rb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Always select exactly one random radio button
    const randomIndex = Math.floor(Math.random() * radioGroup.length);
    radioGroup[randomIndex].checked = true;
    radioGroup[randomIndex].dispatchEvent(new Event('change', { bubbles: true }));
    
    return { success: true, usedFunc: functionToCall, selectedElement: radioGroup[randomIndex] };
  } else {
    // For custom functions, use the response to determine which radio button to select
    const response = await callFunc(functionToCall);
    
    if (!response.success) {
      console.warn(`[Gofakeit Autofill] Error for function ${functionToCall}:`, response.error);
      
      if (response.status === 400) {
        handleError(element, '', functionToCall);
      }
      return { success: false, usedFunc: functionToCall };
    }
    
    // Clear all radio buttons first
    radioGroup.forEach((rb: HTMLInputElement) => {
      rb.checked = false;
      rb.dispatchEvent(new Event('change', { bubbles: true }));
    });
    
    // Parse the response to determine which radio button to select
    const value = response.data!.trim();
    
    // Try to find by value first, then by index
    let selectedRadio = radioGroup.find((rb: HTMLInputElement) => rb.value === value);
    if (!selectedRadio && !isNaN(Number(value))) {
      const index = parseInt(value);
      if (index >= 0 && index < radioGroup.length) {
        selectedRadio = radioGroup[index];
      }
    }
    
    // If no match found, select a random one to ensure exactly one is selected
    if (selectedRadio) {
      selectedRadio.checked = true;
      selectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
      
      return { success: true, usedFunc: functionToCall, selectedElement: selectedRadio };
    } else {
      // Fallback: select a random radio button
      const randomIndex = Math.floor(Math.random() * radioGroup.length);
      radioGroup[randomIndex].checked = true;
      radioGroup[randomIndex].dispatchEvent(new Event('change', { bubbles: true }));
      
      return { success: true, usedFunc: functionToCall, selectedElement: radioGroup[randomIndex] };
    }
  }
}

// Helper function to find checkbox group
function findCheckboxGroup(element: HTMLInputElement): HTMLInputElement[] {
  if (element.type !== 'checkbox') return [element];
  
  // Look for checkboxes with the same name or in the same container
  const name = element.name;
  const container = element.closest('form, div, fieldset') || document;
  
  if (name) {
    // Find checkboxes with the same name
    return Array.from(container.querySelectorAll(`input[type="checkbox"][name="${name}"]`));
  } else {
    // Find checkboxes in the same container
    return Array.from(container.querySelectorAll('input[type="checkbox"]'));
  }
}

// Helper function to find radio group
function findRadioGroup(element: HTMLInputElement): HTMLInputElement[] {
  if (element.type !== 'radio') return [element];
  
  // Look for radio buttons with the same name
  const name = element.name;
  
  if (name) {
    // Search the entire document for radio buttons with the same name
    const radioButtons = Array.from(document.querySelectorAll(`input[type="radio"][name="${name}"]`)) as HTMLInputElement[];
    return radioButtons;
  } else {
    // Find radio buttons in the same container
    const container = element.closest('form, div, fieldset') || document;
    const radioButtons = Array.from(container.querySelectorAll('input[type="radio"]')) as HTMLInputElement[];
    return radioButtons;
  }
}

// Handle select dropdown
export async function handleSelectWithFunction(element: HTMLSelectElement, gofakeitFunc: string, value?: string): Promise<{ success: boolean, usedFunc: string }> {
  const options = Array.from(element.options).map(option => option.value).filter(value => value !== '');
  
  if (options.length === 0) {
    console.warn('[Gofakeit Autofill] Select element has no valid options:', element);
    return { success: false, usedFunc: gofakeitFunc };
  }
  
  // If value is provided (from batch), use it directly
  if (value !== undefined) {
    if (element.multiple) {
      // Handle multiselect
      Array.from(element.options).forEach(option => option.selected = false);
      
      // Parse comma-separated values
      const selectedValues = value.split(',').map(val => val.trim()).filter(val => val !== '');
      selectedValues.forEach(value => {
        const option = element.options.namedItem(value) || Array.from(element.options).find(opt => opt.value === value);
        if (option) option.selected = true;
      });
    } else {
      // Try to set the value directly
      const option = element.options.namedItem(value) || Array.from(element.options).find(opt => opt.value === value);
      if (option) {
        element.value = value;
      } else {
        // If the value doesn't match any option, select a random option
        const validOptions = options.filter(opt => opt !== '');
        if (validOptions.length > 0) {
          const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
          element.value = randomOption;
        } else {
          // If no valid options, don't set any value
          return { success: false, usedFunc: gofakeitFunc };
        }
      }
    }
    
    element.dispatchEvent(new Event('change', { bubbles: true }));
    return { success: true, usedFunc: gofakeitFunc === 'true' ? 'random' : gofakeitFunc };
  }
  
  let response;
  if (gofakeitFunc === 'true') {
    // Use random selection for 'true' - randomly select from options
    const randomIndex = Math.floor(Math.random() * options.length);
    const selectedOption = options[randomIndex];
    response = { success: true, data: selectedOption };
  } else {
    // Use custom function
    response = await callFunc(gofakeitFunc);
  }
  
  if (!response.success) {
    console.warn(`[Gofakeit Autofill] Error for select:`, response.error);
    if (response.status === 400) {
      handleError(element, 'Failed to get selection');
    }
    return { success: false, usedFunc: gofakeitFunc };
  }
  
  if (element.multiple) {
    // Handle multiselect
    Array.from(element.options).forEach(option => option.selected = false);
    
    if (gofakeitFunc === 'true') {
      // For random selection, select multiple options (roughly half)
      const numToSelect = Math.min(Math.ceil(options.length / 2), options.length);
      const selectedValues = [response.data!];
      
      // Add more random selections
      const remainingOptions = options.filter(opt => opt !== response.data!);
      for (let i = 1; i < numToSelect && remainingOptions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * remainingOptions.length);
        selectedValues.push(remainingOptions.splice(randomIndex, 1)[0]);
      }
      
      selectedValues.forEach(value => {
        const option = element.options.namedItem(value) || Array.from(element.options).find(opt => opt.value === value);
        if (option) option.selected = true;
      });
    } else {
      // Parse comma-separated values for custom function
      const selectedValues = response.data!.split(',').map(val => val.trim()).filter(val => val !== '');
      selectedValues.forEach(value => {
        const option = element.options.namedItem(value) || Array.from(element.options).find(opt => opt.value === value);
        if (option) option.selected = true;
      });
    }
  } else {
    element.value = response.data!;
  }
  
  element.dispatchEvent(new Event('change', { bubbles: true }));
  return { success: true, usedFunc: gofakeitFunc === 'true' ? 'random' : gofakeitFunc };
}
