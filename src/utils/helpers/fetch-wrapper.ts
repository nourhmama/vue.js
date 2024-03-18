import { useAuthStore } from '@/stores/auth';

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE')
};

function request(method: string) {
  return async (url: string, body?: object) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const token = useAuthStore().user?.token || '';
    const requestOptions: any = {
      method,
      headers: authHeader(url, token)
    };
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(body);
    }
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  };
}

function authHeader(url: string, token: string) {
  // return auth header with jwt if token is provided and request is to the api url
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
  if (token && isApiUrl) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

async function handleResponse(response: any) {
  const data = await response.json();

  if (!response.ok) {
    const { user, logout } = useAuthStore();
    if ([401, 403].includes(response.status) && user) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      logout();
    }

    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }

  return data;
}
