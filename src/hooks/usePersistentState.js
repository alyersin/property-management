"use client";

import { useEffect, useRef, useState } from "react";

const isObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mergeStates = (base, updates) => {
  if (isObject(base) && isObject(updates)) {
    return { ...base, ...updates };
  }
  return updates;
};

export default function usePersistentState(storageKey, defaultValue) {
  const isClient = typeof window !== "undefined";
  const [state, setState] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(!isClient);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!isClient) return;

    try {
      const storedValue = window.localStorage.getItem(storageKey);
      if (storedValue !== null) {
        const parsed = JSON.parse(storedValue);
        setState((prev) => mergeStates(prev, parsed));
      }
    } catch (error) {
      console.warn(`Failed to read localStorage key "${storageKey}"`, error);
    } finally {
      setHydrated(true);
    }
  }, [isClient, storageKey]);

  useEffect(() => {
    if (!isClient || !hydrated) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn(`Failed to write localStorage key "${storageKey}"`, error);
    }
  }, [hydrated, isClient, state, storageKey]);

  return [state, setState, hydrated];
}

