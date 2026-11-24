import { Fragment, type ElementType, type ReactNode } from "react";

/**
 * Server-rendered split text. Every visual piece sits inside an overflow mask
 * so GSAP can slide it up from below; the readable text is exposed once to
 * assistive tech and the split copy is aria-hidden. Without JavaScript the
 * text is simply visible.
 */

type SplitCharsProps = {
  text: string;
  as?: ElementType;
  className?: string;
  charClassName?: string;
  /** Extra attributes for the outer element, e.g. data hooks. */
  id?: string;
};

export function SplitChars({ text, as: Tag = "span", className, charClassName, id }: SplitCharsProps) {
  const words = text.split(" ");
  let charIndex = 0;
  return (
    <Tag className={className} id={id}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="inline-block whitespace-nowrap" data-word>
              {Array.from(word).map((char) => {
                const index = charIndex++;
                return (
                  <span key={index} className="mask">
                    <span className={`mask-inner ${charClassName ?? ""}`} data-char style={{ ["--i" as string]: index }}>
                      {char}
                    </span>
                  </span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

type SplitLinesProps = {
  lines: ReactNode[];
  /** Plain-text version of the lines for screen readers. */
  label: string;
  as?: ElementType;
  className?: string;
  lineClassName?: string;
};

export function SplitLines({ lines, label, as: Tag = "span", className, lineClassName }: SplitLinesProps) {
  return (
    <Tag className={className}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="block">
        {lines.map((line, index) => (
          <span key={index} className="mask mask-line">
            <span className={`mask-inner ${lineClassName ?? ""}`} data-line>
              {line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
