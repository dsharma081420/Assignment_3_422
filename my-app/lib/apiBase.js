/**
 * Local dev: call User API directly (localhost:8080).
 * Production (Vercel): call same-origin /api/user-proxy/* — next.config.js rewrites to the real API.
 */
export function getApiBase() {
  const trim = (s) => (s || "").replace(/\/$/, "");
  if (typeof window !== "undefined") {
    const h = window.location.hostname;
    if (h === "localhost" || h === "127.0.0.1") {
      return trim(process.env.NEXT_PUBLIC_API_URL) || "http://localhost:8080/api/user";
    }
    return trim(`${window.location.origin}/api/user-proxy`);
  }
  return trim(process.env.NEXT_PUBLIC_API_URL) || "http://localhost:8080/api/user";
}
