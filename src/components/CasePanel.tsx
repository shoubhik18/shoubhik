"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data/profile";
import { lenisRef } from "@/lib/scroll";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeCase, openCase } from "@/store/uiSlice";
import { store } from "@/store/store";

export function CasePanel() {
  const caseId = useAppSelector((state) => state.ui.caseId);
  const dispatch = useAppDispatch();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const project = projects.find((item) => item.id === caseId) ?? null;
  const index = project ? projects.findIndex((item) => item.id === project.id) : -1;

  useEffect(() => {
    if (!project) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lenisRef.current?.stop();
    document.documentElement.classList.add("scroll-locked");
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(closeCase());
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>("a, button");
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (!store.getState().ui.menuOpen) {
        document.documentElement.classList.remove("scroll-locked");
        lenisRef.current?.start();
      }
      returnFocus.current?.focus();
    };
  }, [dispatch, project]);

  if (!project) return null;

  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-title"
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto bg-ink/95 backdrop-blur-md"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between bg-linear-to-b from-ink to-transparent px-[clamp(20px,5vw,64px)] py-4">
        <p className="font-mono text-xs tracking-[0.14em] text-muted">
          {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={() => dispatch(closeCase())}
          className="rounded-full border border-white/20 px-4 py-2 text-sm"
        >
          Close
        </button>
      </div>
      <div className="mx-auto w-full max-w-3xl px-[clamp(20px,5vw,64px)] pb-24">
        <p className="font-mono text-[0.72rem] tracking-[0.16em] text-signal uppercase">{project.category}</p>
        <h2 id="case-title" className="mt-3 text-[clamp(2.2rem,5vw,4.2rem)] leading-none font-medium tracking-[-0.04em]" tabIndex={-1}>
          {project.title}
        </h2>
        <p className="mt-4 text-xl">{project.client}</p>
        <p className="mt-4 max-w-2xl text-muted">{project.summary}</p>
        {project.image ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/12 bg-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={`${project.title} — ${project.client}`}
              className="h-auto w-full object-cover object-top"
            />
          </div>
        ) : null}
        <dl className="mt-8 flex flex-wrap gap-8 border-t border-white/10 pt-5">
          <div>
            <dt className="font-mono text-[0.66rem] tracking-[0.14em] text-faint uppercase">Stack</dt>
            <dd className="mt-1">{project.stack.join(", ")}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.66rem] tracking-[0.14em] text-faint uppercase">Outcome</dt>
            <dd className="mt-1 max-w-md">{project.outcome}</dd>
          </div>
        </dl>
        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="text-2xl font-medium">What I built</h3>
          <ul className="mt-4 space-y-3 text-muted">
            {project.points.map((point) => (
              <li key={point} className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-signal">
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-4">
            {project.url ? (
              <a href={project.url} target="_blank" rel="noreferrer" className="text-signal">
                Open site
              </a>
            ) : null}
            {project.repo ? (
              <a href={project.repo} target="_blank" rel="noreferrer" className="text-signal">
                Repository
              </a>
            ) : null}
          </div>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {previous ? (
            <button
              type="button"
              onClick={() => dispatch(openCase(previous.id))}
              className="rounded-2xl border border-white/15 px-4 py-4 text-left"
            >
              <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-faint uppercase">Previous</span>
              <span className="mt-1 block text-lg">{previous.title}</span>
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button
              type="button"
              onClick={() => dispatch(openCase(next.id))}
              className="rounded-2xl border border-white/15 px-4 py-4 text-right"
            >
              <span className="block font-mono text-[0.66rem] tracking-[0.14em] text-faint uppercase">Next</span>
              <span className="mt-1 block text-lg">{next.title}</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
