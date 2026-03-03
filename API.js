const BASE_URL = 'http://10.21.189.30:5000';

import { AsyncStorage } from '@react-native-async-storage/async-storage';

// ─── Token Storage ────────────────────────────────────────────────────────────

const TokenStorage = {
  get: async (key) => await AsyncStorage.getItem(key),
  set: async (key, value) => await AsyncStorage.setItem(key, value),
  remove: async (key) => await AsyncStorage.removeItem(key),

  getAccessToken: () => TokenStorage.get("access_token"),
  getRefreshToken: () => TokenStorage.get("refresh_token"),
  setTokens: async (access, refresh) => {
    await AsyncStorage.multiSet([
      ["access_token", access],
      ["refresh_token", refresh]
    ]);
  },
  clearTokens: async () => {
    await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
  },
};

// ─── Core Fetch Helper ────────────────────────────────────────────────────────────

const request = async (endpoint, options = {}, isRetry = false) => {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, options);
  const data = await response.json();

  // If unauthorized and not already a retry, attempt token refresh
  if (response.status === 401 && data.message === "Access token has expired" && !isRetry) {
    const refreshed = await Auth.refresh();
    if (refreshed.access_token) {
      // retry original request with new token
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${refreshed.access_token}`,
      };
      return request(endpoint, options, true);
    }
  }

  if (!response.ok) {
    throw { status: response.status, message: data.message || "Request failed", data };
  }

  return data;
};

// Attach bearer token to headers
const authHeaders = async (extra = {}) => {
  const token = await TokenStorage.getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
    ...extra,
  };
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const Auth = {
  // Register regular user
  signUpRegular: async ({ first_name, last_name, email, password }) => {
    const data = await request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password, is_dive_operator: false }),
    });
    await TokenStorage.setTokens(data.access_token, data.refresh_token);
    return data;
  },

  // Register dive operator
  signUpOperator: async ({ first_name, last_name, email, password, birDocument, certificationDocument }) => {
    const form = new FormData();
    form.append("first_name", first_name);
    form.append("last_name", last_name);
    form.append("email", email);
    form.append("password", password);
    form.append("is_dive_operator", true);
    form.append("bir_document", { 
      uri: birDocument.uri, 
      name: birDocument.name || "bir_document.pdf", 
      type: birDocument.type || "application/pdf",
    });
    form.append("certification_document", { 
      uri: certificationDocument.uri, 
      name: certificationDocument.name || "cert_document.pdf", 
      type: certificationDocument.type || "application/pdf",
    });

    const data = await request("/api/auth/signup", {
      method: "POST",
      body: form,
    });
    await TokenStorage.setTokens(data.access_token, data.refresh_token);
    return data;
  },

  // Login
  login: async ({ email, password }) => {
    const data = await request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    await TokenStorage.setTokens(data.access_token, data.refresh_token);
    return data;
  },

  // Refresh tokens
  refresh: async () => {
    const refresh_token = await TokenStorage.getRefreshToken();
    const data = await request("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    await TokenStorage.setTokens(data.access_token, data.refresh_token);
    return data;
  },

  // Get current user
  me: async () => {
    return request("/api/auth/me", {
      headers: await authHeaders(),
    })
  },

  // Logout
  logout: async () => {
    const data = await request("/api/auth/logout", {
      method: "POST",
      headers: await authHeaders({}),
    });
    await TokenStorage.clearTokens();
    return data;
  }
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const Profile = {
  get: async () => {
    return request("/api/profile", {
      headers: await authHeaders(),
    });
  },

  update: async ({ first_name, last_name, email }) => {
    return request("/api/profile", {
      method: "PUT",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ first_name, last_name, email }),
    });
  },

  changePassword: async ({ current_password, new_password }) => {
    return request("/api/change-password", {
      method: "POST",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ current_password, new_password }),
    });
  },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const Dashboard = {
  general: async () => {
    return request("/api/dashboard", {
      headers: await authHeaders(),
    });
  },

  operator: async () => {
    return request("/api/operator/dashboard", {
      headers: await authHeaders(),
    });
  },
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const Admin = {
  listOperators: async (status) => {
    const query = status ? `?status=${status}` : "";
    return request(`/api/admin/dive-operators${query}`, {
      headers: await authHeaders(),
    });
  },

  getOperator: async (id) => {
    return request(`/api/admin/dive-operators/${id}`, {
      headers: await authHeaders(),
    });
  },

  approveOperator: async (id) => {
    return request(`/api/admin/dive-operators/${id}/approve`, {
      method: "POST",
      headers: await authHeaders(),
    });
  },

  rejectOperator: async (id, reason) => {
    return request(`/api/admin/dive-operators/${id}/reject`, {
      method: "POST",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ reason }),
    });
  },

  resetOperator: async (id) => {
    return request(`/api/admin/dive-operators/${id}/reset`, {
      method: "POST",
      headers: await authHeaders(),
    });
  },
};

export default { Auth, Profile, Dashboard, Admin, TokenStorage };