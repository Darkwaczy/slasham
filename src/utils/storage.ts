export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem" | "clear">;

// IMPORTANT:
// Product requirement: do not persist data on the frontend (no localStorage/sessionStorage/indexedDB).
// This in-memory implementation resets on refresh and is safe for mock UI state during development.
const memory = new Map<string, string>();

export const storage: StorageLike = {
  getItem(key) {
    return memory.has(key) ? memory.get(key)! : null;
  },
  setItem(key, value) {
    memory.set(key, String(value));
  },
  removeItem(key) {
    memory.delete(key);
  },
  clear() {
    memory.clear();
  },
};

