import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { WRAP, WRAP_NARROW } from '@/constants/layout'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

/** The page measure — the mockup's `.wrap` and `.narrow`. IMPORTED from the
 *  layout rather than redeclared, because the header, the subscribe strip and
 *  the footer are drawn there and all five columns have to line up. The clone
 *  declared its own here and shipped three different widths. */

/**
 * Splits a sentence around one phrase so the page can set that phrase in the
 * display face's TRUE ITALIC — the mockup's `<em>` in the hero headline,
 * drawn by `.hl` in globals.css.
 *
 * The phrase is named in COPY rather than marked up there, so the sentence
 * stays plain text and can go straight into a <title> or a JSON-LD field with
 * no tags to strip. If the phrase ever stops matching the sentence (an edit to
 * one and not the other), this returns the sentence whole and it simply
 * renders unmarked — a missing highlight, not a broken paragraph.
 */
function splitOnPhrase(text: string, phrase: string): [string, string, string] {
  const at = phrase ? text.indexOf(phrase) : -1
  if (at === -1) return [text, '', '']
  return [text.slice(0, at), phrase, text.slice(at + phrase.length)]
}

/**
 * Splits a heading before its LAST WORD, so a section head can set that word
 * in the italic brass — the mockup's `.sec-head h2 em`, which it applies to
 * every section head on the page.
 *
 * DERIVED rather than marked up in COPY, and that is a deliberate trade. The
 * alternative is a second key beside every title ('titleHead' / 'titleTail'),
 * which doubles the number of strings a translator or an editor has to keep
 * in step for a gesture that is purely typographic — and the key structure is
 * shared with twelve sibling sites that do not have this gesture at all.
 *
 * A one-word heading returns no tail and renders upright, which is correct:
 * there is nothing to set off a single word against.
 */
