import Link from 'next/link'

/**
 * Baccard Rooms brand mark, from sites/baccardrooms.html: TWO CARDS DEALT.
 * An oxblood card turned 10° behind an ivory one, both edged in brass, with a
 * spade printed on the face of the front card.
 *
 * It is the brand in one shape: a room where cards are dealt, and the second
 * card showing behind the first is the only way to say "more than one" without
 * a third object. The 10° turn is the mockup's own, and it is what stops the
 * pair reading as a single thick card.
 *
 * ── Two departures from the mockup's SVG, both for robustness ─────────────
 *
 * THE SPADE IS A PATH, not a `<text>` glyph. The mockup draws the pip and a
 * "9" with `<text font-family="Georgia,serif">`, which is fine in a page and
 * wrong in everything downstream: `public/icon.svg` is rasterised by the
 * browser with whatever font it happens to have (Georgia is not on Linux or
 * Android), `next/og` renders the share card through Satori, which needs a
 * font binary for any text it draws, and a favicon that loses its glyph is a
 * blank card. A path cannot go missing.
 *
 * THE "9" IS GONE. At the size this mark is actually used — 42px in the
 * header, 32px and 16px in a tab — an 11px numeral beside a 16px pip is two
 * marks competing inside 30 pixels, and the numeral is the one that turns to
 * mud first. The pip alone survives 16px.
 *
 * ── The mark does not invert ──────────────────────────────────────────────
 *
 * Unlike every sibling, there is no dark variant: the cards carry their own
 * fills, so the artwork is identical in the header, in the footer and on a
 * tab. Measured on the two grounds it sits on — ivory on the deep felt 12.33,
 * the brass edge on the page felt 5.38, the ink pip on the ivory 15.68 — so
 * one drawing is correct everywhere. `onDark` therefore only moves the focus
 * ring's offset colour and trims the size for the footer.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra
 * request and stays crisp at any size. The artwork is aria-hidden; the Link's
 * name is its visible text.
 */
export default function Logo({
  className = '',
  taglineClassName = '',
  onDark = false,
}: {
  className?: string
  taglineClassName?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-felt'
      } ${className}`.trim()}
    >
      <svg
        viewBox="0 0 46 52"
        className={onDark ? 'h-[40px] w-[35px] shrink-0' : 'h-[46px] w-[41px] shrink-0'}
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The card behind. Turned about its own centre so the corner that
            shows is the top-right one, which is the corner a dealt card
            shows. */}
        <rect
          x="9"
          y="3"
          width="30"
          height="42"
          rx="5"
          fill="#8e1b2b"
          stroke="#c9a45c"
          strokeWidth="1.5"
          transform="rotate(10 24 24)"
        />
        {/* The card in front — the ivory this whole site cuts its cards from. */}
        <rect
          x="5"
          y="6"
          width="30"
          height="42"
          rx="5"
          fill="#f6f0e1"
          stroke="#c9a45c"
          strokeWidth="1.5"
        />
        {/* The pip: a spade, drawn as an upward heart closed by a stem. Two
            subpaths in one `d` so it fills as a single shape. */}
        <path
          d="M20 17c0 0 8 6 8 10.5 0 3-2.2 5-4.6 5-1.6 0-2.8-.8-3.4-1.8-.6 1-1.8 1.8-3.4 1.8-2.4 0-4.6-2-4.6-5C12 23 20 17 20 17Z
             M17.4 37c1.4-1.5 2-3.1 2.2-5h.8c.2 1.9.8 3.5 2.2 5Z"
          fill="#1b1712"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display whitespace-nowrap text-[26px] ${
            onDark ? 'text-night-ink' : 'text-paper'
          }`}
        >
          Baccard
          {/* The tail in the display face's TRUE ITALIC, in brass — the
              mockup's `.logo-name i`. `font-display-it` rather than an
              `italic` utility, which would lose to the unlayered
              `.font-display` rule. */}
          <i className="font-display-it text-accent">Rooms</i>
        </span>
        {/* The strapline. `aria-hidden`: it is a second, shorter name for the
            same link, and a screen reader announcing both would read the
            brand twice over. */}
        <span
          aria-hidden
          className={`lbl mt-1.5 block text-[10.5px] tracking-[0.3em] ${
            onDark ? 'text-night-accent' : 'text-accent'
          } ${taglineClassName}`.trim()}
        >
          Private casino salon
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
