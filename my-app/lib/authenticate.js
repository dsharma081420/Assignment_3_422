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
  return token.exp && token.exp > now;
}

// --- authenticateUser: POST /login, stores token on success ------------------
export async function authenticateUser(user, password) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ userName: user, password: password }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (res.status === 200) {
    setToken(data.token);
    return true;
  } else {
    throw new Error(data.message);
  }
}

// --- registerUser: POST /register, does NOT store token ----------------------
// Differences vs authenticateUser:
//   - hits /register instead of /login
//   - also sends password2 in request body
//   - does NOT call setToken() on success - just returns true
export async function registerUser(user, password, password2) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: "POST",
    body: JSON.stringify({ userName: user, password: password, password2: password2 }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (res.status === 200) {
    return true;
  } else {
    throw new Error(data.message);
  }
}
