import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * Roman numerals, for the room numbers.
 *
 * A table rather than arithmetic: this list is the bonus types on one site, so
 * it will not pass a dozen, and a table makes the exact glyphs visible in the
 * source. `String(n)` past the end is the fallback that keeps a twentieth room
 * numbered rather than blank.
 */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const

/**
 * THE ROOMS — `.rooms` / `.room` in sites/baccardrooms.html, and the single
 * most important block on this site.
 *
 * Each bonus type is a numbered ROOM off the salon's corridor: "Room I" in the
 * italic Didone, a brass line drawing of what is inside, the type's name, and
 * how many offers are open in it. The doors are a `auto-fit` grid of brass-
 * edged panels with a faint gradient lifting them off the felt.
 *
 * ── Why this block comes first on the home page ───────────────────────────
 *
 * Every other site in this network renders its bonus types BELOW the casino
 * list, and the page for this one puts them directly under the hero. That is
 * not a layout preference; it is the site's argument. The brand is named after
 * these rooms, and the claim is that the KIND OF CONTRACT decides more than
 * the brand does — a welcome package, a cashback and a reload at the same
 * operator are three different things. A page making that claim cannot open
 * with a league table of operators.
 *
 * ── Three details that are deliberate ─────────────────────────────────────
 *
 * THE NUMBER IS NOT A RANKING. "Room I" is a door number: the rooms arrive in
 * the admin's own priority order, which is an editorial sort of the types and
 * not a judgement of them. The italic Didone is doing work here — a number in
 * a plain sans beside a name reads as a position in a table, and the same
 * number in a cursive serif reads as the brass plate on a door.
 *
 * THE EDGE IS SOLID BRASS, not the mockup's `rgba(201,164,92,.5)`. A door is a
 * link and its edge is what says where it starts; the mockup's alpha measures
 * 2.40:1 on the felt against solid brass's 5.38.
 *
 * THE COUNT IS VISIBLE TEXT, not a screen-reader aside. On the sibling sites
 * it is a chip the eye can skip; here it is the one piece of information that
 * tells a reader which door is worth opening, so it is set as words — "4
 * offers" — under the name.
 *
 * TWO COLUMNS ON A PHONE, which is the one place this block departs from the
 * network's own rule for it. Everywhere else the bonus-type chips go behind a
 * `MobileCollapse` Hide / Show bar below `sm`; that cannot happen here,
 * because on this site the rooms are the page's primary navigation and the
 * first thing under the hero — folding away the one block the whole argument
 * rests on would be the wrong trade. Full-width doors made it eight screens
 * of corridor before the first table, so the grid halves instead, and the
 * numeral, the icon and the name each step down one size with it.
 *
 * This component renders NO HEADING. The section's head — its title and
 * kicker — is drawn by the page's own `SectionHead`, and a second <h2>
 * carrying the same id as that one is a duplicate id, not a heading.
 *
 * Each door opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  return (
    <ul
      className="btypes grid-cols-2 gap-3 min-[30rem]:grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] min-[30rem]:gap-[18px]"
      role="list"
    >
      {types.map((section, i) => (
        <li key={section.id} className="flex min-w-0">
          <Link
            href={`/bonuses/${section.slug}`}
            className="btype flex w-full flex-col items-center gap-2.5 px-3 py-5 text-center min-[30rem]:gap-3 min-[30rem]:px-4 min-[30rem]:pb-[22px] min-[30rem]:pt-[26px]"
          >
            <span aria-hidden className="btype-no text-[16px] leading-none min-[30rem]:text-[17px]">
              {COPY.bonusCategory.roomLabel} {ROMAN[i] ?? String(i + 1)}
            </span>

            {/* What is in the room — the mockup's `.room svg`: a 34px brass
                line drawing. A plain <img> for an uploaded mark: next/image
                refuses SVG. alt="" because the name below it says the type.

                NO PLATE BEHIND AN UPLOADED MARK. The admin's own type icons
                already arrive as coloured rounded squares, and a ground
                behind one renders as two nested shapes in two colours — a
                plate inside a plate. The fallback drawing has no ground
                either: on this site the icon is a line, not a tile. */}
            <span aria-hidden className="btype-ic h-7 w-7 shrink-0 min-[30rem]:h-[34px] min-[30rem]:w-[34px]">
              {section.icon_path ? (
                <img src={resolveImageUrl(section.icon_path)!} alt="" width={34} height={34} className="h-full w-full object-contain" />
              ) : (
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-full w-full">
                  <rect x="3" y="8" width="14" height="9" />
                  <path d="M2 5h16v3H2zM10 5v12M10 5c-2-3-5-2-4 0M10 5c2-3 5-2 4 0" />
                </svg>
              )}
            </span>

            <b className="font-display text-[18px] leading-[1.15] text-paper [overflow-wrap:anywhere] min-[30rem]:text-[21px]">
              {section.name}
            </b>

            <span className="btype-ct text-[13.5px] tabular-nums">
              {section.offers_count}{' '}
              {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
