/// <reference types="vite/client" />

interface GoatCounter {
  count: (options: { path: string; title?: string }) => void;
}

interface Window {
  goatcounter?: GoatCounter;
}
