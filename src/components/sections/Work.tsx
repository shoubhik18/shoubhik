import { projects } from "@/data/profile";
import { ArchitectureFrame } from "@/components/frames/ArchitectureFrame";

export function Work() {
  return (
    <section id="work" className="relative">
      <div id="work-sticky" className="sticky top-0 h-svh overflow-hidden">
        <div id="work-track" className="flex h-full w-max will-change-transform">
          {projects.map((project, index) => (
            <article
              key={project.id}
              id={`project-${project.id}`}
              className="flex h-full w-[100cqi] shrink-0 items-center px-[clamp(20px,5vw,64px)] py-14 min-[901px]:pt-24 min-[901px]:pb-28"
            >
              <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <p className="font-sans text-[clamp(3.2rem,8vw,6.5rem)] leading-none font-light text-transparent [-webkit-text-stroke:1px_rgba(94,234,212,0.65)]">
                    <span id={`work-num-${index}`} className="inline-block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </p>
                  <p className="mt-2 font-mono text-[0.72rem] tracking-[0.16em] text-signal uppercase">
                    {project.category}
                  </p>
                  <h2 className="mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.05] font-medium tracking-[-0.03em]">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-lg text-paper">{project.client}</p>
                  <p className="mt-4 max-w-md text-muted">{project.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-white/15 bg-ink/40 px-3 py-1 text-xs text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      data-open-case={project.id}
                      className="inline-flex h-11 items-center rounded-full bg-paper px-4 text-sm font-medium text-ink"
                    >
                      Read the build
                    </button>
                    {project.url ? (
                      <a href={project.url} className="text-sm text-signal" target="_blank" rel="noreferrer">
                        Open site
                      </a>
                    ) : null}
                    {project.repo ? (
                      <a href={project.repo} className="text-sm text-signal" target="_blank" rel="noreferrer">
                        Repository
                      </a>
                    ) : null}
                  </div>
                </div>
                <ArchitectureFrame project={project} />
              </div>
            </article>
          ))}
        </div>

        <div
          id="work-hud"
          className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-linear-to-t from-ink via-ink/80 to-transparent px-[clamp(20px,5vw,64px)] pt-10 pb-6"
        >
          <p className="font-mono text-sm tracking-[0.12em] text-faint">
            <span id="work-counter" className="text-xl text-paper">
              01
            </span>
            <span> / {String(projects.length).padStart(2, "0")}</span>
          </p>
          <div className="h-px flex-1 bg-white/15">
            <div id="hud-bar" className="h-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
          </div>
          <div className="flex items-center gap-1.5">
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                data-project-index={index}
                aria-label={`Jump to ${String(index + 1).padStart(2, "0")} ${project.title}`}
                className="rounded-full border border-white/15 bg-ink/70 px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.12em] text-muted transition hover:border-signal hover:text-paper"
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
