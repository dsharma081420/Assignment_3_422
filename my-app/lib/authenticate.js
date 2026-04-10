import { jwtDecode } from "jwt-decode";

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

// --- authenticateUser: POST /login, stores token on success ------------------
export async function authenticateUser(user, password) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Check my-app .env / .env.local");
  }
  let res;
  try {
    res = await fetch(`${base}/login`, {
      method: "POST",
      body: JSON.stringify({ userName: user, password: password }),
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new Error(
      "Cannot reach the User API. Start it with: cd user-api && npm start (port 8080), or set NEXT_PUBLIC_API_URL to your deployed API."
    );
  }
  const data = await parseJsonResponse(res);
  if (res.status === 200 && data.token) {
    setToken(data.token);
    return true;
  }
  throw new Error(data.message || "Login failed");
}

// --- registerUser: POST /register, does NOT store token ----------------------
// Differences vs authenticateUser:
//   - hits /register instead of /login
//   - also sends password2 in request body
//   - does NOT call setToken() on success - just returns true
export async function registerUser(user, password, password2) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Check my-app .env / .env.local");
  }
  let res;
  try {
    res = await fetch(`${base}/register`, {
      method: "POST",
      body: JSON.stringify({ userName: user, password: password, password2: password2 }),
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new Error(
      "Cannot reach the User API. Start it with: cd user-api && npm start (port 8080), or set NEXT_PUBLIC_API_URL to your deployed API."
    );
  }
  const data = await parseJsonResponse(res);
  if (res.status === 200) {
    return true;
  }
  throw new Error(data.message || "Registration failed");
}
