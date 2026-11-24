import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * Baccard Rooms category tabs, from sites/baccardrooms.html (`.tabs` /
 * `.tab`): pills inside ONE TRACK — a 999px rail of the deepest felt with a
 * brass edge — and the current one filled IVORY with ink on it.
 *
 * The ivory fill is the point. It is the colour a card is cut from, so the tab
 * that is on is made of the same material as the cards it is filtering, and
 * the pair reads as one object rather than as a control and a list. At 15.68:1
 * it is also the strongest pair on the site, which is right for the one
 * control that changes what is below it. Its count flips to the oxblood with
 * white on it (8.97:1) — the only place oxblood is a fill outside a leader's
 * flag.
 *
 * THEY SCROLL SIDEWAYS INSIDE THE TRACK, which is the mockup's own
 * (`.tabs{flex-wrap:nowrap;overflow-x:auto}`) and is the opposite of what the
 * sibling this site was cloned from does. The reason is the track: a rail is a
 * 999px shape, and a 999px shape four rows tall is not a rail, it is a blob —
 * so a wrapping row would mean giving up the object. The trade is acceptable
 * here and would not be on a site with twenty categories: seven pills at
 * ~150px come to about 1050px, so at this page's 1240px measure the whole set
 * sits in the rail UNSCROLLED, and the scroll only engages on a narrow window
 * or a phone, where a horizontal swipe inside an obvious track is a gesture
 * people already have. `no-scrollbar` hides the bar; the track's own edge is
 * what says there is more.
 *
 * THE MOCKUP'S COUNTRY SELECT IS NOT HERE. Its filter row opens with an "All
 * Countries" dropdown driven by a hard-coded `geo` field on each casino in its
 * demo data. The API has countries, but nothing scopes a casino LIST by one —
 * /countries/<slug> is its own page with its own rules — so a select here
 * would either do nothing or quietly filter on a field that does not mean what
 * its label says. The regions appear on each card instead, as chips.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="mb-8">
      <ul className="tab-track no-scrollbar flex flex-nowrap gap-1.5 overflow-x-auto p-1" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id} className="flex flex-none">
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab flex min-h-11 items-center gap-2 whitespace-nowrap px-4 text-[14.5px] font-semibold ${
                  active ? 'tab-on' : ''
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                )}
                <span>{c.name}</span>
                {typeof c.casinos_count === 'number' && (
                  /* The mockup's `.tab .n`: the count in a 22px disc beside the
                     label. Both its colours live in globals.css beside
                     `.tab-on`, for the same layering reason the active tab
                     does — a `text-*` utility here would lose to the unlayered
                     `.tab` and win over nothing. */
                  <span className="tab-count grid h-[22px] min-w-[22px] place-items-center px-1.5 text-[12px] font-bold tabular-nums">
                    {c.casinos_count}
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
