/**
 * Hover "roll": the label slides up letter by letter and an identical copy
 * rolls in from below. Pure CSS (see .roll in globals.css); the parent link or
 * button needs the `roll-trigger` class. Gated to fine pointers.
 */
export function RollText({ text, className }: { text: string; className?: string }) {
  const chars = Array.from(text);
  const row = (
    <>
      {chars.map((char, index) => (
        <span key={index} className="roll-char" style={{ ["--i" as string]: index }}>
          {char}
        </span>
      ))}
    </>
  );
  return (
    <span className={`roll ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      <span className="roll-row" aria-hidden="true">
        {row}
      </span>
      <span className="roll-row" aria-hidden="true">
        {row}
      </span>
    </span>
  );
}
