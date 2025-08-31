import { callFunc } from './api';
import { handleError } from './autofill';

// Get function name for number input (for batch processing)
export function getNumberInput(gofakeitFunc: string): string {
  return gofakeitFunc === 'true' ? 'number' : gofakeitFunc;
}

// Set number input value (for batch processing)
export function setNumberInput(element: HTMLInputElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

// Handle number input elements
export async function handleNumberInput(element: HTMLInputElement, gofakeitFunc: string): Promise<{ success: boolean, usedFunc: string }> {
  // Use number function if 'true' is passed, otherwise use the provided function
  const functionToCall = getNumberInput(gofakeitFunc);
  
  const response = await callFunc(functionToCall);
  
  if (!response.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${functionToCall}:`, response.error);
    
    if (response.status === 400) {
      handleError(element, '', functionToCall);
    }
    return { success: false, usedFunc: functionToCall };
  }
  
  setNumberInput(element, response.data!);
  return { success: true, usedFunc: functionToCall };
}

// Get function name for range input (for batch processing)
export function getRangeInput(element: HTMLInputElement): string {
  const min = parseFloat(element.min) || 0;
  const max = parseFloat(element.max) || 100;
  return `number?min=${min}&max=${max}`;
}

// Set range input value (for batch processing)
export function setRangeInput(element: HTMLInputElement, value: string): void {
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    const min = parseFloat(element.min) || 0;
    const max = parseFloat(element.max) || 100;
    const clampedValue = Math.max(min, Math.min(max, numValue));
    element.value = clampedValue.toString();
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

// Handle range input elements
export async function handleRangeInput(element: HTMLInputElement): Promise<{ success: boolean, usedFunc: string }> {
  // For range inputs, always use gofakeit API with min/max from the element
  const functionToCall = getRangeInput(element);
  
  const response = await callFunc(functionToCall);
  
  if (!response.success) {
    console.warn(`[Gofakeit Autofill] Error for range input:`, response.error);
    
    if (response.status === 400) {
      handleError(element, 'Failed to get random number for range');
    }
    return { success: false, usedFunc: functionToCall };
  }
  
  setRangeInput(element, response.data!);
  return { success: true, usedFunc: functionToCall };
}
