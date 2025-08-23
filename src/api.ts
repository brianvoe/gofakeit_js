// Base URL for the Gofakeit API
const GOFAKEIT_API_BASE = 'https://api.gofakeit.com/funcs'

export interface ApiResponse {
  success: boolean;
  data?: string;
  error?: string;
  status?: number;
}

// Fetch data from gofakeit API
export async function callFunc(func: string): Promise<ApiResponse> {
  // Check if the function contains query parameters
  const questionMarkIndex = func.indexOf('?');
  
  if (questionMarkIndex !== -1) {
    // Function has query parameters - use POST with JSON body
    const functionName = func.substring(0, questionMarkIndex);
    const queryString = func.substring(questionMarkIndex + 1);
    
    // Parse query parameters into an object
    const params: Record<string, unknown> = {};
    const searchParams = new URLSearchParams(queryString);
    
    for (const [key, value] of searchParams.entries()) {
      // Try to parse as number if possible
      const numValue = parseFloat(value);
      params[key] = isNaN(numValue) ? value : numValue;
    }
    
    return makeRequest('POST', `${GOFAKEIT_API_BASE}/${functionName}`, params);
  } else {
    // Simple function - use GET request
    return makeRequest('GET', `${GOFAKEIT_API_BASE}/${func}`);
  }
}

// Fetch random string from an array of strings using gofakeit API
export async function fetchRandomString(strings: string[]): Promise<ApiResponse> {
  return makeRequest('POST', `${GOFAKEIT_API_BASE}/randomstring`, { strs: strings });
}

// Base HTTP request function
async function makeRequest(method: 'GET' | 'POST', url: string, body?: Record<string, unknown>): Promise<ApiResponse> {
  try {
    const options: {
      method: string;
      headers: Record<string, string>;
      body?: string;
    } = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (method === 'POST' && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.text();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error(`[Gofakeit Autofill] Error in ${method} request to ${url}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
