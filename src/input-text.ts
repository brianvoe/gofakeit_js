import { callFunc } from './api';
import { handleError } from './autofill';

// Get function name for text input (for batch processing)
export function getTextInput(element: HTMLInputElement, gofakeitFunc: string): string {
  const inputType = element.type.toLowerCase();
  
  // Map input types to appropriate gofakeit functions if 'true' is passed
  if (gofakeitFunc === 'true') {
    switch (inputType) {
      case 'email':
        return 'email';
      case 'tel':
        return 'phone';
      case 'password':
        return 'password';
      case 'search':
        return 'word';
      case 'url':
        return 'url';
      case 'color':
        return 'hexcolor';
      default:
        return 'word'; // Default for text inputs
    }
  }
  
  return gofakeitFunc;
}

// Set text input value (for batch processing)
export function setTextInput(element: HTMLInputElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

// Handle text input elements (text, email, tel, password, search, url, color)
export async function handleTextInput(element: HTMLInputElement, gofakeitFunc: string): Promise<{ success: boolean, usedFunc: string }> {
  const functionToCall = getTextInput(element, gofakeitFunc);
  
  const response = await callFunc(functionToCall);
  
  if (!response.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${functionToCall}:`, response.error);
    
    if (response.status === 400) {
      handleError(element, '', functionToCall);
    }
    return { success: false, usedFunc: functionToCall };
  }
  
  setTextInput(element, response.data!);
  return { success: true, usedFunc: functionToCall };
}

// Get function name for textarea (for batch processing)
export function getTextarea(gofakeitFunc: string): string {
  return gofakeitFunc === 'true' ? 'sentence' : gofakeitFunc;
}

// Set textarea value (for batch processing)
export function setTextarea(element: HTMLTextAreaElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

// Handle textarea elements
export async function handleTextarea(element: HTMLTextAreaElement, gofakeitFunc: string): Promise<{ success: boolean, usedFunc: string }> {
  // Use sentence function if 'true' is passed, otherwise use the provided function
  const functionToCall = getTextarea(gofakeitFunc);
  
  const response = await callFunc(functionToCall);
  
  if (!response.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${functionToCall}:`, response.error);
    
    if (response.status === 400) {
      handleError(element, '', functionToCall);
    }
    return { success: false, usedFunc: functionToCall };
  }
  
  setTextarea(element, response.data!);
  return { success: true, usedFunc: functionToCall };
}

