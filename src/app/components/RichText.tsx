/**
 * Texte saisi dans l'admin, avec une mise en forme volontairement simple :
 * - une ligne vide sépare deux paragraphes ;
 * - une ligne qui commence par « ## » est un intertitre ;
 * - des lignes qui commencent par « - » forment une liste à puces.
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
                  <span>{l.slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{lines.join(" ")}</p>;
      })}
    </div>
  );
}
