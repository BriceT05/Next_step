"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOMAINS, domainTheme } from "@/app/data/domains";
import { getProjectsByDomain } from "@/app/data/projects";
import { NAV, SOCIALS } from "@/app/data/site";
import { DomainIcon, SocialIcon } from "./icons";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer les menus à chaque changement de page
  useEffect(() => {
    setMenuOpen(false);
    setOpenDesktop(null);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDesktop(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/"));

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 bg-ns text-white transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/20" : ""
      }`}
      onMouseLeave={() => setOpenDesktop(null)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${
            scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
          }`}
        >
          <Link href="/" className="flex items-center shrink-0" aria-label="Next Step.sn — Accueil">
            <Image
              src="/logo-nextstep.png"
              alt="Next Step.sn — Ose rêver"
              width={1268}
              height={351}
              priority
              className={`w-auto transition-[height] duration-300 ${scrolled ? "h-9 lg:h-10" : "h-10 lg:h-12"}`}
            />
          </Link>

          {/* Menu ordinateur */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Menu principal">
            {NAV.map((item) => {
              const hasPanel = Boolean(item.children || item.mega);
              const active = isActive(item.href);
              const cls = `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                active ? "text-gold" : "text-white/90 hover:text-gold"
              }`;
              if (!hasPanel) {
                return (
                  <Link key={item.label} href={item.href} className={cls} onMouseEnter={() => setOpenDesktop(null)}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.label} className={item.mega ? "" : "relative"} onMouseEnter={() => setOpenDesktop(item.label)}>
                  <Link
                    href={item.href}
                    className={`${cls} inline-flex items-center gap-1`}
                    aria-haspopup="true"
                    aria-expanded={openDesktop === item.label}
                    onFocus={() => setOpenDesktop(item.label)}
                  >
                    {item.label}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </Link>

                  {item.children && openDesktop === item.label && (
                    <div className="absolute left-0 top-full pt-2 w-60">
                      <ul className="bg-white text-ink rounded-2xl shadow-xl border border-pearl p-2">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-cream hover:text-ns">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Méga-menu : les cinq domaines dans leurs couleurs, avec leurs projets */}
                  {item.mega && openDesktop === item.label && (
                    <div className="absolute inset-x-0 top-full">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                        <div className="bg-white text-ink rounded-3xl shadow-2xl border border-pearl p-4 grid grid-cols-5 gap-3">
                          {DOMAINS.map((d) => (
                            <div key={d.slug} style={domainTheme(d)} className="rounded-2xl bg-dc-light overflow-hidden flex flex-col">
                              <Link href={`/domaines/${d.slug}`} className="block bg-dc text-white p-4 hover:bg-dc-deep transition-colors">
                                <DomainIcon name={d.icon} className="w-6 h-6 mb-2" />
                                <div className="font-display font-bold leading-tight">{d.name}</div>
                                <div className="text-xs text-white/90">{d.theme}</div>
                              </Link>
                              <ul className="p-3 space-y-1">
                                {getProjectsByDomain(d.slug).map((p) => (
                                  <li key={p.slug}>
                                    <Link
                                      href={`/projets/${p.slug}`}
                                      className="block text-[13px] leading-snug px-2 py-1.5 rounded-lg text-dc-deep font-medium hover:bg-white"
                                    >
                                      {p.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-1">
              {SOCIALS.slice(0, 4).map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-gold hover:bg-white/10 transition-colors"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
            <Link
              href="/nous-rejoindre"
              className="bg-gold text-ink px-5 py-2.5 rounded-full font-bold text-sm hover:brightness-110 transition"
            >
              Nous rejoindre
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="lg:hidden w-11 h-11 -mr-2 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="lg:hidden bg-ns-dark border-t border-white/10 max-h-[calc(100dvh-3.5rem)] overflow-y-auto" aria-label="Menu mobile">
          <ul className="px-4 py-4 space-y-1">
            {NAV.map((item) => {
              const hasPanel = Boolean(item.children || item.mega);
              if (!hasPanel) {
                return (
                  <li key={item.label}>
                    <Link href={item.href} className="block px-3 py-3 rounded-xl text-base font-medium hover:bg-white/10">
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const open = openMobile === item.label;
              return (
                <li key={item.label}>
                  <button
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium hover:bg-white/10"
                    onClick={() => setOpenMobile(open ? null : item.label)}
                    aria-expanded={open}
                  >
                    {item.label}
                    <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {open && item.children && (
                    <ul className="pl-3 pb-2 space-y-1">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block px-3 py-2.5 rounded-xl text-white/90 hover:bg-white/10">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  {open && item.mega && (
                    <ul className="pb-2 space-y-2">
                      <li>
                        <Link href="/domaines" className="block px-3 py-2.5 rounded-xl text-white/90 hover:bg-white/10">
                          Tous les domaines
                        </Link>
                      </li>
                      {DOMAINS.map((d) => (
                        <li key={d.slug} style={domainTheme(d)} className="rounded-2xl overflow-hidden bg-white/5">
                          <Link href={`/domaines/${d.slug}`} className="flex items-center gap-3 bg-dc px-3 py-3 font-display font-bold">
                            <DomainIcon name={d.icon} className="w-5 h-5" />
                            <span>
                              {d.name} <span className="font-sans font-normal text-white/90 text-sm">· {d.theme}</span>
                            </span>
                          </Link>
                          <ul className="px-2 py-1">
                            {getProjectsByDomain(d.slug).map((p) => (
                              <li key={p.slug}>
                                <Link href={`/projets/${p.slug}`} className="block px-3 py-2 text-sm text-white/90 hover:text-gold">
                                  {p.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="px-4 pb-6">
            <Link href="/nous-rejoindre" className="block bg-gold text-ink text-center px-5 py-3.5 rounded-full font-bold">
              Nous rejoindre
            </Link>
            <div className="flex justify-center gap-2 mt-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-white/10 text-white hover:text-gold"
                >
                  <SocialIcon name={s.name} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
