"use client";

import { useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useAppSelector } from "@/store/hooks";
import { ScrollEngine } from "@/components/scroll/ScrollEngine";

function WebglClass() {
  const webgl = useAppSelector((state) => state.ui.webgl);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("webgl-ready", webgl === "ready" || webgl === "reduced");
    root.classList.toggle("webgl-failed", webgl === "failed");
  }, [webgl]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ScrollEngine />
      <WebglClass />
      {children}
    </Provider>
  );
}
