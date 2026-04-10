import { jwtDecode } from "jwt-decode";
import { getApiBase } from "@/lib/apiBase";

// --- Token Helpers (same as course notes) ------------------------------------

export function setToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("access_token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
}

export function readToken() {
  const token = getToken();
  if (token) {
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function isAuthenticated() {
  const token = readToken();
  if (!token) return false;
  const now = Math.floor(Date.now() / 1000);
  if (token.exp) return token.exp > now;
  return true;
}

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 200) };
  }
}

function proxyNotConfiguredMessage() {
  return new Error(
    "User API proxy is not configured. On Vercel → my-app project → Settings → Environment Variables, set NEXT_PUBLIC_API_URL (or USER_API_URL) to https://YOUR-USER-API.vercel.app/api/user for Production, then Redeploy."
  );
}

function unreachableApiMessage() {
  return new Error(
    "Cannot reach the User API. Local: run cd user-api && npm start (port 8080). Vercel: set NEXT_PUBLIC_API_URL or USER_API_URL on the my-app project and ensure the User API deployment is live."
  );
}

// --- authenticateUser: POST /login, stores token on success ------------------
export async function authenticateUser(user, password) {
  const base = getApiBase();
  if (!base) {
    throw new Error(
      "API base URL is empty. Add my-app/.env.local with NEXT_PUBLIC_API_URL=http://localhost:8080/api/user for local dev."
    );
  }
  let res;
  try {
    res = await fetch(`${base}/login`, {
      method: "POST",
      body: JSON.stringify({ userName: user, password: password }),
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw unreachableApiMessage();
  }
  if (res.status === 404 && base.includes("/api/user-proxy")) {
    throw proxyNotConfiguredMessage();
  }
  const data = await parseJsonResponse(res);
  if (res.status === 200 && data.token) {
    setToken(data.token);
    return true;
  }
  throw new Error(data.message || "Login failed");
}

// --- registerUser: POST /register, does NOT store token ----------------------
export async function registerUser(user, password, password2) {
  const base = getApiBase();
  if (!base) {
    throw new Error(
      "API base URL is empty. Add my-app/.env.local with NEXT_PUBLIC_API_URL=http://localhost:8080/api/user for local dev."
    );
  }
  let res;
  try {
    res = await fetch(`${base}/register`, {
      method: "POST",
      body: JSON.stringify({ userName: user, password: password, password2: password2 }),
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw unreachableApiMessage();
  }
  if (res.status === 404 && base.includes("/api/user-proxy")) {
    throw proxyNotConfiguredMessage();
  }
  const data = await parseJsonResponse(res);
  if (res.status === 200) {
    return true;
  }
  throw new Error(data.message || "Registration failed");
}
