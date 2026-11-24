'use client'

import { useState } from 'react'
import { COPY } from '@/constants/copy'
import { useToast } from '@/components/ToastProvider'
import { isValidEmail } from '@/lib/email'

/**
 * `compact` means NO INTRO — the field and the button alone, without the title
 * and subtitle the component otherwise prints above them.
 *
 * Both of this site's capture points are compact: the band above the footer
 * already carries an <h2> and its line, and the header has room for a field
 * and nothing else. Letting the form print its own pair on the band would
 * publish both twice, once as a heading and once as a paragraph. The
 * accessible name still carries the copy either way (`aria-label` on the form).
 *
 * It does NOT mean "small": the smaller mode is 46px, over the 44px tap
 * target, and the larger is 52px.
 *
 * `tone` is WHICH OF THE TWO CAPTURE POINTS this is, and ON THIS SITE THE
 * TWO STAND ON DIFFERENT GROUNDS — which is why the flag carries colours
 * here and only carries a size on the sibling it was cloned from:
 *
 *   'bar'  — the RAIL under the header: the raised felt, dark. The field is a
 *            well of the deepest felt with a solid brass edge and cream type,
 *            and the key is the brass primary with ink on it. 46px, the
 *            mockup's `.btn-sm`.
 *   'band' — the IVORY CARD above the footer, light. The field is a white
 *            well in the card with a brass-toned edge and ink type, and the
 *            key is the oxblood primary with white on it, at the full `.btn`
 *            height of 54px — which is why the FIELD is 54 and not the 52 it
 *            was cloned with: `.btn-or` pins `min-height: 54px` unlayered, so
 *            a field set to match a number written in the markup would have
 *            been 2px short of the control beside it for ever.
 *
 * Getting the pair the wrong way round on this site is not subtly wrong, it
 * is invisible: ink type on the felt is 1.4:1 and cream type on the ivory is
 * 1.2:1. Both mistakes are loud, which is the point — see globals.css.
 *
 * TWO SEPARATE SHAPES WITH A 10px GAP, in both tones — the mockup's own
 * `.sub-form{gap:10px}`, and the opposite of the siblings that draw one box
 * around the pair. On this site the field and the key are both on the 12px
 * control rung of the radius ladder, and that rung is what says they are
 * controls; welding them into one outline would make them a single object and
 * put the pair on a rung of its own for no reason.
 *
 * A boolean would have been enough today and wrong tomorrow: the next ground
 * this form lands on gets its own name here rather than a second flag.
 */
