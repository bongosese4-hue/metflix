// ─────────────────────────────────────────────────────────────────
// CAPACITOR BRIDGE — makes API calls work in both:
// 1. Next.js dev server (calls /api/...)
// 2. Capacitor APK (calls https://metflix.vercel.app/api/...)
// ─────────────────────────────────────────────────────────────────

// In the APK, window.location.origin will be "capacitor://localhost"
// or "http://localhost", so we detect that and use the prod backend.
const IS_NATIVE_APP = 
    typeof window !== 'undefined' && 
    (window.location.protocol === 'capacitor:' || 
     (window.location.hostname === 'localhost' && !window.location.port));

export const BACKEND_BASE = IS_NATIVE_APP 
    ? 'https://metflix.afrozex.com' 
    : ''; // empty = same origin (Next.js dev or Vercel deployment)

export function apiUrl(path) {
    return `${BACKEND_BASE}${path}`;
}
