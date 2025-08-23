import { callFunc } from './api';
import { handleError } from './autofill';

// Handle text input elements (text, email, tel, password, search, url, color)
export async function handleTextInput(element: HTMLInputElement, gofakeitFunc: string): Promise<{ success: boolean, usedFunc: string }> {
  const inputType = element.type.toLowerCase();
  
  // Map input types to appropriate gofakeit functions if 'true' is passed
  let functionToCall = gofakeitFunc;
  if (gofakeitFunc === 'true') {
    switch (inputType) {
      case 'email':
        functionToCall = 'email';
        break;
      case 'tel':
        functionToCall = 'phone';
        break;
      case 'password':
        functionToCall = 'password';
        break;
      case 'search':
        functionToCall = 'word';
        break;
      case 'url':
        functionToCall = 'url';
        break;
      case 'color':
        functionToCall = 'hexcolor';
        break;
      default:
        functionToCall = 'word'; // Default for text inputs
    }
  }
  
  const response = await callFunc(functionToCall);
  
  if (!response.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${functionToCall}:`, response.error);
    
    if (response.status === 400) {
      handleError(element, '', functionToCall);
    }
    return { success: false, usedFunc: functionToCall };
  }
  
  element.value = response.data!;
  
  // Trigger events to ensure any listeners are notified
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  
  return { success: true, usedFunc: functionToCall };
}

// Handle textarea elements
export async function handleTextarea(element: HTMLTextAreaElement, gofakeitFunc: string): Promise<{ success: boolean, usedFunc: string }> {
  // Use sentence function if 'true' is passed, otherwise use the provided function
  const functionToCall = gofakeitFunc === 'true' ? 'sentence' : gofakeitFunc;
  const response = await callFunc(functionToCall);
  
  if (!response.success) {
    console.warn(`[Gofakeit Autofill] Error for function ${functionToCall}:`, response.error);
    
    if (response.status === 400) {
      handleError(element, '', functionToCall);
    }
    return { success: false, usedFunc: functionToCall };
  }
  
  element.value = response.data!;
  
  // Trigger events to ensure any listeners are notified
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  
  return { success: true, usedFunc: functionToCall };
}
