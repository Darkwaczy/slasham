export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear">;

// IMPORTANT:
// Product requirement: do not persist data on the frontend (no localStorage/sessionStorage/indexedDB).
// This in-memory implementation resets on refresh and is safe for mock UI state during development.

export const storage: StorageLike = {
  getItem(key) {
    return window.localStorage.getItem(key);
  },
  setItem(key, value) {
    window.localStorage.setItem(key, String(value));
  },
  removeItem(key) {
    window.localStorage.removeItem(key);
  },
  clear() {
    window.localStorage.clear();
  },
};

