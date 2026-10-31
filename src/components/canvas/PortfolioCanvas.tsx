"use client";

import { Component, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { store } from "@/store/store";
import { setWebgl } from "@/store/uiSlice";
import { useAppSelector } from "@/store/hooks";

const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

class WebglBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    store.dispatch(setWebgl("failed"));
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function PortfolioCanvas() {
  const webgl = useAppSelector((state) => state.ui.webgl);

  useEffect(() => {
    if (webgl === "failed") {
      store.dispatch(setWebgl("ready"));
    }
  }, [webgl]);

  if (webgl === "failed") return null;

  return (
    <div className="portfolio-canvas pointer-events-none fixed inset-0 z-0" aria-hidden>
      <WebglBoundary>
        <Scene />
      </WebglBoundary>
    </div>
  );
}
