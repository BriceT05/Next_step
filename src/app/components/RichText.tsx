import Link from "next/link";

const linkCls = "font-semibold text-ns underline underline-offset-4 hover:text-gold-ink";

/** Liens « [texte](adresse) » et adresses e-mail rendues cliquables. */
function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|([\w.+-]+@[\w-]+\.[\w.-]+\w)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, href, email] = m;
    if (email) {
      out.push(<a key={m.index} href={`mailto:${email}`} className={linkCls}>{email}</a>);
    } else if (href.startsWith("/")) {
      out.push(<Link key={m.index} href={href} className={linkCls}>{label}</Link>);
    } else if (/^(https?:|mailto:|tel:)/.test(href)) {
      out.push(<a key={m.index} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>{label}</a>);
    } else {
      out.push(label); // adresse non reconnue : on garde le texte seul
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Texte saisi dans l'admin, avec une mise en forme volontairement simple :
 * - une ligne vide sépare deux paragraphes ;
 * - une ligne qui commence par « ## » est un intertitre ;
 * - des lignes qui commencent par « - » forment une liste à puces ;
 * - [texte](adresse) fait un lien ; les adresses e-mail deviennent cliquables.
 */
export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-5 ${className}`}>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="font-display font-bold text-2xl text-ns pt-3">
              {block.slice(3).trim()}
            </h2>
          );
        }
        const lines = block.split("\n").map((l) => l.trim());
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {lines.map((l, k) => (
                <li key={k} className="flex gap-3">
                  <span className="mt-2.5 w-2 h-2 shrink-0 rounded-full bg-gold" aria-hidden />
                  <span>{inline(l.slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(lines.join(" "))}</p>;
      })}
    </div>
  );
}
