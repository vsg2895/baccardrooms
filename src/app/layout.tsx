import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Figtree } from 'next/font/google'
import Link from 'next/link'
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate'
import NewsletterForm from '@/components/NewsletterForm'
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from '@/components/CookieConsent'
import ToastProvider from '@/components/ToastProvider'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import Logo from '@/components/Logo'
import { getSocialLinks, hasSpecialOffers, getCategories, getBonusArea } from '@/lib/api'
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { SITE_URL } from '@/lib/config'
import { COPY } from '@/constants/copy'
import { WRAP } from '@/constants/layout'
import NavDropdown from '@/components/NavDropdown'
import FooterNavGroup from '@/components/FooterNavGroup'
import MobileNav from '@/components/MobileNav'
import { resolveImageUrl } from '@/lib/images'
import { LEGAL_PAGES } from '@/constants/legalPages'
import type { SocialLink } from '@shared/types/socialLink'
import './globals.css'

// The TWO faces of sites/baccardrooms.html.
//
// BODONI MODA is a Didone — the class of face a casino prints its own table
// limits and room cards in, and the reason it is here rather than any other
// serif. It carries every heading, the wordmark, the table's label, the Roman
// numerals on the rooms and the FAQ, and nothing else. Its ITALIC is a true
// cursive cut, not a slant, which is what makes the hero's `right room` and
// the wordmark's `Rooms` change voice rather than just lean over.
//
// It is loaded with its ITALIC and at 500/600/700. The italic is not optional
// here — it is a structural part of the design, used in eight places — and a
// browser asked to synthesise it would shear the hairlines of a face whose
// hairlines are its whole character.
//
// A DIDONE'S LIMIT IS SMALL SIZES, and on a dark ground the limit arrives
// sooner: light type on dark appears thinner than the reverse, so the hairline
// strokes break up. This face is therefore used at 18px and up only, and
// `--font-label` is deliberately NOT the display face on this site — unlike
// every sibling — because every label, chip, count and caption here is under
// that size.
//
// FIGTREE carries all of those, plus everything that is read at text size: the
// deck, the facts on a card, the buttons, the form fields, the prose. A plain
// geometric sans with a tall x-height, which is exactly what a Didone wants
// next to it — anything with character of its own would argue with it.
const bodoni = Bodoni_Moda({
  variable: '--font-bodoni-moda',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
})
const figtree = Figtree({ variable: '--font-figtree', subsets: ['latin'] })

/**
 * Subscribe capture: every entry point on this site — the newsletter form and,
 * where the site has one, the timed subscribe modal.
 *
 * The components, the /api/newsletter route and the backend double-opt-in flow
 * are never touched by this; it only decides whether they are rendered. That is
 * the point of a flag rather than deleted markup: turning capture off and back
 * on is one edit, and nothing has to be rebuilt from memory.
 */
const SUBSCRIBE_ENABLED = true

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Baccard Rooms'

// Both strings live in COPY so this site's wording is defined in exactly one
// place — the same place the page-level titles and descriptions come from.
// The previous SITE_DESCRIPTION here was byte-identical to a sibling domain's,
// which made this site's default meta/og/twitter description duplicate content
// on every page that falls back to it.
const SITE_TITLE = `${SITE_NAME} — ${COPY.site.titleTail}`
const SITE_DESCRIPTION = `${SITE_NAME} ${COPY.site.description}`

export const metadata: Metadata = {
  // THE origin every relative canonical and og:url in the app resolves
  // against. `SITE_URL` is validated at module load (see lib/config), so the
  // old `|| 'https://…'` literal is gone: a second hardcoded host here is
  // exactly how the canonical and the sitemap drifted onto different hosts.
  metadataBase: new URL(SITE_URL),
  // Root default. Every page overrides it with its own path, so each URL
  // gets a SELF-referencing canonical rather than inheriting the homepage's.
  alternates: { canonical: '/' },
  title: {
    // Home & inner pages set their own; this is the SEO-friendly fallback title.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Terms that describe what THIS site publishes. The generic set that was
  // here was shared with a sibling domain and described neither in particular.
  keywords: [...COPY.site.keywords, SITE_NAME],
  // Tab icon.
  //
  // This used to offer ONLY icon.svg. Browsers that do not take an SVG favicon
  // — Safari most visibly — then had nothing to fall back to, because
  // /favicon.ico 404'd, so they showed a placeholder or a stale cached icon
  // instead of this site's own mark. app/favicon.ico now holds 16/32/48 rasters
  // cut from that same artwork, and Next links it automatically from the file
  // convention, so it is deliberately NOT repeated here.
  //
  // `apple` DOES have to be listed: an explicit icons object suppresses the
  // apple-icon file convention, so app/apple-icon.tsx was generating a 180x180
  // PNG at /apple-icon that no page ever linked to.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Relative on purpose: Next resolves it against metadataBase, so og:url
    // and the canonical can never disagree about the host.
    url: '/',
    images: SHARE_IMAGES,
  },
  // The card TYPE only. A title and description here were inherited by every
  // page that does not set `twitter` itself — nearly all of them — so a shared
  // /casinos or /about went out on X under the HOME page's title. With these
  // tags absent, X reads the page's own og:title, og:description and og:image.
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Search-engine ownership verification, supplied per environment. Absent env
  // vars simply produce no tag, so nothing has to be committed to the repo.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        ? { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION }
        : {}),
    },
  },
}

