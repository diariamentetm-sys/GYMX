const STORAGE_KEY = "gymx.pendingPersonalSlug";

export function rememberPendingPersonalSlug(slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, normalized);
  } catch {
    /* private mode */
  }
}

export function peekPendingPersonalSlug(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearPendingPersonalSlug() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* private mode */
  }
}

export function capturePersonalSlugFromSearch(search: string) {
  const slug = new URLSearchParams(search).get("personal");
  if (slug) rememberPendingPersonalSlug(slug);
  return slug;
}
