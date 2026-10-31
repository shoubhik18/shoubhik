import { projects } from "@/data/profile";

export function Orbit() {
  return (
    <section id="orbit" className="relative">
      <div id="orbit-sticky" className="py-20 min-[901px]:sticky min-[901px]:top-0 min-[901px]:h-svh min-[901px]:overflow-hidden min-[901px]:py-0">
        <div className="mx-auto w-full max-w-6xl px-[clamp(20px,5vw,64px)] min-[901px]:pt-28">
          <p className="font-mono text-[0.72rem] tracking-[0.2em] text-signal uppercase">Systems</p>
          <h2 className="mt-3 max-w-[16ch] text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">
            Four products on one stack
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            CRM, commerce, hiring, and a referral platform. Hover a node, or use the list to open that chapter.
          </p>
        </div>

        <div id="orbit-hotspots" className="absolute inset-0" inert>
          {projects.map((project, index) => (
            <button
              key={project.id}
              id={`hotspot-${index}`}
              type="button"
              data-project-index={index}
              aria-label={`${project.title}, ${project.client}`}
              className="group absolute z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2"
              style={{ left: "50%", top: "46%" }}
            >
              <span className="absolute inset-0 rounded-full border border-white/40 transition group-hover:scale-110 group-hover:border-signal group-focus-visible:border-signal" />
              <span className="pointer-events-none absolute top-[calc(100%+12px)] left-1/2 w-max -translate-x-1/2 rounded-lg border border-white/15 bg-ink/85 px-3 py-2 text-left opacity-0 backdrop-blur-md transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="block font-mono text-[0.68rem] tracking-[0.14em] text-signal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="block text-sm">{project.title}</span>
                <span className="block text-xs text-muted">{project.client}</span>
              </span>
            </button>
          ))}
        </div>

        <div id="orbit-list" className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent px-[clamp(20px,5vw,64px)] pt-16 pb-6 max-[900px]:relative max-[900px]:mt-12 max-[900px]:pt-6">
          <ul className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-y-2 border-t border-white/10 min-[480px]:grid-cols-2 md:grid-cols-4">
            {projects.map((project, index) => (
              <li key={project.id}>
                <button
                  type="button"
                  data-project-index={index}
                  className="flex w-full flex-col items-start gap-1 py-4 pr-4 text-left"
                >
                  <span className="font-mono text-[0.68rem] tracking-[0.14em] text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base">{project.title}</span>
                  <span className="text-xs text-faint">{project.client}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