function lastWord(title: string): [string, string] {
  const at = title.trimEnd().lastIndexOf(' ')
  if (at === -1) return [title, '']
  return [title.slice(0, at + 1), title.slice(at + 1)]
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // The clone asked the API a third question here — "does ANY visible offer
  // exist?" — to decide whether to render a second hero button. This hero's
  // buttons are decided by `bonusSections`, which is already fetched, so that
  // request is gone rather than being made and ignored.

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* THE HERO — the mockup's `.hero-grid`: the claim on the left and
            THE TABLE on the right, on a `minmax(0,1fr) minmax(0,1.05fr)`
            grid that collapses to one column at 940px.

            The table gets the LARGER track, which is the mockup's own split
            and is the right way round for this site: the three names on it
            are the page's only content above the fold, and the claim beside
            them is four lines of type that fit any width. */}
        <section className="pt-[52px] pb-10 sm:pt-[72px]" aria-labelledby="hero-headline">
          <div className={`${WRAP} grid grid-cols-1 items-center gap-12 min-[59rem]:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] min-[59rem]:gap-14`}>
            <div>
              <span className="lbl lbl-rule block text-[12.5px] text-accent">{COPY.home.heroEyebrow}</span>

              <h1
                id="hero-headline"
                className="font-display mb-6 mt-[18px] text-[clamp(44px,6.4vw,88px)] text-paper"
              >
                {COPY.home.heroHeadline}{' '}
                {/* `.hl` is the display face's TRUE ITALIC in brass — on a
                    Didone a separate cursive cut, not a slant, so the phrase
                    changes voice. No bar under it: the face is the gesture
                    here, and a rule as well would be saying it twice. Brass
                    on the felt is 5.38:1, and this is 44px and up, where 3:1
                    is the bar for large text. */}
                <em className="hl">{COPY.home.heroHighlight}</em>
                {COPY.home.heroHeadlineTail}
              </h1>

              <p className="mb-8 max-w-[520px] text-[clamp(17px,1.7vw,20px)] text-cream-soft">
                {(() => {
                  const [before, mark, after] = splitOnPhrase(COPY.home.heroSubtitle, COPY.home.heroSubtitleMark)
                  return mark ? (
                    <>
                      {before}
                      <b className="font-semibold text-paper">{mark}</b>
                      {after}
                    </>
                  ) : (
                    COPY.home.heroSubtitle
                  )
                })()}
              </p>

              {/* THE ROOMS FIRST, in the primary button, which is this site's
                  claim in one control: the mockup sends its brass button to
                  `#casinos` and its outlined one to `#bonuses`, and this
                  turns that round. With no Bonus area there is no room to
                  send anyone to, so the primary falls back to the ranking and
                  the secondary disappears rather than leading to an empty
                  page. */}
              <div className="flex flex-wrap gap-3">
                {bonusSections.length > 0 ? (
                  <>
                    <Link href="#rooms" className="btn-gold">{COPY.home.specialOffers}</Link>
                    <Link href="#casinos" className="btn-on-dark">{COPY.home.featuredCasinos}</Link>
                  </>
                ) : (
                  <Link href="/casinos" className="btn-gold">{COPY.home.featuredCasinos}</Link>
                )}
              </div>

              {/* THE DISCLOSURE, above the fold. The mockup puts two PROOF
                  FIGURES here — "Real money / tested at every casino" and
                  "Weekly / terms re-checked" — and neither ships: see
                  constants/copy.ts. What belongs above the fold on a site
                  that earns a commission is the commission, and it is
                  repeated under the three checks and again in the house
                  rules. */}
              <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-accent/30 pt-6 text-[14.5px] text-cream-muted">
                <b className="font-semibold text-paper">{COPY.home.heroBylineName}</b>
                <span aria-hidden>·</span>
                <span>{COPY.home.heroBylineNote}</span>
              </p>
            </div>

            {/* THE TABLE — the mockup's `.table`: the top three dealt onto a
                baccarat table. See `.felt-table` in globals.css for the four
                layers that make the rail, the brass bead and the lamp.

                Rendered only with three to deal. A table is a fixed shape
                with three betting positions on it, and one occupied seat in a
                200px arc would read as something failing to load — where the
                hero simply going to one column reads as a narrow page. */}
            {casinos.length >= 3 && (
              <aside className="felt-table px-4 pb-7 pt-14 sm:px-7 sm:pt-[56px]" aria-labelledby="top-three-heading">
                <div className="mb-5 text-center">
                  <span className="lbl block text-[11.5px] text-accent">{COPY.home.podiumBadge}</span>
                  <h2 id="top-three-heading" className="font-display-it mt-1.5 text-[20px] text-accent-light">
                    {COPY.home.podiumTitle}
                    <span className="sr-only"> — {COPY.home.podiumSubtitle}</span>
                  </h2>
                </div>
                <ol className="flex flex-col gap-3">
                  {casinos.slice(0, 3).map((c, i) => (
                    <li key={c.id} className="flex">
                      {/* The seat label spans both columns below `sm`, which
                          is the mockup's own `.bet .z{grid-column:1/-1}` —
                          at phone width a 96px label column leaves a casino
                          name 120px to sit in. */}
                      <Link
                        href={`/casinos/${c.slug}`}
                        className="pick grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-4 py-3.5 min-[26rem]:grid-cols-[88px_minmax(0,1fr)_auto] min-[26rem]:px-[18px] min-[26rem]:py-4"
                      >
                        <span className="lbl col-span-2 text-[12px] tracking-[0.2em] text-accent-light min-[26rem]:col-span-1">
                          {COPY.home.podiumSeats[i]}
                        </span>
                        <span className="min-w-0">
                          <b className="pick-name font-display block text-[23px] text-paper [overflow-wrap:anywhere]">
                            {c.name}
                          </b>
                          {c.bonuses && <span className="mt-0.5 block text-[14px] text-cream-muted">{c.bonuses}</span>}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap text-[14px] font-bold text-accent-light tabular-nums">
                          <span className="sr-only">{COPY.home.podiumRatingLabel} </span>
                          {c.rating.toFixed(1)}
                          <span aria-hidden>→</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </aside>
            )}
          </div>
        </section>

        {/* 1 — THE ROOMS, and they come FIRST.

            Every other site in this network puts its bonus types below the
            casino list, and this one cannot: the room is its unit, the brand
            is named after it, and a page arguing that the kind of contract
            matters more than the brand cannot open with a league table of
            brands. The hero's primary button points here.

            Nothing at all without a Bonus area, in which case the ranking
            below becomes the first section, as on every sibling. */}
        {bonusSections.length > 0 && (
          <section id="rooms" className="scroll-mt-28 pt-14 sm:pt-[72px]" aria-labelledby="bonus-types-heading">
            <div className={WRAP}>
              <SectionHead
                id="bonus-types-heading"
                eyebrow={COPY.home.bonusTypesKicker}
                title={COPY.home.bonusTypesTitle}
              />
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* 2 — the ranking. Category tabs, then the playing cards. */}
        <section id="casinos" className="scroll-mt-28 pt-14 sm:pt-[72px]" aria-labelledby="top-casinos-heading">
          <div className={WRAP}>
            <SectionHead
              id="top-casinos-heading"
              eyebrow={COPY.home.rankingLabel}
              title={COPY.home.topCasinosTitle}
              subtitle={COPY.home.topCasinosSubtitle}
              more={casinos.length > 0 ? { href: '/casinos', label: COPY.home.viewAll, sr: ' casinos' } : undefined}
            />

            {categories.length > 0 && selected && (
              <CategoryNav categories={categories} selected={selected} />
            )}

            {casinos.length === 0 ? (
              /* The mockup's `.empty`: a DASHED box in the italic Didone,
                 which is the one dashed edge on the page and is exactly right
                 for a container holding nothing — it reads as a placeholder
                 rather than as a card that happens to be blank. */
              <p className="font-display-it rounded-[22px] border-[1.5px] border-dashed border-accent/45 p-12 text-center text-[20px] text-cream-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={CASINO_LIST}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-9 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-on-dark">
                  See more tables<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 3 — the offers, grouped by the room they belong to. */}
        {bonusSections.length > 0 ? (
          <section id="bonuses" className="scroll-mt-28 pt-14 sm:pt-[72px]" aria-labelledby="bonus-heading">
            <div className={WRAP}>
              <SectionHead
                id="bonus-heading"
                eyebrow={COPY.home.bonusesLabel}
                title={COPY.home.bonus}
                subtitle={COPY.home.bonusesSubtitle}
                more={{ href: '/special-offers', label: COPY.home.seeAllBonuses, sr: '' }}
              />
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section id="bonuses" className="scroll-mt-28 pt-14 sm:pt-[72px]" aria-labelledby="offers-heading">
            <div className={WRAP}>
              <SectionHead
                id="offers-heading"
                eyebrow={COPY.home.bonusesLabel}
                title={COPY.specialOffers.pageTitle}
                more={{ href: '/special-offers', label: COPY.home.viewAll, sr: ' bonus offers' }}
              />
              <div className={OFFER_GRID}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4 — HOW WE READ A ROOM. Three ivory cards, each led by its Roman
            numeral and a place in a casino: THE DOOR, THE STAKES, THE CAGE.

            Not the mockup's DEPOSIT, PLAY and WITHDRAW. Its own three
            describe funding a live account, playing through a bonus and
            timing a payout; nothing in this project records any of that, and
            a review site inventing its own test results is the one failure
            that cannot be walked back. These three are the reads that answer
            the same questions from pages anyone can open — in the order a
            reader meets them once they are through the door. */}
        <section className="pt-14 sm:pt-[72px]" aria-labelledby="method-heading">
          <div className={WRAP}>
            <SectionHead id="method-heading" eyebrow={COPY.home.methodLabel} title={COPY.home.methodTitle} subtitle={COPY.home.methodSubtitle} />
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
              {COPY.home.methodSteps.map((step) => (
                <li key={step.no} className="step relative px-6 py-7 sm:px-7">
                  <p className="flex items-baseline gap-2.5">
                    <span className="font-display-it text-[22px] text-brand">{step.no}.</span>
                    <span className="lbl text-[12.5px] text-brand">{step.verb}</span>
                  </p>
                  <h3 className="font-display mb-2.5 mt-3 text-[23px] text-ink">{step.title}</h3>
                  <p className="text-[15.5px] leading-[1.65] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>

            {/* The disclosure again, and here it is the fourth step in all but
                name: the three above say what gets read, and this says who
                pays for the reading. On the one OXBLOOD slab this design has
                — the same `.deep-panel` a casino page sets its bonus in —
                because it is the only line in the section a reader might
                otherwise skim past. White on the oxblood is 8.97:1. */}
            <p className="deep-panel mt-6 flex items-start gap-4 px-6 py-5 text-[16px] font-semibold">
              <span aria-hidden className="suit mt-[-2px] shrink-0 text-[22px] leading-none opacity-80">&#9824;</span>
              <span>{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* 5 — THE HOUSE RULES. Every answer is in the HTML, open or closed,
            which the FAQPage schema requires. NARROWER than every other
            section — the mockup's own `.narrow`. */}
        <section className="pt-14 sm:pt-[72px]" aria-labelledby="faq-heading">
          <div className={WRAP_NARROW}>
            <SectionHead id="faq-heading" eyebrow={COPY.home.faqLabel} title={COPY.home.faqTitle} subtitle={COPY.home.faqSubtitle} />
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}

/**
 * The mockup's `.sec-head`: a KICKER in tracked brass capitals behind a 28px
 * brass dash, the heading under it with its LAST WORD in the italic brass,
 * a standfirst beneath that, and an optional link to the full list pushed to
 * the right margin and aligned with the bottom of the block.
 *
 * NO RULE, no band and no background. The kicker's dash is the only line a
 * section gets, and it is 28px long: the cards below a heading are what say
 * where a section begins, and a rule across the page as well would be saying
 * it twice.
 *
 * THE LAST WORD IS ITALIC, which is the opposite of the choice made on
 * avantlinks — there the hero's highlight is the site's one typographic
 * gesture and every section head is plain. Here the mockup applies the
 * gesture to all four of its heads, and on a Didone it earns that: the italic
 * is a separate cut of the face rather than a slant or a tint, so a section
 * head reads as one phrase in two voices rather than as a heading with a
 * coloured word in it. See `lastWord` above for why it is derived.
 *
 * `flex-[1_1_28rem]` on the text block and `flex-none` on the link, and both
 * are load-bearing. `flex-wrap` breaks lines on each item's HYPOTHETICAL size
 * — its flex-basis, which for an unconstrained block is its max-content width
 * — not on its min-content width. A 58px heading's max-content width runs to
 * well over 1000px, so with `auto` basis the pair wrapped at every viewport
 * and the "View all" link landed on its own line at the LEFT margin, under
 * the standfirst. A 28rem basis is what lets the two share a row until they
 * genuinely cannot.
 *
 * The kicker is `aria-hidden`. It is a second, shorter name for the same
 * section — "The tables" over "The Tables, Ranked" — and announcing both
 * would read the heading twice.
 *
 * A local component rather than one in components/: every site in the network
 * heads its sections differently, and this shape is this design's own.
 * Nothing else renders it, so it lives where it is used.
 */
function SectionHead({
  id,
  eyebrow,
  title,
  subtitle,
  more,
}: {
  id: string
  eyebrow?: string
  title: string
  subtitle?: string
  more?: { href: string; label: string; sr: string }
}) {
  const [head, tail] = lastWord(title)
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-5 gap-y-3">
      <div className="min-w-0 flex-[1_1_28rem]">
        {eyebrow && (
          <span aria-hidden className="lbl lbl-rule mb-3.5 block text-[12.5px] text-accent">
            {eyebrow}
          </span>
        )}
        <h2 id={id} className="font-display text-[clamp(32px,4.6vw,58px)] text-paper">
          {head}
          {tail && <em className="hl">{tail}</em>}
        </h2>
        {subtitle && <p className="mt-2.5 max-w-[640px] text-[17px] text-cream-muted">{subtitle}</p>}
      </div>
      {more && (
        <Link
          href={more.href}
          className="inline-flex min-h-11 flex-none items-center gap-1.5 text-[15px] font-bold text-accent-light transition-colors hover:text-paper"
        >
          {more.label}{more.sr && <span className="sr-only">{more.sr}</span>} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  )
}
