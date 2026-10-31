import { roles } from "@/data/profile";

export function Experience() {
  return (
    <section id="experience" className="relative py-28">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,5vw,64px)]">
        <p className="font-mono text-[0.72rem] tracking-[0.2em] text-signal uppercase">Experience</p>
        <h2 className="mt-3 max-w-xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] font-medium tracking-[-0.03em]">
          Five roles, newest first
        </h2>
        <div className="relative mt-12 max-w-3xl pl-8">
          <div className="pointer-events-none absolute top-3 bottom-3 left-4 w-px -translate-x-1/2" aria-hidden>
            <div className="absolute inset-0 bg-white/15" />
            <div id="timeline-fill" className="absolute inset-0 origin-top bg-signal" style={{ transform: "scaleY(0)" }} />
          </div>
          <ol className="space-y-4">
            {roles.map((role) => (
              <li
                key={`${role.company}-${role.period}`}
                className="relative rounded-2xl border border-white/10 bg-ink/65 p-5 backdrop-blur-md sm:p-6"
              >
                <p className="relative font-mono text-[0.72rem] tracking-[0.14em] text-signal uppercase">
                  <span className="absolute top-1/2 left-[-2.25rem] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal bg-ink sm:left-[-2.5rem]" />
                  {role.period}
                </p>
                <h3 className="mt-2 text-xl font-medium tracking-[-0.02em]">{role.title}</h3>
                <p className="mt-1 text-muted">{role.company}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {role.points.map((point) => (
                    <li key={point} className="pl-4 relative before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-2 before:bg-signal">
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
