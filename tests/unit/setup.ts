import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia; framer-motion's useReducedMotion and
// our own prefers-reduced-motion checks rely on it.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList);
}

