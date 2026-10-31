import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section id="hero" className="relative flex min-h-svh items-start min-[901px]:items-center">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,5vw,64px)] pt-24 pb-24 min-[901px]:pt-28 min-[901px]:pb-24">
        <div className="grid items-center gap-12 min-[901px]:grid-cols-[1.04fr_0.96fr] lg:gap-14">
          <div>
            <p className="font-mono text-[0.72rem] tracking-[0.2em] text-signal uppercase">
              {profile.role}
            </p>
            <h1 className="mt-4 max-w-[10ch] font-sans text-[clamp(2.5rem,5.6vw,5.2rem)] leading-[0.94] font-medium tracking-[-0.04em] uppercase">
              {profile.name}
            </h1>
            <p className="mt-6 max-w-[24ch] text-[clamp(1.2rem,2.1vw,1.75rem)] leading-snug text-paper">
              {profile.quote}
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">{profile.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#orbit"
                className="inline-flex h-12 items-center rounded-full bg-paper px-5 text-sm font-medium text-ink transition hover:bg-white"
              >
                View the work
              </a>
              <a
                href="#contact"
                className="inline-flex h-12 items-center rounded-full border border-white/20 px-5 text-sm text-paper transition hover:border-signal"
              >
                Get in touch
              </a>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-white/12 bg-panel/75 p-5 shadow-[0_0_80px_-24px_rgba(94,234,212,0.22)] backdrop-blur-md sm:p-6"
            aria-label="AI and full-stack architecture overview"
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-signal/10 blur-3xl"
              aria-hidden
            />
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 font-mono text-[0.66rem] tracking-[0.18em] text-faint uppercase">
              <span className="flex items-center gap-2 text-signal">
                <span className="h-2 w-2 rounded-full bg-signal shadow-[0_0_10px_#5eead4]" />
                AI // SYSTEM TELEMETRY
              </span>
              <span>STACK v2026</span>
            </div>

            <div className="mt-4">
              <svg
                viewBox="0 0 440 220"
                className="h-auto w-full"
                role="img"
                aria-label="AI workflow connecting Claude and Cursor to frontend, backend, and database layers"
              >
                <defs>
                  <radialGradient id="aiCoreGlow" cx="50%" cy="42%" r="48%">
                    <stop offset="0%" stopColor="rgba(94, 234, 212, 0.28)" />
                    <stop offset="60%" stopColor="rgba(94, 234, 212, 0.06)" />
                    <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
                  </radialGradient>
                </defs>

                {/* Subtle grid lines */}
                <g stroke="rgba(238,242,246,0.05)" strokeWidth="1">
                  <line x1="0" y1="55" x2="440" y2="55" />
                  <line x1="0" y1="110" x2="440" y2="110" />
                  <line x1="0" y1="165" x2="440" y2="165" />
                  <line x1="90" y1="0" x2="90" y2="220" />
                  <line x1="220" y1="0" x2="220" y2="220" />
                  <line x1="350" y1="0" x2="350" y2="220" />
                </g>

                {/* Ambient glow behind AI core */}
                <circle cx="220" cy="64" r="68" fill="url(#aiCoreGlow)" />

                {/* Neural/pipeline links from AI Core to the 3 stack pillars */}
                <g fill="none" stroke="rgba(94, 234, 212, 0.38)" strokeWidth="1.2">
                  <path d="M 220 96 C 220 124, 82 114, 82 144" />
                  <path d="M 220 96 L 220 144" />
                  <path d="M 220 96 C 220 124, 358 114, 358 144" />
                </g>

                {/* Lateral sync links between Frontend, Backend, and Data */}
                <g
                  fill="none"
                  stroke="rgba(139, 151, 168, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                >
                  <line x1="146" y1="172" x2="156" y2="172" />
                  <line x1="284" y1="172" x2="294" y2="172" />
                </g>

                {/* Central AI Core rings */}
                <circle
                  cx="220"
                  cy="56"
                  r="38"
                  fill="rgba(7, 9, 13, 0.85)"
                  stroke="rgba(94, 234, 212, 0.55)"
                  strokeWidth="1.2"
                />
                <circle
                  cx="220"
                  cy="56"
                  r="45"
                  fill="none"
                  stroke="rgba(94, 234, 212, 0.24)"
                  strokeWidth="1"
                  strokeDasharray="5 5"
                />
                <polygon
                  points="220,25 247,40 247,72 220,87 193,72 193,40"
                  fill="rgba(94, 234, 212, 0.08)"
                  stroke="rgba(94, 234, 212, 0.42)"
                  strokeWidth="1"
                />

                {/* Satellite AI agent nodes */}
                <g>
                  <line
                    x1="126"
                    y1="44"
                    x2="175"
                    y2="50"
                    stroke="rgba(94, 234, 212, 0.35)"
                    strokeWidth="1"
                  />
                  <rect
                    x="34"
                    y="28"
                    width="92"
                    height="32"
                    rx="8"
                    fill="rgba(7, 9, 13, 0.9)"
                    stroke="rgba(238, 242, 246, 0.16)"
                  />
                  <text
                    x="80"
                    y="43"
                    textAnchor="middle"
                    fill="#eef2f6"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                  >
                    CLAUDE
                  </text>
                  <text
                    x="80"
                    y="54"
                    textAnchor="middle"
                    fill="#8b97a8"
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                  >
                    PLAN &amp; ARCH
                  </text>

                  <line
                    x1="265"
                    y1="50"
                    x2="314"
                    y2="44"
                    stroke="rgba(94, 234, 212, 0.35)"
                    strokeWidth="1"
                  />
                  <rect
                    x="314"
                    y="28"
                    width="92"
                    height="32"
                    rx="8"
                    fill="rgba(7, 9, 13, 0.9)"
                    stroke="rgba(238, 242, 246, 0.16)"
                  />
                  <text
                    x="360"
                    y="43"
                    textAnchor="middle"
                    fill="#eef2f6"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                  >
                    CURSOR
                  </text>
                  <text
                    x="360"
                    y="54"
                    textAnchor="middle"
                    fill="#8b97a8"
                    fontSize="8"
                    fontFamily="var(--font-mono)"
                  >
                    AI CODEGEN
                  </text>
                </g>

                {/* Central AI Core label */}
                <text
                  x="220"
                  y="53"
                  textAnchor="middle"
                  fill="#5eead4"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  letterSpacing="1.5"
                >
                  AI CORE
                </text>
                <text
                  x="220"
                  y="66"
                  textAnchor="middle"
                  fill="#eef2f6"
                  fontSize="8.5"
                  fontFamily="var(--font-mono)"
                >
                  WORKFLOW
                </text>

                {/* Signal junction nodes */}
                <circle cx="220" cy="96" r="3.5" fill="#5eead4" />
                <circle cx="82" cy="144" r="3" fill="#5eead4" />
                <circle cx="220" cy="144" r="3" fill="#5eead4" />
                <circle cx="358" cy="144" r="3" fill="#5eead4" />

                {/* Pillar 1: Frontend */}
                <g>
                  <rect
                    x="18"
                    y="144"
                    width="128"
                    height="58"
                    rx="10"
                    fill="rgba(7, 9, 13, 0.9)"
                    stroke="rgba(94, 234, 212, 0.4)"
                  />
                  <text
                    x="82"
                    y="163"
                    textAnchor="middle"
                    fill="#5eead4"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    letterSpacing="1.2"
                  >
                    INTERFACE
                  </text>
                  <text
                    x="82"
                    y="179"
                    textAnchor="middle"
                    fill="#eef2f6"
                    fontSize="10.5"
                    fontFamily="var(--font-sans)"
                  >
                    React · Next.js
                  </text>
                  <text
                    x="82"
                    y="193"
                    textAnchor="middle"
                    fill="#8b97a8"
                    fontSize="8.5"
                    fontFamily="var(--font-mono)"
                  >
                    TS · Tailwind · AG Grid
                  </text>
                </g>

                {/* Pillar 2: Backend & Queues */}
                <g>
                  <rect
                    x="156"
                    y="144"
                    width="128"
                    height="58"
                    rx="10"
                    fill="rgba(7, 9, 13, 0.9)"
                    stroke="rgba(94, 234, 212, 0.4)"
                  />
                  <text
                    x="220"
                    y="163"
                    textAnchor="middle"
                    fill="#5eead4"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    letterSpacing="1.2"
                  >
                    SERVICES
                  </text>
                  <text
                    x="220"
                    y="179"
                    textAnchor="middle"
                    fill="#eef2f6"
                    fontSize="10.5"
                    fontFamily="var(--font-sans)"
                  >
                    Node.js · NestJS
                  </text>
                  <text
                    x="220"
                    y="193"
                    textAnchor="middle"
                    fill="#8b97a8"
                    fontSize="8.5"
                    fontFamily="var(--font-mono)"
                  >
                    REST · Spring · BullMQ
                  </text>
                </g>

                {/* Pillar 3: Data Stores */}
                <g>
                  <rect
                    x="294"
                    y="144"
                    width="128"
                    height="58"
                    rx="10"
                    fill="rgba(7, 9, 13, 0.9)"
                    stroke="rgba(94, 234, 212, 0.4)"
                  />
                  <text
                    x="358"
                    y="163"
                    textAnchor="middle"
                    fill="#5eead4"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    letterSpacing="1.2"
                  >
                    DATA LAYER
                  </text>
                  <text
                    x="358"
                    y="179"
                    textAnchor="middle"
                    fill="#eef2f6"
                    fontSize="10.5"
                    fontFamily="var(--font-sans)"
                  >
                    PostgreSQL · Redis
                  </text>
                  <text
                    x="358"
                    y="193"
                    textAnchor="middle"
                    fill="#8b97a8"
                    fontSize="8.5"
                    fontFamily="var(--font-mono)"
                  >
                    Supabase · MongoDB
                  </text>
                </g>
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 border-t border-white/10 pt-4">
              <div className="rounded-xl border border-white/8 bg-ink/70 px-3 py-2.5">
                <p className="font-mono text-[0.64rem] tracking-[0.14em] text-faint uppercase">
                  Experience
                </p>
                <p className="mt-1 text-sm font-medium text-paper">4 Years</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-ink/70 px-3 py-2.5">
                <p className="font-mono text-[0.64rem] tracking-[0.14em] text-faint uppercase">
                  Delivered
                </p>
                <p className="mt-1 text-sm font-medium text-paper">10+ Enterprise Systems</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-ink/70 px-3 py-2.5">
                <p className="font-mono text-[0.64rem] tracking-[0.14em] text-faint uppercase">
                  Role
                </p>
                <p className="mt-1 text-sm font-medium text-signal">Team Lead</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[0.66rem] tracking-[0.22em] text-faint uppercase">
        Scroll
        <span className="scroll-cue-line block h-9 w-px bg-linear-to-b from-muted to-transparent" />
      </div>
    </section>
  );
}