/**
 * Viewport + theme colour.
 *
 * Next 14 moved these out of `metadata` into their own export; leaving
 * themeColor in `metadata` is silently ignored, which is why the sites had no
 * theme-color at all. `viewport-fit=cover` is deliberately omitted — nothing
 * here draws into the notch area.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a2c22',
}

const NAV_LINKS = [
  { href: '/casinos', label: COPY.nav.casinos },
  { href: '/special-offers', label: COPY.nav.specialOffers },
  { href: '/categories', label: COPY.nav.categories },
]

/** A nav link — the mockup's `.hdr .nav a`: sentence case, semibold, 15px,
 *  no fill, no box, no rule. It only changes colour on hover.
 *
 *  It is NOT `.lbl`, and it is NOT the display face. This site's labels are
 *  tracked capitals and they mark things that are NOT links — kickers, column
 *  heads, the glance sheet's terms; and the Didone is reserved for headings.
 *  Three nav entries in either treatment would make the one row a reader
 *  actually navigates with look like the least clickable thing on the page.
 *
 *  CREAM, not brass: brass is 5.38:1 on the felt against cream's 10.36, and
 *  a nav strip is read rather than glanced at. The brass arrives on hover,
 *  which is the only state change in the header. */
const NAV_LINK = 'flex min-h-11 items-center whitespace-nowrap px-4 py-2 text-[15px] font-semibold tracking-[0.02em] text-cream transition-colors hover:text-accent-light'

const FOOTER_LINK = 'inline-flex min-h-11 min-w-11 items-center text-[15px] font-medium text-night-muted transition-colors hover:text-night-ink'

/** A footer column head — the mockup's `.ftr h4`: 12.5px of Figtree at 800
 *  on 0.22em, in BRASS, with no rule under it. `.lbl` rather than the
 *  clone's display-face heads, because that is what the mockup draws and
 *  because the Didone at 12.5px on a dark ground is exactly the size this
 *  site does not use it at. Brass on the deep felt is 6.41:1. */
const FOOTER_HEAD = 'lbl block text-[12.5px] text-night-accent'

// The 11 legal pages split into the footer's three columns, as in the mockup.
// Every page in LEGAL_PAGES lands in exactly one of them.
const FOOTER_EXPLORE = ['about', 'contact']
const FOOTER_LEGAL = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer']
const FOOTER_POLICIES = ['responsible-gambling', 'affiliate-disclosure', 'editorial-policy', 'aml-policy', 'kyc-policy']

function footerPages(slugs: string[]) {
  return LEGAL_PAGES.filter(({ slug }) => slugs.includes(slug))
}

/** The header dropdown panel, in this site's own palette.
 *
 *  DARK, and that is not a detail: `NavDropdown` is byte-identical on every
 *  site in the network and takes its whole appearance from these four
 *  strings, so a light panel here would be a sheet of ivory hanging off a
 *  dark header — the one thing on this site that looks like a card without
 *  being one. The deep felt, a brass edge and a 16px corner, which is the
 *  rung this design gives a container that holds rows.
 *
 *  A hovered row lifts to the raised felt rather than taking a tint: there is
 *  no pale oxblood on this site to tint with, and brass behind text would put
 *  a 4.33:1 ground under a 15px row. */
const NAV_PANEL = {
  panelClassName: 'bg-navy border border-accent rounded-2xl shadow-[0_26px_50px_-24px_rgba(0,0,0,0.7)]',
  itemClassName: 'text-night-muted hover:bg-navy-2 hover:text-night-ink',
  allItemClassName: 'text-night-ink hover:bg-navy-2 hover:text-night-accent',
  arrowClassName: 'text-accent',
}

