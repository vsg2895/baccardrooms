import type { Metadata } from 'next'
import { getSpecialOffers } from '@/lib/api'
import { buildWebPageSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import { SITE_URL } from '@/lib/config'
import { WRAP } from '@/constants/layout'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: COPY.specialOffers.pageTitle,
    description: COPY.specialOffers.pageDescription,
    alternates: { canonical: `/special-offers` },
    openGraph: { type: 'website', url: `/special-offers`, siteName: SITE_NAME, title: COPY.specialOffers.pageTitle, description: COPY.specialOffers.pageDescription, images: SHARE_IMAGES },
  }
}

export default async function SpecialOffersPage() {
  const res = await getSpecialOffers()
  const offers = res.data

  // These listing pages carried no structured data at all. A WebPage node
  // anchors them into the site graph so they are not read as orphans.
  const webPage = buildWebPageSchema({
    name: COPY.specialOffers.pageTitle,
    url: `${SITE_URL}/special-offers`,
    description: COPY.specialOffers.pageDescription,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(webPage) }} />
      <main className="pb-12 pt-6 sm:pb-16 sm:pt-10">
      <div className={WRAP}>
        <header className="mb-4 sm:mb-8">
          <h1 className="font-display text-[clamp(30px,8.5vw,36px)] text-paper [overflow-wrap:break-word] sm:text-[clamp(38px,4.6vw,58px)]">{COPY.specialOffers.pageTitle}</h1>
          <p className="mt-2 max-w-[680px] text-[15px] text-cream-muted sm:mt-3 sm:text-[17px]">{COPY.specialOffers.pageDescription}</p>
        </header>
        {offers.length === 0 ? (
          <p className="font-display-it rounded-[22px] border-[1.5px] border-dashed border-accent/45 p-12 text-center text-[20px] text-cream-muted">{COPY.specialOffers.noResults}</p>
        ) : (
          <div className={OFFER_GRID}>
            {offers.map((offer) => <SpecialOfferCard key={offer.id} offer={offer} />)}
          </div>
        )}
      </div>
      </main>
    </>
  )
}
