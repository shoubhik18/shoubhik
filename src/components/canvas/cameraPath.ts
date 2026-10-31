import { projects } from "@/data/profile";
import { clamp, smoothstep, type ScrollSnapshot } from "@/lib/scroll";
import { store } from "@/store/store";

export const RING_RADIUS = 2.6;
export const ORBIT_RADII: [number, number, number, number] = [3.05, 2.05, 2.4, 3.35];
const ORBIT_ANGLES: [number, number, number, number] = [2.98, 2.55, 1.05, 0.42];
const ORBIT_ELEVATIONS: [number, number, number, number] = [0.06, -0.08, 0.1, -0.1];

export const nodePositions: [number, number, number][] = [0, 1, 2, 3].map((index) => {
  const radius = ORBIT_RADII[index];
  const theta = ORBIT_ANGLES[index];
  const y = ORBIT_ELEVATIONS[index];
  return [
    Math.cos(theta) * radius,
    y,
    Math.sin(theta) * radius,
  ];
});

export type SceneMotionState = {
  dim: number;
  focus: number;
  scale: number;
  coreVisible: number;
  planetVisible: number;
  workBlend: number;
};

const motionRuntime = globalThis as typeof globalThis & {
  __portfolioMotion?: SceneMotionState;
};

export const sceneMotion: SceneMotionState = motionRuntime.__portfolioMotion ?? {
  dim: 0,
  focus: -1,
  scale: 0,
  coreVisible: 0,
  planetVisible: 0,
  workBlend: 0,
};
motionRuntime.__portfolioMotion = sceneMotion;

export function computeVisibility() {
  const vh = Math.max(1, window.innerHeight);
  const orbitEl = document.getElementById("orbit");
  const workEl = document.getElementById("work");
  const aboutEl = document.getElementById("about");

  const orbitTop = orbitEl ? orbitEl.getBoundingClientRect().top : vh;
  const workTop = workEl ? workEl.getBoundingClientRect().top : vh * 3;
  const aboutTop = aboutEl ? aboutEl.getBoundingClientRect().top : vh * 6;

  // orbitTop goes from +vh (at top of Hero) down to 0 (when Systems reaches the top of the screen).
  const orbitEnter = smoothstep(0, 1, clamp((vh * 0.78 - orbitTop) / (vh * 0.72), 0, 1));
  // Fade out the large central globe early as Work scrolls up so it never overlaps the Work slides.
  const coreFadeOut = smoothstep(0, 1, clamp((vh * 0.92 - workTop) / (vh * 0.42), 0, 1));
  // Transition the smaller planets from their orbital rings to the Work 01..04 numbers.
  const toWork = smoothstep(0, 1, clamp((vh * 0.85 - workTop) / (vh * 0.65), 0, 1));
  // Fade out planets as About enters the screen.
  const pastWork = smoothstep(0, 1, clamp((vh * 0.75 - aboutTop) / (vh * 0.5), 0, 1));

  return {
    coreVisible: orbitEnter * (1 - coreFadeOut),
    planetVisible: orbitEnter * (1 - pastWork),
    workBlend: toWork * (1 - pastWork),
  };
}

export function nodeScaleFor(snapshot: ScrollSnapshot, coreVis: number) {
  if (snapshot.reduced) return coreVis * 0.65;
  const expand = 0.92 + 0.08 * smoothstep(0, 0.28, snapshot.orbit);
  const mobileFactor = snapshot.mobile ? 0.78 : 1;
  return expand * mobileFactor;
}

export type Pose = {
  px: number;
  py: number;
  pz: number;
  lx: number;
  ly: number;
  lz: number;
  dim: number;
  focus: number;
};

const ORBIT_APPROACH: Pose = {
  px: -0.25,
  py: 2.85,
  pz: 10.5,
  lx: -0.1,
  ly: 0.16,
  lz: 0.3,
  dim: 0.1,
  focus: -1,
};

const ORBIT: Pose = {
  px: -0.25,
  py: 2.55,
  pz: 9.5,
  lx: -0.1,
  ly: 0.16,
  lz: 0.3,
  dim: 0,
  focus: -1,
};

const ORBIT_MOBILE: Pose = {
  px: 0.15,
  py: 2.9,
  pz: 11.2,
  lx: 0.15,
  ly: 0.05,
  lz: 0.3,
  dim: 0.08,
  focus: -1,
};

const WORK_CAMERA: Pose = {
  px: 0,
  py: 0,
  pz: 5.4,
  lx: 0,
  ly: 0,
  lz: 0,
  dim: 0.15,
  focus: 0,
};

const REST: Pose = {
  px: 0,
  py: 2.2,
  pz: 12.4,
  lx: 0,
  ly: 0,
  lz: 0,
  dim: 0.85,
  focus: -1,
};

function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const u = 1 - t;
  return {
    px: a.px * u + b.px * t,
    py: a.py * u + b.py * t,
    pz: a.pz * u + b.pz * t,
    lx: a.lx * u + b.lx * t,
    ly: a.ly * u + b.ly * t,
    lz: a.lz * u + b.lz * t,
    dim: a.dim * u + b.dim * t,
    focus: a.focus * u + b.focus * t,
  };
}

export function poseFor(snapshot: ScrollSnapshot, coreVis: number, workBlend: number): Pose {
  if (snapshot.reduced) return REST;

  const baseOrbit = snapshot.mobile
    ? ORBIT_MOBILE
    : lerpPose(ORBIT_APPROACH, ORBIT, coreVis);

  const workFocus = snapshot.work * Math.max(projects.length - 1, 1);
  const workPose: Pose = {
    ...WORK_CAMERA,
    focus: workFocus,
  };

  return lerpPose(baseOrbit, workPose, workBlend);
}

export function highlightAmount(index: number) {
  const hover = store.getState().ui.hoveredProject;
  if ((sceneMotion.workBlend ?? 0) < 0.2 && hover !== null) {
    return hover === index ? 1 : 0.08;
  }
  if ((sceneMotion.workBlend ?? 0) > 0.05) {
    const focus = sceneMotion.focus ?? 0;
    return Math.max(0.25, 1 - Math.abs(focus - index) * 0.75);
  }
  return 0.35;
}
