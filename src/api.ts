// Base URL for the Gofakeit API
const GOFAKEIT_API_BASE = 'https://api.gofakeit.com/funcs'

export interface ApiResponse {
  success: boolean;
  data?: string;
  error?: string;
  status?: number;
}

// Multi-function request interface
export interface MultiFuncRequest {
  id?: string;
  func: string;
  params?: Record<string, unknown>;
}

// Multi-function response interface
export interface MultiFuncResponse {
  id?: string;
  value: string | null;
  error: string;
}

// Multi-function API response interface
export interface MultiFuncApiResponse {
  success: boolean;
  data?: MultiFuncResponse[];
  error?: string;
  status?: number;
}

// Function search request interface
export interface FuncSearchRequest {
  id: string;
  query: string;
}

// Function search result interface
export interface FuncSearchResult {
  name: string;     // function name for API usage
  score: number;    // relevance score (0-100)
  reasons: string[]; // why it matched
}

// Function search response interface
export interface FuncSearchResponse {
  id: string;
  query: string;
  results: FuncSearchResult[];
}

// Multi-function search API response interface
export interface MultiFuncSearchApiResponse {
  success: boolean;
  data?: FuncSearchResponse[];
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

// Call multiple functions in a single request
export async function callMultiFunc(requests: MultiFuncRequest[]): Promise<MultiFuncApiResponse> {
  if (requests.length === 0) {
    return {
      success: false,
      error: 'No functions provided'
    };
  }

  // Process each request to extract function name and parameters
  const processedRequests: MultiFuncRequest[] = requests.map((req, index) => {
    const { func, id } = req;
    const questionMarkIndex = func.indexOf('?');
    
    if (questionMarkIndex !== -1) {
      // Function has query parameters
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
      
      return {
        id: id || `req_${index}`,
        func: functionName,
        params
      };
    } else {
      // Simple function
      return {
        id: id || `req_${index}`,
        func,
        params: req.params
      };
    }
  });

  return makeMultiRequest('POST', `${GOFAKEIT_API_BASE}/multi`, processedRequests);
}

// Search for multiple functions in a single request
export async function searchMultiFunc(requests: FuncSearchRequest[]): Promise<MultiFuncSearchApiResponse> {
  if (requests.length === 0) {
    return {
      success: false,
      error: 'No search queries provided'
    };
  }

  return makeSearchRequest('POST', `${GOFAKEIT_API_BASE}/search`, requests);
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

// Multi-function HTTP request function
async function makeMultiRequest(method: 'GET' | 'POST', url: string, body: MultiFuncRequest[]): Promise<MultiFuncApiResponse> {
  try {
    const options: {
      method: string;
      headers: Record<string, string>;
      body: string;
    } = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.json();
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

// Multi-function search HTTP request function
async function makeSearchRequest(method: 'GET' | 'POST', url: string, body: FuncSearchRequest[]): Promise<MultiFuncSearchApiResponse> {
  try {
    const options: {
      method: string;
      headers: Record<string, string>;
      body: string;
    } = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
        status: response.status
      };
    }
    
    const data = await response.json();
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
