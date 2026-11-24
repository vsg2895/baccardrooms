type Item = { readonly question: string; readonly answer: string }

/**
 * Roman numerals for the house rules — the mockup's `.fq .q`, which numbers
 * its five questions I to V in the italic Didone. A table rather than
 * arithmetic: this list is seven questions long and a table makes the exact
 * glyphs visible in the source.
 */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const

/**
 * THE HOUSE RULES — `.faq` / `.fq` in sites/baccardrooms.html.
 *
 * ONE IVORY SHEET carrying every question, parted by the same hairline a card
 * uses between its own rows, each question numbered in Roman in the italic
 * Didone and opened by a `+` that rotates 45° into an × and fills with the
 * oxblood.
 *
 * One sheet, and NOT a card per question, which is what the sibling this site
 * was cloned from does and what most of the network does. The reason is what
 * the thing IS: a private salon has its house rules printed on one card on the
 * wall, and seven separate boxes would be seven notices. It is also the
 * clearest argument this design makes about its own material — the rules are
 * one object, so they are one piece of ivory.
 *
 * It sits inside the page's `WRAP_NARROW` (820px), because an answer here runs
 * to five or six lines and a 17px paragraph across the full 1240px measure
 * would be about 150 characters a line.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only the `+` shows.
 *
 * The first one is open, so the sheet is never a list of closed rows with
 * nothing to read on it.
 *
 * The numeral is `aria-hidden`: it is a position on a printed card, and a
 * screen reader announcing "Roman numeral four" before every question is
 * reading the furniture.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="faq-sheet px-5 py-1 sm:px-[34px]">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="fq group">
          {/* The mockup's three-column summary: the numeral, the question, and
              the mark at the right margin. The numeral column collapses below
              `sm` from 44px to 30px, which is its own `@media(max-width:640px)`
              — at phone width 44px of numeral is 12% of the row. */}
          <summary className="grid cursor-pointer list-none grid-cols-[30px_minmax(0,1fr)_34px] items-center gap-3 py-6 [&::-webkit-details-marker]:hidden sm:grid-cols-[44px_minmax(0,1fr)_34px]">
            <span aria-hidden className="fq-q text-[22px] leading-none">
              {ROMAN[i] ?? String(i + 1)}.
            </span>
            <h3 className="fq-head font-display text-[19px] leading-[1.2] text-ink [overflow-wrap:anywhere] sm:text-[23px]">
              {item.question}
            </h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span aria-hidden className="pm h-[34px] w-[34px] justify-self-end text-[20px] leading-none">
              +
            </span>
          </summary>
          {/* Indented to the question's own left edge, not the numeral's —
              the mockup's `padding: 0 46px 24px 56px`, which is what makes the
              answer read as hanging off its question rather than as a second
              paragraph starting at the margin. */}
          <p className="fq-answer pb-[22px] pl-[42px] text-[16px] leading-[1.7] text-ink-soft sm:pb-6 sm:pl-14 sm:pr-[46px] sm:text-[17px]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
