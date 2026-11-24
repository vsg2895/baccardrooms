import Link from 'next/link'
import { COPY } from '@/constants/copy'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's "Chips On The Table": one SUBHEAD per room over a grid of
 * that room's offer cards — the mockup's `.subh` + `.offers`.
 *
 * THE SUBHEAD IS A RULED LABEL, not a card's head band. It is 13px of Figtree
 * at 800 on 0.22em in brass, with a hairline running from the end of the words
 * to the right margin and the "see more" link at the end of that line. The
 * mockup draws the rule with `.subh::after{flex:1;height:1px}`; it is a real
 * flex child here, which is the same thing and can carry a `bg-*` token.
 *
 * No card around a group, which is where this differs from most of the
 * network — the siblings wrap each type in a card with a coloured head band.
 * It cannot work here: a group is a row of ivory cards sitting on a felt, and
 * a container round them would be a tray, which puts a second surface between
 * the table and the cards. The rule IS the container: it draws the line the
 * cards are dealt under.
 *
 * The room's name is set in TRACKED CAPITALS rather than the display face,
 * which is the mockup's own and is the right way round: the section above this
 * one already sets every room's name in the Didone at 21px on its door, and
 * repeating that treatment here would make the two blocks look like the same
 * block twice. A label says "this run of cards belongs to that door".
 *
 * The count is resolved server-side over the unlimited set, so it is the
 * number of offers of this kind on the whole site rather than the number of
 * cards under it. It is `sr-only` here: the door in the section above prints
 * it as words, and a figure beside a label that is itself beside a rule is
 * three objects on one line.
 *
 * Every room's offers are in the server HTML, and each group keeps the
 * `#bonus-<slug>` anchor the room doors land on.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  return (
    <div className="flex flex-col gap-14">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-28"
        >
          <div className="mb-[18px] flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <h3
              id={`bonus-${section.slug}-heading`}
              className="lbl min-w-0 text-[13px] text-accent [overflow-wrap:anywhere]"
            >
              {section.name}
              <span className="sr-only">
                {' '}— {section.offers_count}{' '}
                {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
              </span>
            </h3>
            {/* The rule, from the end of the words to the link. `aria-hidden`
                by being an empty span with no text, and `min-w-6` so it never
                collapses to nothing on a narrow row. */}
            <span aria-hidden className="h-px min-w-6 flex-1 bg-accent/30" />
            <Link
              href={`/bonuses/${section.slug}`}
              className="inline-flex min-h-11 flex-none items-center text-[15px] font-bold text-accent-light transition-colors hover:text-paper"
            >
              {COPY.home.seeMore}
              <span className="sr-only"> {section.name}</span>{' '}
              <span aria-hidden className="ml-1.5">→</span>
            </Link>
          </div>
          {section.description && (
            <p className="mb-6 max-w-[640px] text-[15.5px] text-cream-muted">{section.description}</p>
          )}
          <div className={OFFER_GRID}>
            {section.offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
