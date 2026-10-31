"use client";
"use no memo";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { projects } from "@/data/profile";
import {
  applyDom,
  computeSnapshot,
  lenisRef,
  measureSections,
  scrollState,
  scrollToId,
  scrollToProject,
} from "@/lib/scroll";
import { store } from "@/store/store";
import { openCase, setActiveProject, setChapter, setHoveredProject, setMenuOpen } from "@/store/uiSlice";

function projectIndexFrom(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  const el = target.closest("[data-project-index]");
  if (!el) return null;
  const value = Number(el.getAttribute("data-project-index"));
  return Number.isInteger(value) ? value : null;
}

export function ScrollEngine() {
  useEffect(() => {
    // Live section rect measurement keeps scrollToProject and rangeProgress accurate across resizes.
    let lenis: Lenis | null = null;
    let frame = 0;
    let generation = 0;

    const publish = (force = false) => {
      const next = computeSnapshot(window.scrollY);
      const prev = scrollState.current;
      if (
        !force &&
        prev.y === next.y &&
        prev.chapter === next.chapter &&
        prev.activeProject === next.activeProject &&
        prev.pinnedWork === next.pinnedWork &&
        prev.reduced === next.reduced &&
        prev.mobile === next.mobile
      ) {
        return;
      }
      scrollState.current = next;
      applyDom(next);
      if (prev.chapter !== next.chapter) store.dispatch(setChapter(next.chapter));
      if (prev.activeProject !== next.activeProject) {
        store.dispatch(setActiveProject(next.activeProject));
      }
    };

    const refresh = () => {
      measureSections();
      publish(true);
    };

    const setup = () => {
      generation += 1;
      const gen = generation;
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = null;
      lenisRef.current = null;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        lenis = new Lenis({ lerp: 0.085, smoothWheel: true, autoRaf: false });
        lenisRef.current = lenis;
        const loop = (time: number) => {
          if (gen !== generation) return;
          lenis?.raf(time);
          publish();
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      }
      refresh();
    };

    const onScroll = () => {
      if (!lenisRef.current) publish();
    };

    const onResize = () => refresh();

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const caseButton = target.closest("[data-open-case]");
      if (caseButton) {
        const id = caseButton.getAttribute("data-open-case");
        if (id && projects.some((project) => project.id === id)) {
          store.dispatch(openCase(id));
        }
        return;
      }

      const projectButton = target.closest("[data-project-index]");
      if (projectButton instanceof HTMLButtonElement) {
        const index = projectIndexFrom(projectButton);
        if (index !== null) scrollToProject(index);
        return;
      }

      const link = target.closest('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id)) return;
      event.preventDefault();
      store.dispatch(setMenuOpen(false));
      scrollToId(id);
    };

    const onPointer = (event: PointerEvent) => {
      const index = projectIndexFrom(event.target);
      if (store.getState().ui.hoveredProject !== index) {
        store.dispatch(setHoveredProject(index));
      }
    };

    setup();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onPointer);
    const observer = new ResizeObserver(onResize);
    observer.observe(document.documentElement);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", setup);
    const mounted = generation;
    document.fonts?.ready.then(() => {
      if (mounted === generation) refresh();
    });

    return () => {
      generation += 1;
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenisRef.current = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onPointer);
      observer.disconnect();
      motion.removeEventListener("change", setup);
    };
  }, []);

  return null;
}
