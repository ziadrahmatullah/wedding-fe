import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "device_token";

export function getDeviceToken(): string {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const token = uuidv4();
  localStorage.setItem(STORAGE_KEY, token);
  return token;
}
