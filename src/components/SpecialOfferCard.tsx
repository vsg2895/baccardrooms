import Link from 'next/link'
import Image from 'next/image'
import { resolveImageUrl } from '@/lib/images'
import { Stars } from '@/components/CasinoCard'
import { COPY } from '@/constants/copy'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * The grid the offer cards sit in — the mockup's `.offers`:
 * `minmax(min(100%,340px),1fr)` with a 22px gutter.
 *
 * 340px rather than the clone's 280, because the card is a horizontal pair —
 * a 92px chip beside a column of type — and at 280 the type column is 166px
 * wide, which is not a column, it is a gutter.
 *
 * `auto-fit` rather than `auto-fill`, so a row holding one card does not park
 * it beside two empty tracks.
 *
 * THE CARD IS CAPPED AT 520px, and the cap is on the CARD rather than on the
 * track. A bonus type holding a single offer was being given the whole 1192px
 * row — a 92px chip and two short lines stranded in a card five times wider
 * than anything in it — and the obvious fix, a definite max on the track,
 * made it worse in the other direction: `auto-fit` counts its repetitions
 * from a definite max, so `minmax(340px, 480px)` pinned every grid on the
 * site to two columns. With `1fr` the count still comes from the 340px
 * minimum, three cards share a wide row as they should, and a lone card
 * simply stops at 520.
 *
 * `offer-grid` stays in the class list: it is the hook the `:nth-child` cycles
 * in globals.css hang off on the sibling sites, and keeping the name means a
 * caller can be moved between sites unchanged.
 */
export const OFFER_GRID = 'offer-grid grid grid-cols-1 gap-[22px] sm:grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))]'

/**
 * THE CHIP'S THREE COLOURS, and the stable choice of one — the mockup's
 * `CHIP = ['#8E1B2B','#1B1712','#0E6B52']`: the oxblood, the ink and the
 * table green, which is as close to a real rack of chips as three colours
 * get. White on all three (8.97, 17.83, 7.75) carries the glyph in the core.
 *
 * THE COLOUR IS RHYTHM AND CARRIES NO MEANING, and it is chosen from the
 * offer's own SLUG rather than from `:nth-child`, which is what the mockup
 * does and what two sibling sites do for the same kind of ornament. The
 * reason is the same one that fixes the suit on a casino card: these grids are
 * `auto-fit`, the API's ordering changes whenever an offer is hidden, and a
 * chip that changes colour between the home page and /special-offers reads as
 * a property of the offer that keeps moving. From the slug it is the same chip
 * everywhere.
 */
const CHIP_TONES = ['#8e1b2b', '#1b1712', '#0c5e48'] as const
const SUITS = ['♠', '♥', '♣', '♦'] as const

function chipFor(slug: string): { tone: string; suit: string } {
  let h = 0
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) % 4096
  return { tone: CHIP_TONES[h % 3], suit: SUITS[h % 4] }
}

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids — `.offer` in sites/baccardrooms.html.
 *
 * AN IVORY CARD LED BY A CASINO CHIP: a 92px disc whose edge spots are a
 * `repeating-conic-gradient` — the tone for 15°, white for 15°, all the way
 * round — with a solid core inside it and the moulded white bead every chip
 * has. See `.chip` in globals.css.
 *
 * 20px rather than the playing card's 22px, and no corner index, no suit in
 * the corner and no printed frame: an offer is not a card in the deck and
 * should not pretend to be one. It is the chip you would put on one.
 *
 * ── The chip's core carries a SUIT, not the kind of bonus ─────────────────
 *
 * The mockup prints the bonus type inside the core — "Welcome", "Cashback" —
 * at 11px in tracked capitals inside a 66px circle. That cannot ship here,
 * and the reason is the readability floor in globals.css: every size under
 * 14px is raised to 14px below 1024px, so on every phone and tablet that
 * label becomes 14px type in a 58px box. "CASHBACK" at 14px with 0.12em
 * tracking is about 83px wide; it would break out of the chip on the exact
 * devices most people hold.
 *
 * Growing the chip does not fix it either — the bonus types in this catalogue
 * run to "No Deposit Offers" — and shrinking the type back is choosing an
 * ornament over a legibility rule the whole network keeps.
 *
 * So the core carries one of the four suits, which is this site's own
 * ornament, scales with the disc and cannot overflow; and the KIND is printed
 * where it can be read, in the kicker beside the casino's name. The chip is
 * then what a chip is: a colour and a shape, carrying no information, which
 * is exactly what it carries on a real table.
 *
 * THE ORDER INSIDE THE CARD IS THE SITE'S ORDER: whose offer it is and which
 * room it belongs to, what it is called, the figure it leads with, how it
 * places, and only then the way in. The button is last because the decision
 * is made above it.
 *
 * `logo` IS STILL ACCEPTED and deliberately NOT USED. A casino page passes
 * its own logo down because the offers it lists arrive without their casino
 * attached, and every sibling's card has a picture well to put it in. This
 * card has a chip where that well would be, so there is nowhere for it to go
 * — and dropping the prop from the signature would break three call sites
 * for nothing. It stays in the type and out of the layout.
 */
