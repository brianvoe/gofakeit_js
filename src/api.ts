// Base URL for the Gofakeit API
const GOFAKEIT_API_BASE = 'https://api.gofakeit.com/funcs';

// Interface for function parameters
export interface FetchFuncParams {
  [key: string]: string | number | boolean | string[];
}

export interface FetchFuncResponse {
  result?: string;
  error?: string;
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
  value: string | number | boolean | null;
  error?: string;
}

// Multi-function response interface
export interface FetchFuncMultiResponse {
  results?: FetchFuncMultiResponseItem[];
  error?: string;
}

// Function search request interface
export interface FetchFuncSearchRequest {
  id: string;
  queries: string[];
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
  results: FetchFuncSearchResult[];
}

// Multi-function search response interface
export interface FetchFuncSearchResponse {
  results?: FetchFuncSearchResponseItem | FetchFuncSearchResponseItem[];
  error?: string;
}

// Fetch data from gofakeit API
export async function fetchFunc(
  func: string,
  params?: FetchFuncParams
): Promise<FetchFuncResponse> {
  const { func: funcName, params: extractedParams } = parseFunctionString(func);

  // Merge extracted params with provided params (provided params take precedence)
  const finalParams = { ...extractedParams, ...(params || {}) };

  try {
    // Always use POST request
    const result = await makeRequest<string>(
      'POST',
      `${GOFAKEIT_API_BASE}/${funcName}`,
      finalParams
    );
    return {
      result: result,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Call multiple functions in a single request
export async function fetchFuncMulti(
  requests: FetchFuncMultiRequest[]
): Promise<FetchFuncMultiResponse> {
  if (requests.length === 0) {
    return {
      error: 'No functions provided',
    };
  }

  try {
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

    const response = await makeRequest<FetchFuncMultiResponseItem[]>(
      'POST',
      `${GOFAKEIT_API_BASE}/multi`,
      processedRequests
    );

    return { results: response };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Search for multiple functions in a single request
export async function fetchFuncSearch(
  requests: FetchFuncSearchRequest | FetchFuncSearchRequest[]
): Promise<FetchFuncSearchResponse> {
  // Handle single request by converting to array for API call
  const requestArray = Array.isArray(requests) ? requests : [requests];
  if (requestArray.length === 0) {
    return {
      error: 'No search requests provided',
    };
  }

  try {
    const response = await makeRequest<FetchFuncSearchResponseItem[]>(
      'POST',
      `${GOFAKEIT_API_BASE}/search`,
      requestArray
    );

    // Maintain input/output structure consistency
    // If input was a single object, ensure response results is a single object
    // If input was an array, ensure response results is an array
    if (!Array.isArray(requests)) {
      // Input was single object - ensure response is single object
      return { results: response[0] };
    } else {
      // Input was array - ensure response is array
      return { results: response };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Determine response parsing based on URL
    if (url.includes('/multi') || url.includes('/search')) {
      return await response.json();
    } else {
      return (await response.text()) as T;
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
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
