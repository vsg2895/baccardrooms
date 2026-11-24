import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many regions a card names before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

/**
 * The four suits, and the stable choice of one.
 *
 * THE SUIT IS DECORATION AND CARRIES NO MEANING — but it is derived from the
 * casino's own SLUG rather than from its position in the list, which matters:
 * with a positional suit an operator wears ♠ on the home page, ♥ on page 2 of
 * /casinos and ♣ inside a category, and a mark that changes when the ordering
 * changes reads as a property of the operator that keeps moving. From the slug
 * it is the same suit everywhere, for as long as the slug lives — and the slug
 * never changes, because it is in the public API path.
 *
 * `red` is what prints the index in oxblood instead of ink, which is what a
 * deck does: hearts and diamonds are red, spades and clubs are black.
 *
 * The hash is a plain polynomial over the characters. It needs to be stable
 * and evenly spread, not unguessable — `% 4096` keeps it inside a safe
 * integer for any slug length.
 */
const SUITS = ['♠', '♥', '♣', '♦'] as const

function suitFor(slug: string): { glyph: string; red: boolean } {
  let h = 0
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) % 4096
  const i = h % 4
  return { glyph: SUITS[i], red: i === 1 || i === 3 }
}

/**
 * Exported so an offer card shows the same stars a casino card does.
 *
 * `--color-gold` is #7A5A14, A DEEP AGED BRASS, not the mockup's #B08A3E. That
 * value is 2.82:1 on the ivory — under the 3:1 a graphic needs — and the
 * mockup's own default `--brass` #C9A45C is far worse at 2.06. At those ratios
 * a filled star and an empty one are the same pale smudge on cream, which is
 * the one thing a star row has to do. The bronze measures 5.60 on the ivory
 * and 6.36 on white.
 *
 * THE EMPTY STAR IS `line-strong`, NOT `line`. An unfilled star still has to
 * be a visible shape or the row reads as three stars rather than three out of
 * five; the card hairline is 1.39:1 and could not be seen at all, where
 * #92805B is 3.38. On the felt the pair is brass (5.38) over #6E8A7A (3.36).
 *
 * The exact figure is printed beside the stars everywhere they appear, so the
 * colour is never the only carrier.
 */
