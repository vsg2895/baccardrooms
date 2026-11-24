import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * THE TWO CARDS, dealt onto the felt, at card size.
 *
 * ── Satori has no Didone, and that decides the composition ────────────────
 *
 * This card is rendered by Satori, which draws only fonts it is handed as
 * binary data. `next/font/google` fetches Bodoni Moda at build time into
 * `.next` under a hashed name, so there is no stable path to read it from
 * here, and fetching a font over the network inside an image route makes the
 * build depend on a third party being up.
 *
 * So the brand signal on this card is THE MARK, not the face: the two
 * overlapping cards drawn large, the brass rules, and the felt. The type is
 * whatever Satori has, set small and tracked, and it is not pretending to be
 * the site's own. A share card in the wrong serif would look like a mistake;
 * a share card that leads with the mark looks like the mark.
 *
 * ── What it does not use ──────────────────────────────────────────────────
 *
 * No `repeating-conic-gradient` (so no chip), no mask and no pseudo-elements:
 * Satori renders none of the three. The two cards are plain boxes with a
 * `transform: rotate`, which it does render, and the spade is one `<path>`
 * inside an `<svg>`, which it also renders — a glyph would have needed a
 * symbol font nobody has handed it.
 *
 * Every element with more than one child carries an EXPLICIT `display`, which
 * Satori requires and a browser would have defaulted for us.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
          background: '#0e3a2d',
          color: '#f1e8d2',
          fontFamily: 'Helvetica, Arial, sans-serif',
          padding: '0 76px',
        }}
      >
        {/* THE CLAIM, at the left — the hero's own order. */}
        <div style={{ display: 'flex', flexDirection: 'column', width: 640 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#c9a45c',
            }}
          >
            The members&apos; guide to online casinos
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: 26,
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.015em',
              color: '#f6f0e1',
            }}
          >
            <span>Step into the&nbsp;</span>
            {/* The brass emphasis the hero sets in the Didone's italic. Satori
                would synthesise an oblique from the sans it has, which on a
                sans is just a slant — so here the phrase changes COLOUR and
                keeps its upright form. */}
            <span style={{ color: '#c9a45c' }}>right room.</span>
          </div>

          <div style={{ display: 'flex', marginTop: 26, fontSize: 25, lineHeight: 1.45, color: '#d8d0bb' }}>
            Casino bonuses sorted into rooms by the kind of contract they are.
          </div>

          {/* The wordmark, under the claim rather than over it: the mark is
              already the largest thing on the card. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 40 }}>
            <div style={{ display: 'flex', width: 46, height: 1, background: '#c9a45c' }} />
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: '0.01em' }}>
              <span style={{ color: '#f6f0e1' }}>Baccard</span>
              <span style={{ color: '#c9a45c' }}>Rooms</span>
            </div>
          </div>
        </div>

        {/* THE TWO CARDS, dealt. Plain boxes with a rotate, which is all the
            mark is: an oxblood card turned 10° behind an ivory one, both edged
            in brass, with a spade on the face of the front card. */}
        <div style={{ display: 'flex', position: 'relative', width: 370, height: 430, marginLeft: 46 }}>
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              left: 96,
              top: 10,
              width: 220,
              height: 310,
              borderRadius: 26,
              background: '#8e1b2b',
              border: '7px solid #c9a45c',
              transform: 'rotate(10deg)',
            }}
          />
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              left: 36,
              top: 42,
              width: 220,
              height: 310,
              borderRadius: 26,
              background: '#f6f0e1',
              border: '7px solid #c9a45c',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="118" height="140" viewBox="0 0 20 24">
              <path
                d="M10 1.5c0 0 8 6.6 8 11.2 0 3.2-2.2 5.3-4.6 5.3-1.6 0-2.8-.85-3.4-1.9-.6 1.05-1.8 1.9-3.4 1.9C4.2 18 2 15.9 2 12.7C2 8.1 10 1.5 10 1.5Z
                   M7.4 22.5c1.4-1.6 2-3.3 2.2-5.3h.8c.2 2 .8 3.7 2.2 5.3Z"
                fill="#1b1712"
              />
            </svg>
          </div>
        </div>

        {/* The deep-felt foot, which is where the page ends too. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 62,
            padding: '0 76px',
            background: '#0a2c22',
            color: '#bfb69e',
            fontSize: 21,
          }}
        >
          18+ · Gamble responsibly · baccardrooms.com
        </div>
      </div>
    ),
    size,
  )
}
