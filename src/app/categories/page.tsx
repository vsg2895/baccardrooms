import type { Metadata } from 'next'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { getCategories } from '@/lib/api'
import { buildWebPageSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { SITE_URL } from '@/lib/config'
import { WRAP } from '@/constants/layout'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: COPY.categories.pageTitle,
    description: COPY.categories.pageDescription,
    alternates: { canonical: `/categories` },
    openGraph: { type: 'website', url: `/categories`, siteName: SITE_NAME, title: COPY.categories.pageTitle, description: COPY.categories.pageDescription, images: SHARE_IMAGES },
  }
}

export default async function CategoriesPage() {
  const res = await getCategories()
  const categories = res.data

  // These listing pages carried no structured data at all. A WebPage node
  // anchors them into the site graph so they are not read as orphans.
  const webPage = buildWebPageSchema({
    name: COPY.categories.pageTitle,
    url: `${SITE_URL}/categories`,
    description: COPY.categories.pageDescription,
  })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(webPage) }} />
      <main className="pb-12 pt-6 sm:pb-16 sm:pt-10">
      <div className={WRAP}>
        <header className="mb-4 sm:mb-8">
          <h1 className="font-display text-[clamp(30px,8.5vw,36px)] text-paper [overflow-wrap:break-word] sm:text-[clamp(38px,4.6vw,58px)]">{COPY.categories.pageTitle}</h1>
          <p className="mt-2 max-w-[680px] text-[15px] text-cream-muted sm:mt-3 sm:text-[17px]">{COPY.categories.pageDescription}</p>
        </header>
        {categories.length === 0 ? (
          <p className="font-display-it rounded-[22px] border-[1.5px] border-dashed border-accent/45 p-12 text-center text-[20px] text-cream-muted">{COPY.categories.noResults}</p>
        ) : (
          <ul className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/categories/${c.slug}`} className="ccard flex h-full min-h-[86px] items-center justify-center p-4 text-center font-semibold text-ink sm:p-6">
                  {/* Icon beside the name, as on the chips and in the Casinos menu. */}
                  <span className="inline-flex items-center justify-center gap-2">
                    {c.logo_path && (
                      <img src={resolveImageUrl(c.logo_path)!} alt="" width={20} height={20} className="h-5 w-5 shrink-0" />
                    )}
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      </main>
    </>
  )
}
