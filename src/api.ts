// Base URL for the Gofakeit API
const GOFAKEIT_API_BASE = 'https://api.gofakeit.com/funcs';

// Interface for function parameters
export interface FetchFuncParams {
  [key: string]: string | number | boolean;
}

export interface FetchFuncResponse {
  success: boolean;
  data?: string;
  error?: string;
  status?: number;
}

// Multi-function request interface
export interface FetchFuncMultiRequest {
  id?: string;
  func: string;
  params?: FetchFuncParams;
}

// Multi-function response item interface
export interface FetchFuncMultiResponseItem {
  id?: string;
  value: string | null;
  error: string;
}

// Multi-function response interface
export interface FetchFuncMultiResponse {
  success: boolean;
  data?: FetchFuncMultiResponseItem[];
  error?: string;
  status?: number;
}

// Function search request interface
export interface FetchFuncSearchRequest {
  id: string;
  query: string;
}

// Function search result interface
export interface FetchFuncSearchResult {
  name: string; // function name for API usage
  score: number; // relevance score (0-100)
  reasons: string[]; // why it matched
}

// Function search response item interface
export interface FetchFuncSearchResponseItem {
  id: string;
  query: string;
  results: FetchFuncSearchResult[];
}

// Multi-function search response interface
export interface FetchFuncSearchResponse {
  success: boolean;
  data?: FetchFuncSearchResponseItem[];
  error?: string;
  status?: number;
}

// Fetch data from gofakeit API
export async function fetchFunc(
  func: string,
  params?: FetchFuncParams
): Promise<FetchFuncResponse> {
  const { func: funcName, params: extractedParams } = parseFunctionString(func);

  // Merge extracted params with provided params (provided params take precedence)
  const finalParams = { ...extractedParams, ...(params || {}) };

  // Always use POST request
  return makeRequest('POST', `${GOFAKEIT_API_BASE}/${funcName}`, finalParams);
}

// Call multiple functions in a single request
export async function fetchFuncMulti(
  requests: FetchFuncMultiRequest[]
): Promise<FetchFuncMultiResponse> {
  if (requests.length === 0) {
    return {
      success: false,
      error: 'No functions provided',
    };
  }

  // Process each request to extract function name and parameters
  const processedRequests: FetchFuncMultiRequest[] = requests.map(
    (req, index) => {
      const { func, id, params } = req;
      const { func: funcName, params: extractedParams } =
        parseFunctionString(func);

      // Merge extracted params with provided params (provided params take precedence)
      const finalParams = { ...extractedParams, ...(params || {}) };

      return {
        id: id || `req_${index}`,
        func: funcName,
        params: finalParams,
      };
    }
  );

  return makeRequest<FetchFuncMultiResponse>(
    'POST',
    `${GOFAKEIT_API_BASE}/multi`,
    processedRequests
  );
}

// Search for multiple functions in a single request
export async function fetchFuncSearch(
  requests: FetchFuncSearchRequest[]
): Promise<FetchFuncSearchResponse> {
  if (requests.length === 0) {
    return {
      success: false,
      error: 'No search queries provided',
    };
  }

  return makeRequest<FetchFuncSearchResponse>(
    'POST',
    `${GOFAKEIT_API_BASE}/search`,
    requests
  );
}

// Base HTTP request function
// Unified HTTP request function for all API calls
async function makeRequest<T>(
  method: 'GET' | 'POST',
  url: string,
  body?: FetchFuncParams | FetchFuncMultiRequest[] | FetchFuncSearchRequest[]
): Promise<T> {
  try {
    const options: {
      method: string;
      headers: Record<string, string>;
      body?: string;
    } = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method === 'POST' && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
        status: response.status,
      } as T;
    }

    // Determine response parsing based on URL
    let data;
    if (url.includes('/multi') || url.includes('/search')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      success: true,
      data: data,
    } as T;
  } catch (error) {
    console.error(
      `[Gofakeit Autofill] Error in ${method} request to ${url}:`,
      error
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    } as T;
  }
}

// Parse function string to extract function name and parameters
export function parseFunctionString(func: string): {
  func: string;
  params: FetchFuncParams;
} {
  const questionMarkIndex = func.indexOf('?');

  if (questionMarkIndex !== -1) {
    // Function has query parameters - extract them
    const functionName = func.substring(0, questionMarkIndex);
    const queryString = func.substring(questionMarkIndex + 1);

    // Parse query parameters into an object
    const params: FetchFuncParams = {};
    const searchParams = new URLSearchParams(queryString);

    for (const [key, value] of searchParams.entries()) {
      // Try to parse as number if possible
      const numValue = parseFloat(value);
      params[key] = isNaN(numValue) ? value : numValue;
    }

    return { func: functionName, params };
  } else {
    // Simple function with no parameters
    return { func: func, params: {} };
  }
}
