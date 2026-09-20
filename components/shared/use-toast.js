"use client";

import { useSyncExternalStore } from "react";

const TOAST_DURATION = 5000;

let toasts = [];
let idCount = 0;
const listeners = new Set();

function emit() {
  for (const listener of listeners) listener();
}

function dismiss(id) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function toast({ title, description, variant = "default", action } = {}) {
  const id = `toast-${++idCount}`;
  toasts = [...toasts, { id, title, description, variant, action }];
  emit();
  window.setTimeout(() => dismiss(id), TOAST_DURATION);
  return id;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return toasts;
}

function getServerSnapshot() {
  return [];
}

export function useToasts() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { toasts: list, dismiss };
}
