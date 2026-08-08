const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/+$/, '');
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export class ApiClientError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export const isMockMode = () => USE_MOCK_DATA;

const fetchWithTimeout = async (
  resource: RequestInfo | URL, 
  options: RequestInit & { timeout?: number } = {}
) => {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: fetchOptions.signal || controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id); // Always clean up the timeout timer
  }
};

export const apiClient = async <T>(
  endpoint: string, 
  options: RequestInit & { timeout?: number } = {}
): Promise<T> => {
  // Ensure normalized URL slashes
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    const response = await fetchWithTimeout(`${API_URL}${formattedEndpoint}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      let errorMsg = 'An unexpected error occurred';
      try {
        const errorData = await response.json();
        
        // Safely parse string, array (FastAPI 422), or object details
        if (typeof errorData.detail === 'string') {
          errorMsg = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail.map((err: any) => err.msg || JSON.stringify(err)).join('; ');
        } else if (errorData.detail) {
          errorMsg = JSON.stringify(errorData.detail);
        }
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      throw new ApiClientError(response.status, errorMsg);
    }

    // Safely handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiClientError(408, 'The server is taking too long to respond. Please retry.');
    }
    throw new ApiClientError(
      0, 
      'Unable to connect to the clinical backend. Please check your network connection.'
    );
  }
};