export function Stars({ rating, onDark = false }: { rating: number; onDark?: boolean }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 18px reads as a rendering fault.
  const filled = Math.round(rating)
  const on = onDark ? 'text-accent' : 'text-gold'
  const off = onDark ? 'text-[#6e8a7a]' : 'text-line-strong'

  return (
    <span
      className="inline-flex items-center tracking-[2px] text-[17px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? on : off} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The grid the cards sit in — the mockup's `.list`: three across, two at
 * 1100px, one at 640px, with a 28px gap. Callers render
 * `<ol className={CASINO_LIST}>`; the order of the list is the ranking.
 *
 * A GAP THIS LARGE IS STRUCTURAL, not spacing. These are cards dealt onto a
 * felt, and a card has air round it — at the 14px gap its sibling sites use,
 * three of them read as one panel divided twice, which is the one thing a
 * hand of cards is not.
 */
export const CASINO_LIST = 'grid grid-cols-1 gap-7 min-[40rem]:grid-cols-2 min-[69rem]:grid-cols-3'

/**
 * A casino as A PLAYING CARD — `.cc` in sites/baccardrooms.html.
 *
 * Ivory stock on the 22px corner, everything on it CENTRED, and its rating
 * printed as a CORNER INDEX: the figure over its suit, top-left and again
 * bottom-right rotated 180°, exactly as a real card prints its rank so it
 * reads from either end of the table. A hairline frame sits 10px inside the
 * edge, and the whole thing lifts and tilts -0.4° on hover — a card picked up
 * off the felt. See `.ccard` and `.cc-idx` in globals.css.
 *
 * Centred, which is the opposite of every ranking site including most of this
 * network, and it is the right call for this one: a left-aligned row is a
 * table of operators being compared on their attributes, and this site's
 * argument is that the operator is the SECOND question. A card is an object
 * you pick up, not a line in a table.
 *
 * TOP TO BOTTOM: the leader's flag over the top edge, the logo well, the
 * name, the rating, the current bonus between two rules, the regions, and the
 * two links pinned to the bottom by `mt-auto` so every card in a row ends at
 * the same line however long its name is.
 *
 * THE PLATE IS A FIXED SHAPE, never `auto`. Operator artwork runs from square
 * to wide banner, and a well that sized itself to each file would make one
 * card 84px tall and the next 173px in the same row. It is `aspect-[2/1]` up
 * to 240px wide and the artwork is letterboxed inside it with
 * `object-contain`.
 *
 * ── Three things the mockup draws that are not shipped ────────────────────
 *
 * ITS `.facts` ROW — "Min. deposit" and "Payout" under every card. No column
 * in this project holds either, so both would be invented per casino. The slot
 * carries the REGIONS instead, which are real and which are the single most
 * consequential fact on the card: an account opened from a country the terms
 * exclude can be closed at withdrawal with the balance forfeited.
 *
 * ITS RANK NUMERAL — there is none to drop here, because the mockup prints the
 * RATING in the corner index rather than a rank, which is the better idea and
 * is why this card keeps it. The `<ol>` order is the ranking on every site in
 * this network.
 *
 * `rank` still drives the flag, and it is `rank === 1` rather than
 * `:first-child`, so page 2 of /casinos does not crown its own first row.
 */
export default function CasinoCard({
  casino,
  rank,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length
  const isLeader = rank === 1
  const suit = suitFor(casino.slug)

  /* The corner index, rendered twice from one definition so the two can never
     disagree. `aria-hidden`: the rating is already announced by the stars and
     printed as a figure beside them, and a screen reader meeting it a third
     and fourth time learns nothing. */
  const index = (
    <>
      {casino.rating.toFixed(1)}
      <span className="suit mt-[3px] block text-[20px] leading-none">{suit.glyph}</span>
    </>
  )

  return (
    <li className="flex">
      <article
        className={`ccard flex w-full flex-col items-center gap-3.5 px-6 pb-[72px] pt-[58px] text-center sm:px-[30px] ${
          suit.red ? 'cc-red' : ''
        }`}
      >
        <span aria-hidden className="cc-idx absolute left-[22px] top-5 z-[1] text-[22px]">
          {index}
        </span>
        <span aria-hidden className="cc-idx absolute bottom-5 right-[22px] z-[1] rotate-180 text-[22px]">
          {index}
        </span>

        {/* The leader's flag, pinned over the card's top edge so it crosses
            onto the felt — the mockup's `.badge`. See `.flag` in globals.css
            for the brass ring that makes the pill's shape read on both of the
            grounds it crosses. */}
        {isLeader && (
          <span className="flag lbl absolute -top-3.5 left-1/2 z-[2] -translate-x-1/2 whitespace-nowrap px-4 py-[7px] text-[12px] tracking-[0.2em]">
            {COPY.casinos.topPick}
          </span>
        )}

        {/* THE WELL — a brass-beaded window on the card's face, with a dashed
            brass line inside it. See `.clogo` in globals.css: the mockup cuts
            this window down to the FELT, and that is the one part of its
            drawing this site cannot follow, because half the operator artwork
            in the catalogue carries its own white ground baked in. */}
        <div className="clogo relative z-[1] grid aspect-[2/1] w-full max-w-[240px] place-items-center p-3">
          {image ? (
            <Image
              src={image}
              alt={`${casino.name} logo`}
              width={340}
              height={200}
              sizes="(min-width: 69rem) 240px, (min-width: 40rem) 40vw, 80vw"
              className="relative max-h-[64px] w-full object-contain"
            />
          ) : (
            /* No artwork: the operator's name set in the display face in the
               well, which is what a card with only a word on it looks like.
               15.76:1 on the white. */
            <span className="font-display relative px-1 text-[clamp(20px,2.2vw,28px)] leading-[1.05] text-ink [overflow-wrap:break-word]">
              {casino.name}
            </span>
          )}
        </div>

        <h3 className="cc-name font-display relative z-[1] text-[26px] text-ink [overflow-wrap:anywhere] sm:text-[30px]">
          {/* `inline-flex min-h-11`: the name IS a way into the review, and at
              30px its link box was 30px tall — well under the 44px tap
              target. A floor, not a fixed height, so a two-line operator name
              still grows the box instead of clipping it. */}
          <Link href={`/casinos/${casino.slug}`} className="inline-flex min-h-11 items-center justify-center">
            {casino.name}
          </Link>
        </h3>

        <p className="relative z-[1] flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
          <Stars rating={casino.rating} />
          {/* The figure, always. The bronze clears 4.5:1 on the ivory, but a
              rating is the one place this design asks a colour to carry a
              VALUE, and a number beside it means the colour never has to. */}
          <span aria-hidden className="text-[14px] font-bold text-muted tabular-nums">
            {casino.rating.toFixed(1)} / 5
          </span>
        </p>

        {/* THE CURRENT BONUS, between two hairlines — the mockup's `.cbonus`.
            Dividers rather than control edges, so the 1.39:1 hairline is the
            right weight here and nowhere a thumb presses. */}
        {casino.bonuses && (
          <p className="cbonus relative z-[1] w-full px-3 py-3.5">
            <span className="lbl block text-[11.5px] text-brand">{COPY.casinos.bonusLabel}</span>
            <b className="font-display mt-1.5 block text-[22px] leading-[1.2] text-ink [overflow-wrap:anywhere]">
              {casino.bonuses}
            </b>
          </p>
        )}

        {/* THE REGIONS, in the slot the mockup gives its two invented facts.
            Pills on the pale green tint — the table green a chip is moulded
            in, 6.54:1 on its own tint — which says this is a fact in the
            reader's favour: the list of places the operator itself says it
            admits. */}
        {shownRegions.length > 0 && (
          <p className="relative z-[1] flex flex-wrap items-center justify-center gap-2">
            <span className="sr-only">Accepted countries: </span>
            {shownRegions.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center rounded-full bg-win-bg px-[11px] py-1 text-[13px] font-semibold text-win"
              >
                {c.name}
              </span>
            ))}
            {extraRegions > 0 && (
              <span className="inline-flex items-center rounded-full bg-surface px-[11px] py-1 text-[13px] font-semibold text-ink-soft">
                +{extraRegions} more
              </span>
            )}
          </p>
        )}

        {/* THE ACTIONS — the mockup's `.cc-act`: both links full width, one
            over the other, pinned to the bottom of the card by `mt-auto` so
            every card in a row ends on the same line.

            `z-[1]`, which is the mockup's own and is load-bearing: the card's
            printed frame is a pseudo-element over the content, and without
            this the bottom button sits under it. `btn-flat` on both: the card
            is already lifting and tilting on hover, and a button lifting
            inside it as well makes the card look loose. */}
        <div className="relative z-[1] mt-auto flex w-full flex-col gap-2.5 pt-1.5">
          <a
            href={casino.attachment.affiliate_url}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="btn-or btn-sm btn-flat"
          >
            {COPY.casinos.visitCasino}
            <span className="sr-only"> — {casino.name}</span>
          </a>
          <Link href={`/casinos/${casino.slug}`} className="btn-ln btn-sm btn-flat">
            {COPY.casinos.readReview}
            <span className="sr-only"> of {casino.name}</span>
          </Link>
        </div>
      </article>
    </li>
  )
}
