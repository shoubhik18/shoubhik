import type Lenis from "lenis";
import { projects } from "@/data/profile";

export const chapters = [
  "hero",
  "orbit",
  "work",
  "about",
  "experience",
  "skills",
  "contact",
] as const;

export type ChapterId = (typeof chapters)[number];

export type ScrollSnapshot = {
  y: number;
  progress: number;
  chapter: ChapterId;
  hero: number;
  orbit: number;
  work: number;
  timeline: number;
  activeProject: number;
  pinnedWork: boolean;
  reduced: boolean;
  mobile: boolean;
};

type Box = { id: ChapterId; top: number; height: number };

const initial: ScrollSnapshot = {
  y: 0,
  progress: 0,
  chapter: "hero",
  hero: 0,
  orbit: 0,
  work: 0,
  timeline: 0,
  activeProject: 0,
  pinnedWork: true,
  reduced: false,
  mobile: false,
};

const runtime = globalThis as typeof globalThis & {
  __portfolioScroll?: { current: ScrollSnapshot };
  __portfolioLenis?: { current: Lenis | null };
};

export const scrollState = runtime.__portfolioScroll ?? { current: initial };
runtime.__portfolioScroll = scrollState;

export const lenisRef = runtime.__portfolioLenis ?? { current: null };
runtime.__portfolioLenis = lenisRef;

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0: number, edge1: number, value: number) {
  if (edge1 <= edge0) return value >= edge1 ? 1 : 0;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function readFlags() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  return { reduced, mobile, pinnedWork: !reduced && !mobile };
}

function readBox(id: ChapterId, y: number): Box {
  const el = document.getElementById(id);
  if (!el) return { id, top: 0, height: 0 };
  const rect = el.getBoundingClientRect();
  return { id, top: rect.top + y, height: rect.height };
}

export function measureSections() {
  // Section positions are read live via getBoundingClientRect so they never go stale across resizes.
}

function rangeProgress(id: ChapterId, y: number, vh: number) {
  const box = readBox(id, y);
  if (box.height <= 0) return 0;
  const travel = box.height - vh;
  if (travel <= 8) {
    const anchor = y + vh * 0.55;
    if (anchor <= box.top) return 0;
    if (anchor >= box.top + box.height) return 1;
    return (anchor - box.top) / box.height;
  }
  return clamp((y - box.top) / travel, 0, 1);
}

function chapterAt(y: number, vh: number): ChapterId {
  const anchor = y + vh * 0.35;
  let current: ChapterId = "hero";
  for (const id of chapters) {
    const box = readBox(id, y);
    if (box.height > 0 && anchor >= box.top) current = box.id;
  }
  return current;
}

export function computeSnapshot(y: number): ScrollSnapshot {
  const flags = readFlags();
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  const work = rangeProgress("work", y, vh);

  return {
    y,
    progress: max <= 0 ? 0 : clamp(y / max, 0, 1),
    chapter: chapterAt(y, vh),
    hero: rangeProgress("hero", y, vh),
    orbit: rangeProgress("orbit", y, vh),
    work,
    timeline: rangeProgress("experience", y, vh),
    activeProject: Math.min(projects.length - 1, Math.max(0, Math.round(work * (projects.length - 1)))),
    pinnedWork: flags.pinnedWork,
    reduced: flags.reduced,
    mobile: flags.mobile,
  };
}

export function scrollToY(y: number) {
  const reduced = scrollState.current.reduced;
  if (lenisRef.current && !reduced) {
    lenisRef.current.scrollTo(y, { duration: 0.95 });
    return;
  }
  window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(y);
}

export function scrollToProject(index: number) {
  const project = projects[index];
  if (!project) return;
  if (!scrollState.current.pinnedWork) {
    scrollToId(`project-${project.id}`);
    return;
  }
  const box = readBox("work", window.scrollY);
  if (box.height <= 0) {
    scrollToId("work");
    return;
  }
  const travel = Math.max(box.height - window.innerHeight, 0);
  const t = index / Math.max(projects.length - 1, 1);
  scrollToY(box.top + t * travel);
}

export function applyDom(snapshot: ScrollSnapshot) {
  const progress = document.getElementById("scroll-progress");
  if (progress) progress.style.transform = `scaleX(${snapshot.progress})`;

  document.getElementById("site-header")?.classList.toggle("is-scrolled", snapshot.y > 12);

  const track = document.getElementById("work-track");
  const sticky = document.getElementById("work-sticky");
  if (track) {
    if (snapshot.pinnedWork) {
      const width = sticky?.clientWidth || window.innerWidth;
      const x = -snapshot.work * (projects.length - 1) * width;
      track.style.transform = `translate3d(${x}px,0,0)`;
    } else {
      track.style.transform = "none";
    }
  }

  const hud = document.getElementById("hud-bar");
  if (hud) hud.style.transform = `scaleX(${snapshot.pinnedWork ? snapshot.work : 0})`;

  const counter = document.getElementById("work-counter");
  if (counter) counter.textContent = String(snapshot.activeProject + 1).padStart(2, "0");

  const fill = document.getElementById("timeline-fill");
  if (fill) fill.style.transform = `scaleY(${snapshot.reduced ? 1 : snapshot.timeline})`;

  const spots = document.getElementById("orbit-hotspots");
  if (spots) {
    const live =
      !snapshot.reduced &&
      !snapshot.mobile &&
      snapshot.chapter === "orbit" &&
      snapshot.orbit > 0.08 &&
      snapshot.orbit < 0.82;
    spots.style.opacity = live ? "1" : "0";
    if (live) spots.removeAttribute("inert");
    else spots.setAttribute("inert", "");
  }
}
