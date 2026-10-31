import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="relative flex min-h-svh items-center py-28">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,5vw,64px)]">
        <div className="mx-auto grid w-full max-w-xl items-start gap-10 min-[801px]:max-w-5xl min-[801px]:grid-cols-2 min-[801px]:gap-16">
          <div>
            <p className="font-mono text-[0.72rem] tracking-[0.2em] text-signal uppercase">About</p>
            <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] font-medium tracking-[-0.03em]">
              Full stack, from the schema to the screen
            </h2>
            <div className="mt-5 space-y-4 text-muted">
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2">
            {profile.facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-white/10 bg-ink/70 p-4 backdrop-blur-md">
                <dt className="font-mono text-[0.68rem] tracking-[0.14em] text-faint uppercase">{fact.label}</dt>
                <dd className="mt-2 text-sm leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
