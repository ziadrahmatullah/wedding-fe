import { createContext, useContext } from "react";
import type { RefObject } from "react";

export const ScrollContainerContext =
  createContext<RefObject<HTMLElement | null> | null>(null);

export function useScrollContainerRef() {
  return useContext(ScrollContainerContext);
}