export default function NewsletterForm({
  compact = false,
  tone = 'band',
  className = '',
}: {
  compact?: boolean
  tone?: 'band' | 'bar'
  className?: string
}) {
  const onBar = tone === 'bar'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [website, setWebsite] = useState('')
  // A domain-typo correction from SendGrid, e.g. user@gmial.com -> gmail.com.
  // The ONLY validation detail ever shown to a visitor: it is about their own
  // address, and it turns a dead form into a corrected signup.
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null)
  const toast = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (!isValidEmail(email)) {
      toast('Please enter a valid email address.', 'error')
      return
    }
    setLoading(true)
    setSuggestedEmail(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      if (!res.ok) {
        // Surface backend validation (e.g. 422 "You are already subscribed.").
        const data = (await res.json().catch(() => ({}))) as {
          message?: string
          errors?: { email?: string[] }
          suggested_email?: string | null
        }

        setSuggestedEmail(data.suggested_email ?? null)
        toast(data.errors?.email?.[0] ?? data.message ?? COPY.newsletter.error, 'error')
        return
      }
      // The API reports whether a verification email is actually going out
      // (`email_sent` mirrors the site's newsletter_emails_enabled switch).
      // Telling someone to watch their inbox — and dig through spam — for mail
      // this site is not sending would be a worse failure than not collecting
      // the address at all.
      const { email_sent: emailSent } = (await res.json().catch(() => ({}))) as { email_sent?: boolean }

      // Keep the form in place; confirm via a top-corner toast.
      toast(emailSent === false ? COPY.newsletter.successNoEmail : COPY.newsletter.success, 'success')
      setEmail('')
    } catch {
      toast(COPY.newsletter.error, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={compact ? `min-w-0 ${className}`.trim() : `flex flex-wrap items-center justify-between gap-4 ${className}`.trim()}>
      {/* The strip's introduction. The compact form drops it: see above. */}
      {!compact && (
        <div className="min-w-0 flex-[1_1_360px]">
          <p className={`font-display text-[21px] leading-tight ${onBar ? 'text-paper' : 'text-ink'}`}>{COPY.newsletter.title}</p>
          {/* 14px on a phone, 13px from `sm` up. Below `lg` this strip is the
            ONLY subscribe path on the site (the header pill drops its form),
            so the line that explains what you get has to clear the project's
            14px phone readability floor — which the globals.css rule only
            raises for `.text-xs`, not for a literal size. */}
        <p className={`mt-1 text-sm sm:text-[13.5px] ${onBar ? 'text-cream-muted' : 'text-ink-soft'}`}>{COPY.newsletter.subtitle}</p>
        </div>
      )}

      <div className={compact ? 'w-full min-w-0' : 'w-full min-w-0 flex-[0_1_420px]'}>
        {/* Field and button share one row at every width, as in the mockup;
            `min-w-0` lets the field give way so the button never wraps. */}
        <form
          onSubmit={onSubmit}
          // TWO SHAPES, 10px apart, each carrying its own edge and its own
          // 12px radius — the mockup's `.sub-form{display:flex;gap:10px}`.
          // The form itself draws nothing: there is no enclosing box and no
          // focus ring here, because each control has a visible edge of its
          // own and shows its own focus.
          //
          // A ROW AT EVERY WIDTH, in both tones, which is where this departs
          // from the mockup — its own `@media(max-width:640px)` stacks the
          // pair. The strip sits at the top of every page on this site, and
          // stacked it costs ~106px of a 375px screen instead of ~48px, on
          // every page, for a signup nobody arrived for. It does not need the
          // height: the field gives way (`min-w-0` plus `flex-1`) and the key
          // tightens its padding, leaving a ~230px field at 375px, which is
          // wider than most addresses people type.
          className="relative flex flex-row gap-2.5"
          aria-label={`${COPY.newsletter.title} ${COPY.newsletter.subtitle}`}
        >

          {/* HONEYPOT. Never shown, never focusable, never autofilled — a human
              cannot reach it, a naive bot fills every field it finds. The server
              rejects any request that carries a value, before the site is
              touched and long before a paid validation credit could be spent.
              Positioned off-screen rather than display:none, which some bots
              skip. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            // Hidden by an INLINE STYLE, deliberately not by a Tailwind class.
            // The class was a real bug: utility CSS can load late, fail, or be
            // purged, and for as long as it is missing this renders as an
            // ordinary focusable text input sitting in the middle of the
            // subscribe form. A person who types into it gets their signup
            // rejected as a bot — an anti-bot measure silently turning away the
            // humans it exists to protect. An inline style travels inside the
            // HTML, so it cannot desync from the markup that carries it.
            //
            // Still off-screen rather than display:none or the hidden
            // attribute: a honeypot only works while a bot believes the field
            // is real, and the obvious ways of hiding it are the ways a bot
            // checks for. pointer-events:none means that even a rendering
            // accident cannot let a human click into it.
            style={{
              position: 'absolute',
              left: '-9999px',
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={COPY.newsletter.placeholder}
            aria-label={COPY.newsletter.placeholder}
            autoComplete="email"
            // 48px in BOTH tones. `compact` means "no intro", not "small":
            // the sibling sites shrink the field to 42px for a header pill,
            // and 42px is under the 44px tap target.
            // `flex-1` IS BREAKPOINT-PREFIXED, and that is load-bearing.
            // The band form is `flex-col` on a phone and only becomes a row
            // further up. `flex-1` is `flex: 1 1 0%`, and flex-basis applies
            // to the MAIN axis — so in column mode it zeroed the field's
            // HEIGHT, and the `h-12` beside it lost: the subscribe field
            // shipped 22.5px tall on a phone, half its size and half the tap
            // target. In row mode it is still needed, or `w-full` takes the
            // whole line and pushes the key out. So it applies only from the
            // width the form actually becomes a row.
            //
            // A WELL CUT INTO WHATEVER IT SITS ON, which is the mockup's own
            // idea (`background:var(--felt-2)` on a field inside a raised
            // panel) and needs two sets of colours here because this form
            // lands on two grounds — see `tone` above.
            //
            // SOLID brass on the rail, not the mockup's alpha: a field is a
            // CONTROL, whose boundary needs 3:1, and brass at 25-50% measures
            // 1.52 to 2.40 on the felt against solid brass's 5.38. On the
            // ivory card the same job goes to `line-strong` #92805B, 3.38:1,
            // because brass on white is 2.35.
            //
            // The focus outline is 2px offset 1px, drawn on each control
            // rather than on the form: the two are separate shapes here and a
            // ring around the pair would enclose the gap between them. It is
            // brass-light on the rail (8.07:1 on the felt) and the oxblood on
            // the card (7.89:1 on the ivory).
            className={
              onBar
                ? 'h-[46px] w-full min-w-0 flex-1 rounded-xl border border-accent bg-navy px-3.5 text-[15px] text-cream placeholder:text-cream-muted focus:outline-2 focus:outline-offset-1 focus:outline-accent-light'
                : 'h-[54px] w-full min-w-0 flex-1 rounded-xl border border-line-strong bg-white px-4 text-[15px] text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand'
            }
          />
          <button
            type="submit"
            disabled={loading}
            // EACH GROUND'S OWN PRIMARY: brass with ink on it on the rail
            // (7.60:1), oxblood with white on it on the ivory card (8.97:1).
            // The oxblood would be 1.41:1 on the felt and the brass 2.35 on
            // the card, so neither is a default that happens to work in both
            // places — see `tone` above.
            //
            // 46px on the rail (the mockup's own `.btn-sm`) and 52px on the
            // band (its full `.btn`), both over the 44px tap target. The
            // padding tightens below 440px so the field keeps its width
            // instead of the row breaking.
            className={
              onBar
                ? 'btn-gold btn-sm btn-flat shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60'
                : 'btn-or btn-flat shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60'
            }
          >
            {loading ? COPY.newsletter.checking : COPY.newsletter.button}
          </button>
        </form>

        {/* One click swaps the address in and resubmits. The corrected address
            is a DIFFERENT cache key upstream, so it gets its own validation
            call rather than reusing the typo's verdict. */}
        {suggestedEmail && (
          <p className={`mt-2 text-sm ${onBar ? 'text-cream-soft' : 'text-ink-soft'}`}>
            Did you mean{' '}
            <button
              type="button"
              onClick={() => { setEmail(suggestedEmail); setSuggestedEmail(null) }}
              className="font-semibold underline underline-offset-2"
            >
              {suggestedEmail}
            </button>
            ?
          </p>
        )}
      </div>
    </div>
  )
}
