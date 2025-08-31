import { callFunc } from './api';
import { handleError } from './autofill';

// Get function name for date/time input (for batch processing)
export function getDateTimeInput(element: HTMLInputElement, gofakeitFunc: string): string {
  const inputType = element.type.toLowerCase();
  
  // For inputs that use a single function
  if (inputType === 'date' || inputType === 'datetime-local') {
    return gofakeitFunc === 'true' ? 'date' : gofakeitFunc;
  }
  
  // For inputs that use multiple functions, we'll use generate functions
  if (inputType === 'time') {
    return 'generateTime';
  }
  
  if (inputType === 'month') {
    return 'generateMonth';
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
  const hourResponse = await callFunc('hour');
  const minuteResponse = await callFunc('minute');
  
  if (!hourResponse.success || !minuteResponse.success) {
    throw new Error(`Failed to generate time: ${hourResponse.error || minuteResponse.error}`);
  }
  
  const hour = hourResponse.data!.padStart(2, '0');
  const minute = minuteResponse.data!.padStart(2, '0');
  return `${hour}:${minute}`;
}

// Generate month string (YYYY-MM format)
export async function generateMonth(): Promise<string> {
  const yearResponse = await callFunc('year');
  const monthResponse = await callFunc('month');
  
  if (!yearResponse.success || !monthResponse.success) {
    throw new Error(`Failed to generate month: ${yearResponse.error || monthResponse.error}`);
  }
  
  const month = monthResponse.data!.padStart(2, '0');
  return `${yearResponse.data!}-${month}`;
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
      } else {
        // Handle single function cases
        const response = await callFunc(functionToCall);
        
        if (!response.success) {
          console.warn(`[Gofakeit Autofill] Error for ${inputType} input:`, response.error);
          if (response.status === 400) {
            handleError(element, `Failed to get random ${inputType}`);
          }
          return { success: false, usedFunc: functionToCall };
        }
        
        finalValue = response.data!;
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
      const datetimeMatch = finalValue.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}):\d{2}/);
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
