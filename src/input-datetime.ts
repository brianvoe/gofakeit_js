import { callFunc } from './api';
import { handleError, getDefaultFunctionForInputType } from './autofill';

// Get function name for date/time input (for batch processing)
export function getDateTimeInput(element: HTMLInputElement, gofakeitFunc: string): string {
  const inputType = element.type.toLowerCase();
  
  // For all date/time inputs, use local generate functions when gofakeitFunc is 'true'
  if (inputType === 'date') {
    return gofakeitFunc === 'true' ? 'generateDate' : gofakeitFunc;
  }
  
  if (inputType === 'datetime-local') {
    return gofakeitFunc === 'true' ? 'generateDateTime' : gofakeitFunc;
  }
  
  if (inputType === 'time') {
    return gofakeitFunc === 'true' ? 'generateTime' : gofakeitFunc;
  }
  
  if (inputType === 'month') {
    return gofakeitFunc === 'true' ? 'generateMonth' : gofakeitFunc;
  }
  
  if (inputType === 'week') {
    return gofakeitFunc === 'true' ? 'generateWeek' : gofakeitFunc;
  }
  
  return gofakeitFunc;
}

// Set date/time input value (for batch processing)
export function setDateTimeInput(element: HTMLInputElement, value: string): void {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

// Generate time string (HH:MM format)
export async function generateTime(): Promise<string> {
  // Generate random hour and minute locally
  const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

// Generate month string (YYYY-MM format)
export async function generateMonth(): Promise<string> {
  // Generate random year and month locally
  const year = Math.floor(Math.random() * 30) + 1990; // Random year between 1990-2020
  const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

// Generate date string (YYYY-MM-DD format)
export async function generateDate(): Promise<string> {
  // Generate random year, month, and day locally
  const year = Math.floor(Math.random() * 30) + 1990; // Random year between 1990-2020
  const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
  const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0'); // Use 28 to avoid invalid dates
  return `${year}-${month}-${day}`;
}

// Generate datetime string (YYYY-MM-DDTHH:MM format)
export async function generateDateTime(): Promise<string> {
  // Generate random date and time locally
  const year = Math.floor(Math.random() * 30) + 1990; // Random year between 1990-2020
  const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
  const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0'); // Use 28 to avoid invalid dates
  const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

// Generate week string (YYYY-W## format)
export async function generateWeek(): Promise<string> {
  const weekYearResponse = await callFunc('year');
  const weekResponse = await callFunc('number?min=1&max=53');
  
  if (!weekYearResponse.success || !weekResponse.success) {
    throw new Error(`Failed to generate week: ${weekYearResponse.error || weekResponse.error}`);
  }
  
  const week = weekResponse.data!.padStart(2, '0');
  return `${weekYearResponse.data!}-W${week}`;
}

// Get ISO week number for a date
function getISOWeek(date: Date): number {
  const d = new Date(date.getTime());
  d.setUTCHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // January 4 is always in week 1
  const week1 = new Date(d.getUTCFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1
  const week = Math.ceil((((d.getTime() - week1.getTime()) / 86400000) - 3 + (week1.getUTCDay() || 7)) / 7);
  return week;
}

// Handle date/time input elements
export async function handleDateTimeInput(element: HTMLInputElement, gofakeitFunc: string, value?: string): Promise<{ success: boolean, usedFunc: string }> {
  const inputType = element.type.toLowerCase();
  const functionToCall = getDateTimeInput(element, gofakeitFunc);
  
  try {
    let finalValue: string;
    
    // If value is provided (batch processing), use it directly
    if (value !== undefined) {
      finalValue = value;
    } else {
      // Handle generate functions (multi-function cases)
      if (functionToCall === 'generateTime') {
        finalValue = await generateTime();
      } else if (functionToCall === 'generateMonth') {
        finalValue = await generateMonth();
      } else if (functionToCall === 'generateWeek') {
        finalValue = await generateWeek();
      } else if (functionToCall === 'generateDate') {
        finalValue = await generateDate();
      } else if (functionToCall === 'generateDateTime') {
        finalValue = await generateDateTime();
      } else {
        // Handle single function cases
        const response = await callFunc(functionToCall);
        
        if (!response.success) {
          console.warn(`[Gofakeit Autofill] Error for ${inputType} input:`, response.error);
          if (response.status === 400) {
            handleError(element, `Failed to get random ${inputType}`);
          }
          
          // Fallback to default function for this input type
          const fallbackFunc = getDefaultFunctionForInputType(inputType);
          if (fallbackFunc !== functionToCall) {
            console.warn(`[Gofakeit Autofill] Falling back to default function: ${fallbackFunc}`);
            
            // Handle generate functions directly
            if (fallbackFunc === 'generateWeek') {
              finalValue = await generateWeek();
            } else if (fallbackFunc === 'generateTime') {
              finalValue = await generateTime();
            } else if (fallbackFunc === 'generateMonth') {
              finalValue = await generateMonth();
            } else if (fallbackFunc === 'generateDate') {
              finalValue = await generateDate();
            } else if (fallbackFunc === 'generateDateTime') {
              finalValue = await generateDateTime();
            } else {
              // For other functions, try calling the API
              const fallbackResponse = await callFunc(fallbackFunc);
              if (fallbackResponse.success) {
                finalValue = fallbackResponse.data!;
              } else {
                return { success: false, usedFunc: functionToCall };
              }
            }
          } else {
            return { success: false, usedFunc: functionToCall };
          }
        } else {
          finalValue = response.data!;
        }
      }
    }
    
    // Parse and format the value based on input type
    if (inputType === 'date') {
      // Extract YYYY-MM-DD part from ISO date string
      const dateMatch = finalValue.match(/^(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        finalValue = dateMatch[1];
      } else {
        console.warn('[Gofakeit Autofill] Could not parse date from response:', finalValue);
        return { success: false, usedFunc: functionToCall };
      }
    } else if (inputType === 'datetime-local') {
      // Extract YYYY-MM-DDTHH:MM part from ISO datetime string
      const datetimeMatch = finalValue.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(:\d{2})?/);
      if (datetimeMatch) {
        finalValue = datetimeMatch[1];
      } else {
        console.warn('[Gofakeit Autofill] Could not parse datetime from response:', finalValue);
        return { success: false, usedFunc: functionToCall };
      }
    } else if (inputType === 'week' && functionToCall !== 'generateWeek') {
      // Handle custom week functions (like date/daterange)
      if (functionToCall === 'date' || functionToCall.startsWith('daterange')) {
        const dateMatch = finalValue.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const date = new Date(dateMatch[1]);
          const year = date.getFullYear();
          const week = getISOWeek(date);
          finalValue = `${year}-W${week.toString().padStart(2, '0')}`;
        } else {
          console.warn('[Gofakeit Autofill] Could not parse date for week from response:', finalValue);
          return { success: false, usedFunc: functionToCall };
        }
      }
    }
    
    setDateTimeInput(element, finalValue);
    return { success: true, usedFunc: functionToCall };
    
  } catch (error) {
    console.warn(`[Gofakeit Autofill] Unexpected error handling ${inputType} input:`, error);
    return { success: false, usedFunc: functionToCall };
  }
}
