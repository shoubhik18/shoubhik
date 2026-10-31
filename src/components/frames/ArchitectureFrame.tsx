import type { ReactNode } from "react";
import type { Project } from "@/data/profile";

function Frame({
  label,
  title,
  children,
}: {
  label: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <figure className="group relative h-[min(54vh,450px)] overflow-hidden rounded-2xl border border-white/14 bg-panel/85 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.85)]">
      <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[0.68rem] tracking-[0.16em] text-faint uppercase">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          <span className="text-signal">sys</span>
          {label}
        </span>
        {title ? <span className="truncate text-[0.64rem] text-muted">{title}</span> : null}
      </figcaption>
      <div className="relative h-[calc(100%-2.6rem)] p-2.5 sm:p-3">{children}</div>
    </figure>
  );
}

function Diagram({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 420 280"
      className="h-full w-full"
      role="img"
      aria-hidden="true"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      {children}
    </svg>
  );
}

function Block({
  x,
  y,
  w,
  h,
  title,
  note,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  note?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill="#07090d"
        stroke="#5eead4"
        strokeOpacity={0.7}
      />
      <text
        x={x + w / 2}
        y={note ? y + h / 2 - 4 : y + h / 2 + 5}
        textAnchor="middle"
        fill="#eef2f6"
        fontSize={13}
      >
        {title}
      </text>
      {note ? (
        <text x={x + w / 2} y={y + h / 2 + 16} textAnchor="middle" fill="#8b97a8" fontSize={11}>
          {note}
        </text>
      ) : null}
    </g>
  );
}

function Wire({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#5eead4" strokeOpacity={0.4} strokeWidth={1.25} />;
}

function CrmDiagram() {
  return (
    <Diagram>
      <Wire d="M110 92 V128 H210 V92" />
      <Wire d="M210 186 V214" />
      <Block x={28} y={28} w={150} h={64} title="User module" note="CRUD" />
      <Block x={242} y={28} w={150} h={64} title="Contact module" note="CRUD" />
      <Block x={135} y={128} w={150} h={58} title="REST API" />
      <Block x={115} y={214} w={190} h={52} title="PostgreSQL" />
    </Diagram>
  );
}

function CommerceDiagram() {
  return (
    <Diagram>
      <Wire d="M70 96 V124 H350 V96" />
      <Wire d="M210 182 V210" />
      <Block x={16} y={24} w={120} h={72} title="Storefront" />
      <Block x={150} y={24} w={120} h={72} title="Cart" />
      <Block x={284} y={24} w={120} h={72} title="Checkout" />
      <Block x={110} y={124} w={200} h={58} title="Supabase" note="data" />
      <Block x={110} y={210} w={200} h={52} title="Admin panel" note="products, orders, users" />
    </Diagram>
  );
}

function RmsDiagram() {
  return (
    <Diagram>
      <Wire d="M70 100 V128 H350 V100" />
      <Wire d="M210 186 V214" />
      <Block x={16} y={24} w={120} h={76} title="Candidates" note="CRUD" />
      <Block x={150} y={24} w={120} h={76} title="Openings" note="CRUD" />
      <Block x={284} y={24} w={120} h={76} title="Companies" note="CRUD" />
      <Block x={120} y={128} w={180} h={58} title="AG Grid" />
      <Block x={110} y={214} w={200} h={52} title="PostgreSQL" />
    </Diagram>
  );
}

function MlmDiagram() {
  return (
    <Diagram>
      <Wire d="M210 58 V92" />
      <Wire d="M210 124 L120 168" />
      <Wire d="M210 124 L210 168" />
      <Wire d="M210 124 L300 168" />
      <Wire d="M120 196 V214 H300 V196" />
      <circle cx={210} cy={40} r={18} fill="#07090d" stroke="#5eead4" strokeOpacity={0.8} />
      <text x={210} y={44} textAnchor="middle" fill="#eef2f6" fontSize={11}>
        root
      </text>
      {[
        [120, 186],
        [210, 186],
        [300, 186],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={14}
          fill="#07090d"
          stroke="#5eead4"
          strokeOpacity={0.7}
        />
      ))}
      <Block x={70} y={214} w={120} h={48} title="BullMQ" />
      <Block x={230} y={214} w={120} h={48} title="Redis" />
    </Diagram>
  );
}

const diagrams = {
  crm: CrmDiagram,
  loam: CommerceDiagram,
  rms: RmsDiagram,
  mlm: MlmDiagram,
};

export function ArchitectureFrame({ project }: { project: Project }) {
  if (project.image) {
    return (
      <Frame label={project.id} title={project.title}>
        <button
          type="button"
          data-open-case={project.id}
          aria-label={`Inspect ${project.title} build`}
          className="relative block h-full w-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-ink text-left"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.title} — ${project.client}`}
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-ink/80 via-ink/25 to-transparent" />
        </button>
      </Frame>
    );
  }

  const DiagramFor = diagrams[project.id as keyof typeof diagrams] ?? CrmDiagram;
  return (
    <Frame label={project.id} title={project.title}>
      <DiagramFor />
    </Frame>
  );
}
