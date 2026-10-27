import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import SplitText from './SplitText'
import { EMAIL, NAV_LINKS, WHATSAPP_URL } from '../data/site'
import { useI18n } from '../lib/locale'

const MOTION = {
  hidden: { y: '-110%' },
  visible: { y: '0%', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
  exit: { y: '-110%', transition: { duration: 0.6, ease: [0.83, 0, 0.17, 1] } },
}

/**
 * FullMenu — full-viewport glass overlay.
 *
 * Handles the accessibility contract for a modal: Escape closes it, focus is
 * moved in on open and restored on close, Tab is trapped inside, and the
 * page behind it stops scrolling.
 */
export default function FullMenu({ open, onClose }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const restoreRef = useRef(null)
  const { t } = useI18n()

  useEffect(() => {
    if (!open) return

    restoreRef.current = document.activeElement

    // Lock the page behind the overlay without the layout shifting.
    const { body } = document
    const prevOverflow = body.style.overflow
    const prevPad = body.style.paddingRight
    const gap = window.innerWidth - document.documentElement.clientWidth
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`

    closeRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      // Focus trap: cycle within the panel.
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPad
      // Send focus back to whatever opened the menu.
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="menu-fullscreen"
          role="dialog"
          aria-modal="true"
          aria-label={t('ui.menuDialog')}
          variants={MOTION}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-90 flex flex-col bg-ink/70 backdrop-blur-3xl"
        >
          {/* Layered accent wash so the blur has something to work against. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(90rem 40rem at 15% 0%, rgba(30,58,95,0.55), transparent 60%), radial-gradient(60rem 30rem at 90% 100%, rgba(232,180,160,0.14), transparent 60%)',
            }}
          />

          <div className="shell relative flex min-h-0 flex-1 flex-col overflow-y-auto pt-28 pb-10">
            {/* Explicit close affordance, and the first tab stop. */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute top-24 right-0 flex items-center gap-3 type-button h-11 rounded-full px-4 text-slate transition-colors duration-500 hover:text-peach"
            >
              {t('ui.closeMenu')}
              <span aria-hidden="true" className="relative block h-3 w-3">
                <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
              </span>
            </button>

            {/* Primary links, revealed word by word. */}
            <nav aria-label={t('ui.mainNav')} className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <div key={link.href} className="border-b border-white/8">
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 py-5 sm:gap-8 sm:py-7"
                  >
                    <span className="type-label text-slate">
                      0{i + 1}
                    </span>
                    <SplitText
                      as="span"
                      text={t(`nav.${link.key}`)}
                      start="mount"
                      delay={0.12 + i * 0.09}
                      className="font-display text-[clamp(2.25rem,9vw,5.5rem)] leading-[0.9] text-bone transition-colors duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:text-peach"
                    />
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      aria-hidden="true"
                      className="ml-auto h-6 w-6 shrink-0 self-center text-slate opacity-0 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2 group-hover:text-peach group-hover:opacity-100 sm:h-9 sm:w-9"
                    >
                      <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              ))}
            </nav>

            {/* Footer of the overlay: direct contact routes. */}
            <div className="mt-auto flex flex-col gap-8 pt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4">
                <span className="type-label text-slate">
                  {t('ui.directContact')}
                </span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-button inline-flex h-12 w-fit items-center rounded-full bg-peach px-6 text-ink transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-0.5"
                >
                  WhatsApp
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="type-button inline-flex h-12 w-fit items-center rounded-full border border-white/14 px-6 text-mist transition-colors duration-500 hover:text-peach"
                >
                  {t('cta.email')}
                </a>
              </div>

              <p className="max-w-xs text-sm leading-relaxed text-slate">
                {t('ui.menuTagline')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
