import { motion, useReducedMotion } from 'motion/react'
import BrandMark from './BrandMark'
import SplitText from './SplitText'
import { TESTIMONIALS } from '../data/about'
import {
  EMAIL,
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  OWNER,
  WHATSAPP_URL,
} from '../data/site'
import { useI18n } from '../lib/locale'

/**
 * GiantCta — the closing action.
 *
 * Micro-interactions, all CSS-driven so they cost nothing per frame:
 * a light sweeps across the face, a ring breathes behind it, and the whole
 * button lifts on hover.
 */
function GiantCta() {
  const reduce = useReducedMotion()
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-center"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('ui.ctaWhatsapp')}
        className="group relative isolate inline-flex items-center gap-4 overflow-hidden rounded-full bg-peach px-10 py-6 text-ink shadow-[0_24px_80px_-20px_rgba(232,180,160,0.6)] transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[0_34px_110px_-18px_rgba(232,180,160,0.8)] active:translate-y-0 sm:px-14 sm:py-7"
      >
        {/* Breathing halo behind the pill. */}
        {!reduce && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full ring-1 ring-peach/60"
            style={{ animation: 'cta-halo 3.2s ease-in-out infinite' }}
          />
        )}

        {/* Light sweep across the face on hover. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 translate-x-[-120%] skew-x-12 bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-1000 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-[120%]"
        />

        <span className="font-mono text-sm font-medium tracking-[0.08em] uppercase sm:text-base">
          {t('hero.ctaPrimary')}
        </span>

        {/* WhatsApp glyph */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-6 w-6 shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-110 sm:h-7 sm:w-7"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.94 1.36-.5.05-.98.23-3.3-.69-2.78-1.1-4.55-3.94-4.69-4.13-.14-.19-1.13-1.5-1.13-2.86 0-1.36.72-2.03.97-2.31.25-.28.55-.35.73-.35l.53.01c.17 0 .4-.06.62.48.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.1.19-.15.31-.29.47l-.44.51c-.14.14-.29.3-.13.59.17.28.74 1.22 1.59 1.98 1.09.97 2.01 1.28 2.3 1.42.28.14.45.12.61-.07.17-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.33.07.11.07.66-.17 1.35Z" />
        </svg>
      </a>
    </motion.div>
  )
}

/**
 * Testimonials — social proof right before the ask. Placeholder entries
 * (`placeholder: true` in src/data/about.js) only show in development.
 */
function Testimonials() {
  const { locale, t } = useI18n()
  const quotes = TESTIMONIALS.filter((q) => !q.placeholder || import.meta.env.DEV)
  if (quotes.length === 0) return null

  return (
    <div className="mx-auto mb-20 max-w-5xl border-b border-white/8 pb-16 text-center md:mb-24">
      <span className="type-label text-slate">{t('cta.testimonialLabel')}</span>
      <div className={`mt-8 grid gap-12 ${quotes.length > 1 ? 'md:grid-cols-2 md:gap-10' : ''}`}>
        {quotes.map((q, i) => (
          <motion.figure
            key={q.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex max-w-2xl flex-col justify-between"
          >
            <blockquote className="text-xl leading-relaxed text-mist md:text-2xl">
              <p>“{q.quote[locale]}”</p>
            </blockquote>
            <figcaption className="mt-6">
              <span className="type-title block text-mist">{q.name}</span>
              <span className="type-label mt-1 block text-slate">{q.role[locale]}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  )
}

/**
 * FooterCTA — the close. No bio, no form: one question and one action.
 * A slim strip below carries the only remaining metadata.
 */
export default function FooterCTA() {
  const { t } = useI18n()
  return (
    <footer
      id="contacto"
      className="relative overflow-hidden border-t border-white/8 pt-24 pb-10 md:pt-28"
    >
      {/* Aurora-lit backdrop for the finale. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70rem 36rem at 50% 120%, rgba(30,58,95,0.75) 0%, transparent 62%), radial-gradient(40rem 22rem at 50% 0%, rgba(232,180,160,0.10) 0%, transparent 60%)',
        }}
      />

      <div className="shell">
        <Testimonials />
      </div>

      <div className="shell flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="type-label text-peach"
        >
          {t('cta.eyebrow')}
        </motion.span>

        <h2 className="type-display-lg mt-3 max-w-[18ch] text-bone">
          <SplitText as="span" text={t('cta.title')} by="word" className="block" />
        </h2>

        {/* Brand mark bridges the headline and the ask, so the block reads as
            one composition instead of two stacked text groups. Kept close to
            the headline so the stack reads as tight, not padded. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="mt-4 flex items-center gap-4 sm:mt-5"
        >
          <span aria-hidden="true" className="h-px w-10 bg-linear-to-r from-transparent to-white/20 sm:w-16" />
          <BrandMark className="h-11 w-11 sm:h-14 sm:w-14" duration={0.95} />
          <span aria-hidden="true" className="h-px w-10 bg-linear-to-l from-transparent to-white/20 sm:w-16" />
        </motion.div>

        <p className="mt-6 max-w-md text-base leading-relaxed text-slate md:text-lg">
          {t('cta.body')}
        </p>

        <div className="mt-9">
          <GiantCta />
        </div>

        <p className="type-body-sm mt-4 text-slate">
          {t('cta.response')}
        </p>
      </div>

      {/* Slim meta strip */}
      <div className="shell mt-14 border-t border-white/8 pt-7 md:mt-18">
        <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          {/* Email first and in plain case: easy to read and to copy. */}
          <a
            href={`mailto:${EMAIL}`}
            className="inline-block rounded-sm py-2.5 text-base text-mist underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-peach hover:decoration-peach"
          >
            {EMAIL}
          </a>

          <nav aria-label={t('cta.socialNav')}>
            <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              {[
                ['Instagram', INSTAGRAM_URL],
                ['GitHub', GITHUB_URL],
                ['LinkedIn', LINKEDIN_URL],
              ]
                .filter(([, href]) => href)
                .map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="type-button inline-flex h-11 items-center rounded-full px-3 text-slate transition-colors duration-300 hover:text-peach"
                    >
                      {label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>

          <p className="type-label text-slate">
            © {new Date().getFullYear()} {OWNER.name} · {OWNER.location}
          </p>
        </div>
      </div>
    </footer>
  )
}
