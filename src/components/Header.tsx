"use client";

import { useEffect } from "react";
import type { ChapterId } from "@/lib/scroll";
import { lenisRef } from "@/lib/scroll";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMenuOpen } from "@/store/uiSlice";
import { store } from "@/store/store";

const nav: { id: ChapterId; label: string }[] = [
  { id: "hero", label: "Home" },
  { id: "orbit", label: "Systems" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Header() {
  const dispatch = useAppDispatch();
  const chapter = useAppSelector((state) => state.ui.activeChapter);
  const menuOpen = useAppSelector((state) => state.ui.menuOpen);

  useEffect(() => {
    if (!menuOpen) return;
    lenisRef.current?.stop();
    document.documentElement.classList.add("scroll-locked");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(setMenuOpen(false));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (!store.getState().ui.caseId) {
        document.documentElement.classList.remove("scroll-locked");
        lenisRef.current?.start();
      }
    };
  }, [dispatch, menuOpen]);

  return (
    <>
    <header id="site-header" className="fixed inset-x-0 top-0 z-40 border-b border-transparent">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between px-[clamp(20px,5vw,64px)]">
        <a href="#hero" className="flex items-center gap-3 text-sm font-medium">
          <span className="grid h-7 w-7 place-items-center border border-paper/80 font-mono text-[0.62rem] text-signal">
            SP
          </span>
          <span className="hidden sm:inline">Shoubhik Pan</span>
        </a>
        <nav className="hidden min-[901px]:block" aria-label="Primary">
          <ul className="flex items-center gap-5">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={chapter === item.id ? "true" : undefined}
                  className={`text-sm transition ${chapter === item.id ? "text-paper" : "text-muted hover:text-paper"}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/20 min-[901px]:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => dispatch(setMenuOpen(!menuOpen))}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="flex w-4 flex-col gap-1.5" aria-hidden>
            <span className={`h-px bg-paper transition ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px bg-paper transition ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10">
        <div id="scroll-progress" className="h-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
      </div>
    </header>
    {menuOpen ? (
      <nav id="mobile-nav" className="fixed inset-0 top-[68px] z-30 overflow-y-auto bg-ink px-[clamp(20px,5vw,64px)] py-6 min-[901px]:hidden" aria-label="Mobile">
        <ul>
          {nav.map((item, index) => (
            <li key={item.id} className="border-b border-white/10">
              <a
                href={`#${item.id}`}
                aria-current={chapter === item.id ? "true" : undefined}
                className="flex items-baseline gap-4 py-4 text-2xl"
              >
                <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    ) : null}
    </>
  );
}
