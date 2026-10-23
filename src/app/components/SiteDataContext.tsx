"use client";
import { createContext, useContext } from "react";
import { PROJECTS, type ProjectData } from "@/app/data/projects";
import { type ClientSettings, DEFAULT_SETTINGS, toClientSettings, whatsappHref } from "@/lib/settings";

/**
 * Données lues en base par le layout du site (projets et réglages généraux),
 * partagées avec les composants côté navigateur : menu, pied de page, formulaires…
 */
type SiteData = { projects: ProjectData[]; settings: ClientSettings };

const SiteDataContext = createContext<SiteData>({ projects: PROJECTS, settings: toClientSettings(DEFAULT_SETTINGS) });

export function SiteDataProvider({ projects, settings, children }: SiteData & { children: React.ReactNode }) {
  return <SiteDataContext.Provider value={{ projects, settings }}>{children}</SiteDataContext.Provider>;
}

export const useProjects = () => useContext(SiteDataContext).projects;
export const useSettings = () => useContext(SiteDataContext).settings;

/** Lien WhatsApp vers le numéro saisi dans l'admin (utilisable depuis un composant serveur). */
export function WhatsAppLink({
  text,
  className,
  children,
  ...rest
}: { text?: string; className?: string; children: React.ReactNode } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const settings = useSettings();
  return (
    <a href={whatsappHref(settings, text)} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
    </a>
  );
}
