import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// ─── Token Storage ────────────────────────────────────────────────────────────

export const TokenStorage = {
  get: async (key) => await AsyncStorage.getItem(key),
  set: async (key, value) => await AsyncStorage.setItem(key, value),
  remove: async (key) => await AsyncStorage.removeItem(key),

  getAccessToken: () => TokenStorage.get("access_token"),
  getRefreshToken: () => TokenStorage.get("refresh_token"),
  setTokens: async (access, refresh) => {
    await AsyncStorage.setItem("access_token", access);
    await AsyncStorage.setItem("refresh_token", refresh);
  },
  clearTokens: async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");
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

// ─── Stores ───────────────────────────────────────────────────────────────────

export const Stores = {
  list: async () => request("/api/stores"),

  map: async () => request("/api/stores/map"),

  get: async (storeId) => request(`/api/stores/${storeId}`),

  create: async (data) =>
    request("/api/stores", {
      method: "POST",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }),

  update: async (storeId, data) =>
    request(`/api/stores/${storeId}`, {
      method: "PUT",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }),

  delete: async (storeId) =>
    request(`/api/stores/${storeId}`, {
      method: "DELETE",
      headers: await authHeaders(),
    }),
};

// ─── Schedules ────────────────────────────────────────────────────────────────

export const Schedules = {
  list: async (storeId, date) => {
    const query = date ? `?date=${date}` : "";
    return request(`/api/stores/${storeId}/schedules${query}`);
  },

  create: async (storeId, data) =>
    request(`/api/stores/${storeId}/schedules`, {
      method: "POST",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }),

  update: async (storeId, scheduleId, data) =>
    request(`/api/stores/${storeId}/schedules/${scheduleId}`, {
      method: "PUT",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }),

  delete: async (storeId, scheduleId) =>
    request(`/api/stores/${storeId}/schedules/${scheduleId}`, {
      method: "DELETE",
      headers: await authHeaders(),
    }),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const Bookings = {
  list: async (status) => {
    const query = status ? `?status=${status}` : "";
    return request(`/api/bookings${query}`, {
      headers: await authHeaders(),
    });
  },

  my: async () =>
    request("/api/bookings/my", {
      headers: await authHeaders(),
    }),

  get: async (bookingId) =>
    request(`/api/bookings/${bookingId}`, {
      headers: await authHeaders(),
    }),

  create: async ({ schedule_id, slots, notes, coupon_code }) =>
    request("/api/bookings", {
      method: "POST",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ schedule_id, slots, notes, coupon_code }),
    }),

  cancel: async (bookingId) =>
    request(`/api/bookings/${bookingId}`, {
      method: "DELETE",
      headers: await authHeaders(),
    }),
};

// ─── Weather ──────────────────────────────────────────────────────────────────

export const Weather = {
  current: async (q) =>
    request(`/api/weather/current?q=${encodeURIComponent(q)}`),

  marine: async (q, days = 1, tides = "yes") =>
    request(
      `/api/weather/marine?q=${encodeURIComponent(q)}&days=${days}&tides=${tides}`
    ),
};

// ─── Species Identification ───────────────────────────────────────────────────

export const Identify = {
  identify: async (imageUri) => {
    const form = new FormData();
    const filename = imageUri.split("/").pop();
    const ext = filename.split(".").pop().toLowerCase();
    const mimeType =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

    form.append("image", {
      uri: imageUri,
      name: filename,
      type: mimeType,
    });

    return request("/api/identify", {
      method: "POST",
      body: form,
    });
  },
};

// ─── Dive Sites ───────────────────────────────────────────────────────────────

export const DiveSites = {
  list: async () => request("/api/dive-sites"),

  get: async (id) => request(`/api/dive-sites/${id}`),
};

// ─── Dive Preferences ────────────────────────────────────────────────────────

export const Preferences = {
  get: async () =>
    request("/api/profile/preferences", {
      headers: await authHeaders(),
    }),

  update: async (data) =>
    request("/api/profile/preferences", {
      method: "PUT",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(data),
    }),
};

// ─── Recommendations ──────────────────────────────────────────────────────────

export const Recommendations = {
  sites: async (lat, lng) =>
    request(`/api/recommend/sites?lat=${lat}&lng=${lng}`, {
      headers: await authHeaders(),
    }),

  shops: async (lat, lng) =>
    request(`/api/recommend/shops?lat=${lat}&lng=${lng}`, {
      headers: await authHeaders(),
    }),
};

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const Coupons = {
  validate: async (code, schedule_id) =>
    request("/api/coupons/validate", {
      method: "POST",
      headers: await authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ code, schedule_id }),
    }),
};

export default {
  Auth, Profile, Dashboard, Admin, TokenStorage,
  Stores, Schedules, Bookings, Weather, Identify,
  DiveSites, Preferences, Recommendations, Coupons,
};