/** The phone menu (below `md`), in this site's own palette — the mockup's
 *  `.burger` and `.mnav`: a ROUND 46px button with a brass edge, over rows
 *  parted by brass hairlines on the deep felt.
 *
 *  SOLID brass on the trigger, not the mockup's `rgba(201,164,92,.25)`: the
 *  burger is the only control in the header bar at phone width, and a 1.52:1
 *  boundary is not a boundary. The row dividers keep the low alpha, because a
 *  divider between two rows of one panel is the one thing on this site that
 *  is allowed to be faint. */
const NAV_MOBILE = {
  triggerClassName: 'rounded-full border border-accent bg-transparent text-accent-light hover:bg-accent hover:text-accent-ink',
  panelClassName: 'bg-navy border-accent border-t',
  rowClassName: 'text-cream hover:bg-navy-2 hover:text-accent-light',
  rowExpandedClassName: 'bg-navy-2 text-accent-light',
  allClassName: 'text-night-ink hover:bg-navy-2 hover:text-accent-light',
  childClassName: 'text-night-muted hover:bg-navy-2 hover:text-night-ink',
  guideClassName: 'border-night-line',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /*
   * Widened to `string` deliberately.
   *
   * COPY is `as const`, so this would otherwise carry the LITERAL type of
   * whatever address is written in copy.ts — and TypeScript then rejects
   * `!== ''` as a comparison that can never be true. The check is not
   * pointless: a freshly cloned site ships with this blank, and the footer has
   * to omit the whole <address> element rather than print an empty one.
   */
  const postalAddress: string = COPY.footer.postalAddress

  let socialLinks: SocialLink[] = []
  try {
    socialLinks = (await getSocialLinks()).data
  } catch {
    socialLinks = []
  }

  // "Special Offers" only earns its slot in the nav when this site actually has
  // a visible offer to show; with none, the link would lead to an empty page,
  // so both the header and the footer drop it.
  const showSpecialOffers = await hasSpecialOffers()
  const navLinks = NAV_LINKS.filter(({ href }) => href !== '/special-offers' || showSpecialOffers)

  // Children for the Casinos and Bonuses entries, header and footer
  // alike. Each carries the icon its chip shows, resolved here on the server so
  // the client menus never need the storage URL. A failed fetch yields no
  // items, and the entry then stays the plain link it always was.
  const categoryMenuItems = await getCategories()
    .then((res) => res.data.map((c) => ({ slug: c.slug, name: c.name, icon: resolveImageUrl(c.logo_path) })))
    .catch(() => [])
  // Bonus types with at least one visible offer on this site (the API drops
  // empty ones). getBonusArea already falls back to [] on failure.
  const bonusMenuItems = (await getBonusArea()).map((section) => ({
    slug: section.slug,
    name: section.name,
    icon: resolveImageUrl(section.icon_path),
  }))

  // Site-wide structured data, rendered once here so every page carries it.
  // Next.js manages the document <head> (manual <head> tags in a root layout are
  // discouraged), so per the framework's JSON-LD guide the <script> is rendered
  // in the layout body — crawlers read JSON-LD from anywhere in the document.
  // The `<` escaping keeps the payload XSS-safe.
  //
  // Two nodes, cross-referenced by @id: the publisher (Organization) and the
  // site (WebSite). socialLinks is already fetched above for the footer, so
  // `sameAs` costs no extra request.
  const siteGraph = [buildOrganizationSchema(socialLinks), buildWebSiteSchema()]

  return (
    <html lang="en" className={`${figtree.variable} ${bodoni.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-felt text-cream">
        {/* Opens every page at its top — see the component. */}
        <ScrollToTopOnNavigate />
        <ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(siteGraph),
          }}
        />
        {/* THE TOP BAR — the mockup's `.top`: a strip of the deepest felt
            above everything, carrying one sentence about the method and the
            18+ line, parted by a brass hairline.

            It is NOT sticky and comes before the header on purpose: it is
            read once. Its left-hand sentence is the first thing to go when
            the row narrows — the 18+ line is the one of the two that has to
            survive a phone. */}
        <div className="border-b border-accent/25 bg-navy text-[14px] text-night-muted">
          <div className={`${WRAP} flex min-h-[42px] flex-wrap items-center justify-between gap-4 py-1.5`}>
            <p className="hidden min-[64rem]:block">{COPY.topBar.note}</p>
            <p className="flex items-center gap-2 whitespace-nowrap">
              <span aria-hidden className="suit text-accent">&#9824;</span>
              {COPY.topBar.meta}
            </p>
          </div>
        </div>

        {/* THE HEADER — the mockup's `.hdr`: sticky, 80px tall, the deepest
            felt at 94% behind an 8px blur, closed by a brass hairline. The
            two cards and the wordmark at the left, the three sections at the
            right, and nothing else in the row.

            FROSTED, which on this site is the correct call and on half its
            siblings would not be: the page behind it is one flat felt under
            one soft bloom, so a translucent bar over it reads as the lamp
            catching the rail rather than as a smear over a pattern.

            `z-50`, above the dropdown panels' own stacking, because those are
            portalled into `<body>` and have to sit under the bar they hang
            from rather than over it. */}
        <header className="sticky top-0 z-50 border-b border-accent/35 bg-navy/[0.94] backdrop-blur-[8px]">
          <div className={`${WRAP} flex min-h-[80px] items-center justify-between gap-5 py-2.5`}>
            {/* The strapline under the wordmark goes first when the row runs
                out of width: at 375px the two cards, the name and the burger
                take the whole row, and the three tracked words underneath are
                the one part of it a reader already has from the page itself.
                The mockup hides it at the same place, in `@media(max-width:420px)`. */}
            <Logo taglineClassName="hidden min-[26rem]:block" />

            <nav aria-label="Main navigation" className="hidden md:block">
              <ul className="flex items-center gap-1.5" role="list">
                {navLinks.map(({ href, label }) =>
                  href === '/casinos' && categoryMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : (
                    <li key={href} className="flex">
                      <Link href={href} className={NAV_LINK}>
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* NO FORM HERE. The strip below carries it at every width — see
                the comment there — so the header is the mark and the nav and
                nothing else, which is how the mockup draws it. */}

            {/* Below md the nav strip above is hidden and this menu replaces it. */}
            <MobileNav
              links={navLinks}
              groups={{
                '/casinos': { allLabel: COPY.nav.allCasinos, items: categoryMenuItems, itemBasePath: '/categories' },
                '/special-offers': { allLabel: COPY.nav.allOffers, items: bonusMenuItems, itemBasePath: '/bonuses' },
              }}
              theme={NAV_MOBILE}
            />
          </div>
        </header>

        {/* THE SUBSCRIBE STRIP — the members' notice. The mockup has no
            form at all; this is the network's own rule, and it is a real one:
            a site with no subscribe path above the fold has no subscribe path
            on a phone.

            THE RAIL, not an ivory band. The one light material on this site
            is a CARD, and a sheet of card stock running the full width of the
            page would be the largest object on it and would not be a card —
            so the strip is the raised felt the table is covered in, between
            two brass hairlines, which is what the rail round a table is.

            OUTSIDE THE <header>, and that is the whole reason it is a second
            element rather than a second row inside it. Inside, it would
            inherit `position: sticky` and cost ~86px of every phone screen on
            top of the header's own 80 — over a fifth of an 812px viewport,
            permanently, on every page. Out here it scrolls away under the
            header once it has been seen, which is all a subscribe row needs
            to do.

            The heading and its line are the first thing to give when the row
            narrows: the field beside them carries its own label, so nothing
            is lost below `md` except the explanation. */}
        {SUBSCRIBE_ENABLED && (
          <section className="border-b border-accent/30 bg-navy-2" aria-label="Newsletter">
            <div className={`${WRAP} flex flex-wrap items-center justify-between gap-x-7 gap-y-4 py-[22px]`}>
              <div className="hidden min-w-0 flex-1 md:block">
                <p className="font-display text-[21px] text-paper">{COPY.newsletter.barLead}</p>
                <p className="mt-1 text-[14.5px] text-cream-muted">{COPY.newsletter.barTail}</p>
              </div>
              {/* `compact` = no intro: the two lines beside it are the intro. */}
              <NewsletterForm compact tone="bar" className="w-full md:w-auto md:flex-[1_1_460px] md:max-w-[460px]" />
            </div>
          </section>
        )}

        <div className="flex-1">{children}</div>

        {/* Subscribe, a SECOND time, directly above the footer.

            The strip under the header scrolls away, so on a page this long
            someone who reads to the end has no way in without going back up.

            Here it IS a card — an ivory one on the 22px rung, dealt onto the
            felt with the same two shadows every casino card has, because at
            this point in the page a light surface is exactly what the reader
            has been reading all along. Not a full-bleed colour band: the
            footer directly beneath it is already a full-bleed block of the
            deepest felt, and two bands touching would read as one confused
            one. */}
        {SUBSCRIBE_ENABLED && (
          <section className={`${WRAP} mt-[110px]`} aria-label="Newsletter">
            <div className="ccard flex flex-wrap items-center justify-between gap-8 px-7 py-11 sm:px-11">
              <div className="relative z-[1] min-w-[260px] flex-[1_1_340px]">
                <span className="lbl block text-[12.5px] text-brand">{COPY.newsletter.bandKicker}</span>
                <h2 className="font-display mt-3 text-[clamp(28px,3.4vw,42px)] text-ink">
                  {COPY.newsletter.bandTitle}
                </h2>
                <p className="mt-3.5 max-w-[440px] text-[16.5px] text-ink-soft">{COPY.newsletter.bandSubtitle}</p>
              </div>
              {/* `compact` = no intro: the card carries the heading itself. */}
              <NewsletterForm compact className="relative z-[1] min-w-[260px] flex-[1_1_380px] lg:max-w-[440px]" />
            </div>
          </section>
        )}

        {/* Footer — the mockup's `.ftr`: the deepest felt, opened by a
            BRASS HAIRLINE, carrying the brand and its line, Explore / Legal /
            Policies, and the legal bar.

            A rule here, unlike the clone, because the step from the page felt
            to the deep felt is only 1.33:1 — the two are the same colour two
            shades apart, and without the brass line the footer would simply
            begin somewhere. That line is the mockup's own
            `rgba(201,164,92,.4)`: decorative, dividing two of this site's own
            grounds, which is the one job a faint rule is right for. */}
        <footer className="relative mt-[110px] border-t border-accent/40 bg-navy text-night-muted">
          <div className={`${WRAP} relative pb-7 pt-16`}>
            <div className="flex flex-wrap justify-between gap-10">
              <div className="max-w-[360px] flex-[1_1_260px]">
                {/* The Logo component itself, so the two cards and the
                    wordmark here can never drift from the header's. */}
                <Logo onDark />
                <p className="mt-4 text-[15px] text-night-muted">{COPY.footer.tagline}</p>
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className={`${FOOTER_HEAD} mb-3`}>Follow us</p>
                    <SocialIcons links={socialLinks} onDark />
                  </div>
                )}
              </div>

              <div className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6">
                <div>
                  <p className={FOOTER_HEAD}>Explore</p>
                  <ul className="mt-3 flex flex-col">
                    {navLinks.map(({ href, label }) =>
                      href === '/casinos' && categoryMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : (
                        <li key={href}>
                          <Link href={href} className={FOOTER_LINK}>{label}</Link>
                        </li>
                      ),
                    )}
                    {footerPages(FOOTER_EXPLORE).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Legal">
                  <p className={FOOTER_HEAD}>Legal</p>
                  <ul className="mt-3 flex flex-col">
                    {footerPages(FOOTER_LEGAL).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                    <li>
                      <CookieSettingsButton className={FOOTER_LINK} />
                    </li>
                  </ul>
                </nav>
                <nav aria-label="Policies">
                  <p className={FOOTER_HEAD}>Policies</p>
                  <ul className="mt-3 flex flex-col">
                    {footerPages(FOOTER_POLICIES).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* The 18+ mark and the legal line, on one rule — the mockup's
                `.legal`. Not `aria-hidden`: the sentence beside it never says
                the age, so a screen reader needs the "18+" too.

                The mockup's `.age`: a 36px circle drawn as a 1.5px BRASS RING
                rather than a fill. On the deep felt the brass is 6.41:1 and
                its light step 9.61, and the ring is the right one — a filled
                brass disc would be the only solid block of metal in the
                footer and would pull the eye off the sentence it introduces. */}
            <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-accent/25 pt-[22px] text-[14px] text-night-muted">
              <p className="flex min-w-0 flex-[1_1_320px] items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[1.5px] border-accent text-[12px] font-bold text-night-accent">18+</span>
                <span>
                  <b className="font-semibold text-night-ink">Gamble responsibly.</b> {COPY.footer.disclaimer}
                </span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-3 text-[14px] text-night-faint">
              <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
              {/* Rendered only when an address exists: a freshly cloned site
                  ships with this blank, and an empty <address> is worse than
                  none. `not-italic` is load-bearing — Preflight does not reset
                  the tag's italic default. */}
              {postalAddress !== '' && <address className="not-italic">{postalAddress}</address>}
            </div>
          </div>
        </footer>

        <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