export default function SpecialOfferCard({ offer }: { offer: SpecialOffer; logo?: string | null }) {
  const casinoName = offer.casino?.name ?? ''
  const kind = offer.bonus_category_name ?? 'Bonus'
  const chip = chipFor(offer.slug)
  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    <article className="offer relative grid max-w-[520px] grid-cols-1 items-center gap-5 p-[22px] min-[26rem]:grid-cols-[92px_minmax(0,1fr)] sm:px-6">
      {/* THE CHIP. `--c` is set inline because it is per-offer data, not a
          theme value — see chipFor above. `aria-hidden`: a chip is a colour
          and a shape and says nothing the words beside it do not. */}
      <span
        aria-hidden
        className="chip h-[92px] w-[92px] flex-none"
        style={{ ['--c' as string]: chip.tone }}
      >
        <i className="h-[66px] w-[66px]">
          <span className="suit text-[28px] leading-none">{chip.suit}</span>
        </i>
      </span>

      <div className="flex min-w-0 flex-col gap-1.5">
        {/* Whose offer it is, and WHICH ROOM — the mockup's `.by`, which names
            the casino alone. The room is added because it is this site's unit
            and because the chip beside it no longer carries it. */}
        <p className="lbl min-w-0 text-[12.5px] text-muted [overflow-wrap:anywhere]">
          {casinoName ? `${casinoName} · ${kind}` : kind}
        </p>

        <h3 className="font-display text-[25px] leading-[1.12] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </h3>

        {offer.bonuses && (
          <p className="text-[16px] font-bold text-brand [overflow-wrap:anywhere]">{offer.bonuses}</p>
        )}

        {/* THE RATING, only when there IS one. An offer whose rating has
            never been set comes back as 0, and five empty stars beside a
            "0.0 / 5" does not read as "unrated" — it reads as rated zero,
            which is a worse claim than saying nothing. The mockup prints five
            filled stars on every offer regardless; this prints the figure the
            record actually holds, or nothing. */}
        {offer.rating > 0 && (
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <Stars rating={offer.rating} />
            <span aria-hidden className="text-[14px] font-semibold text-muted tabular-nums">
              {offer.rating.toFixed(1)} / 5
            </span>
          </p>
        )}

        {/* THE FOOT — the mockup's `.o-foot`: the T&Cs line at the left and
            the way in at the right, wrapping to two rows when the card is
            narrow.

            `relative z-10` lifts the control over the heading's stretched
            link, or the card-wide hit area would swallow it. */}
        <div className="relative z-10 mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="text-[12.5px] text-muted">T&amp;Cs apply · 18+</p>
          {claimable ? (
            offer.affiliate_url ? (
              <a
                href={offer.affiliate_url}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="btn-or btn-sm btn-flat"
              >
                {COPY.specialOffers.claim}
                <span className="sr-only"> — {offer.title}</span>
              </a>
            ) : (
              // No affiliate URL of its own: the offer's page is the only place
              // that can lead to the operator. An internal link, so no sponsored rel.
              <Link href={`/special-offers/${offer.slug}`} className="btn-or btn-sm btn-flat">
                {COPY.specialOffers.claim}
                <span className="sr-only"> — {offer.title}</span>
              </Link>
            )
          ) : (
            <Link
              href={`/special-offers/${offer.slug}`}
              className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-bold text-brand transition-colors hover:text-ink"
            >
              Details
              <span className="sr-only"> — {offer.title}</span>
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group: the logo, whose offer it is, its name and
 * amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and takes the page ground on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-4 gap-y-2.5 border-b border-line px-4 py-4 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      {/* The plate is a small `.clogo` — white inside a brass-toned bead, for
          the reason given on that class: half the operator artwork carries its
          own white ground baked in. */}
      <span aria-hidden className="clogo flex h-[52px] w-[52px] items-center justify-center p-1.5 text-xs font-bold text-ink">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="lbl text-[12px] text-muted">{kicker}</p>}
        <Heading className="font-display mt-0.5 text-[19px] leading-[1.2] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="text-[15px] font-bold text-brand [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or btn-sm btn-flat">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or btn-sm btn-flat">Claim</Link>
          )
        ) : (
          <span aria-hidden className="inline-flex items-center text-[14px] font-bold text-brand">Details →</span>
        )}
      </div>
    </li>
  )
}
