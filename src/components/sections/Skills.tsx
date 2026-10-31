import { profile } from "@/data/profile";

export function Skills() {
  return (
    <section id="skills" className="relative pt-24 pb-6 sm:pt-28 sm:pb-8">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,5vw,64px)]">
        <p className="font-mono text-[0.72rem] tracking-[0.2em] text-signal uppercase">Skills</p>
        <h2 className="mt-3 max-w-xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] font-medium tracking-[-0.03em]">
          The tools I ship with
        </h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {profile.skills.map((group) => (
            <li key={group.title} className="rounded-2xl border border-white/10 bg-ink/65 p-5 backdrop-blur-md">
              <h3 className="text-xl font-medium">{group.title}</h3>
              <p className="mt-1 text-sm text-faint">{group.detail}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-2xl border border-white/10 bg-ink/65 p-5 backdrop-blur-md sm:p-6">
          <p className="font-mono text-[0.72rem] tracking-[0.2em] text-signal uppercase">Tools</p>
          <ul className="mt-4 grid gap-2 text-muted sm:grid-cols-2 lg:grid-cols-4">
            {profile.tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-faint">{profile.softSkills}</p>
        </div>
      </div>
    </section>
  );
}
