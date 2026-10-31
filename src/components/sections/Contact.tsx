import { profile } from "@/data/profile";

const links = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "GitHub", value: "github.com/shoubhik18", href: profile.github },
  { label: "LinkedIn", value: "shoubhik-pan", href: profile.linkedin },
  { label: "Phone", value: profile.phone, href: profile.phoneHref },
];

export function Contact() {
  return (
    <section id="contact" className="relative pt-6 pb-8 sm:pt-8 sm:pb-10">
      <div className="mx-auto w-full max-w-6xl px-[clamp(20px,5vw,64px)]">
        <p className="font-mono text-[0.72rem] tracking-[0.2em] text-signal uppercase">Contact</p>
        <h2 className="mt-3 max-w-3xl text-[clamp(2.3rem,4.8vw,4rem)] leading-none font-medium tracking-[-0.035em]">
          Get in touch
        </h2>
        <p className="mt-4 max-w-md text-muted">
          Email, GitHub, LinkedIn, or phone. Same details as the resume.
        </p>
        <ul className="mt-8 max-w-xl border-t border-white/20">
          {links.map((link) => {
            const external = link.href.startsWith("http");
            return (
              <li key={link.label} className="border-b border-white/10">
                <a
                  href={link.href}
                  className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 py-4 transition hover:text-signal"
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  <span className="font-mono text-[0.68rem] tracking-[0.14em] text-faint uppercase">
                    {link.label}
                  </span>
                  <span className="break-all">{link.value}</span>
                  <span aria-hidden className="text-faint">
                    ↗
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-white/10 py-5 font-mono text-[0.68rem] tracking-[0.12em] text-faint uppercase">
          <span>{profile.name}</span>
          <span>2026</span>
        </footer>
      </div>
    </section>
  );
}
