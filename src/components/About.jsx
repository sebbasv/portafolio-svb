import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import SplitText from './SplitText'
import { CURRENT_CITY, FACTS } from '../data/about'
import { useI18n } from '../lib/locale'

/**
 * Origin → current location. Small typographic device, no map image needed.
 */
function Journey() {
  const { t } = useI18n()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8 }}
      className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 border-y border-white/8 py-5 sm:gap-x-6"
    >
      <span className="type-title text-mist">{FACTS.originCity}</span>
      <span className="flex items-center gap-2" aria-hidden="true">
        <span className="h-px w-8 bg-white/15 sm:w-12" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-3.5 w-3.5 text-peach"
        >
          <path
            d="M4 12h15M14 6l6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="type-title text-peach">{CURRENT_CITY}</span>
      <span className="type-label w-full text-slate sm:ml-auto sm:w-auto">
        {t('about.journeyNote')(FACTS.yearsInArgentina)}
      </span>
    </motion.div>
  )
}

function Stat({ value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-white/8 pt-5"
    >
      <div className="type-display-md text-bone">
        {value}
        <span className="text-peach">.</span>
      </div>
      <div className="type-label mt-3 text-mist">{label}</div>
    </motion.div>
  )
}

/** Short summary up front; the full story one click away. */
function Bio() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const id = useId()
  const bio = t('about.bio')

  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[60ch] text-lg leading-relaxed text-mist md:text-xl"
      >
        {t('about.summary')}
      </motion.p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-6">
              {bio.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="max-w-[60ch] text-base leading-relaxed text-slate md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="type-button group mt-4 inline-flex h-11 items-center gap-2.5 rounded-full text-mist transition-colors duration-300 hover:text-peach"
      >
        {open ? t('about.readLess') : t('about.readMore')}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3.5 6 8 10.5 12.5 6" />
        </svg>
      </button>
    </div>
  )
}

/**
 * About — who is behind the work.
 *
 * Placed before the closing CTA on purpose: the story builds trust, then the
 * ask converts. Sticky heading on desktop, stacked on mobile.
 */
export default function About() {
  const { t } = useI18n()
  const [titleTop, titleBottom] = t('about.titleLines')
  const stats = t('about.stats')
  const drivers = t('about.drivers')
  const tech = t('tech')
  const education = t('about.education')

  return (
    <section
      id="sobre-mi"
      className="relative border-t border-white/8 py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(55rem 30rem at 20% 100%, rgba(30,58,95,0.42) 0%, transparent 65%)',
        }}
      />

      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Heading, sticky on desktop. */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6 }}
                className="type-label text-peach"
              >
                {t('about.eyebrow')}
              </motion.span>

              <h2 className="type-display-lg mt-3 text-bone">
                <SplitText as="span" text={titleTop} className="block" />
                <SplitText
                  as="span"
                  text={titleBottom}
                  className="block"
                  fragmentClassName="text-gradient-peach"
                />
              </h2>

              <Journey />
            </div>
          </div>

          {/* Bio + stats + drivers. */}
          <div className="lg:col-span-7">
            <Bio />

            <ul className="mt-12 grid gap-8 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <li key={stat.label}>
                  <Stat {...stat} delay={i * 0.1} />
                </li>
              ))}
            </ul>

            {/* Tech chips. Doubles as scannable credentials and as SEO
                surface for the technologies the site is actually built with. */}
            <div className="mt-14">
              <motion.h3
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="type-label text-slate"
              >
                {t('about.techLabel')}
              </motion.h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {tech.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.55,
                      delay: i * 0.045,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="type-label rounded-full bg-white/[0.04] px-3 py-1.5 text-mist ring-1 ring-white/8 transition-colors duration-500 hover:text-peach hover:ring-peach/40"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Education: university first, then the courses. */}
            <div className="mt-14">
              <motion.h3
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="type-label text-slate"
              >
                {t('about.educationLabel')}
              </motion.h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {education.map((item, i) => (
                  <motion.li
                    key={item.place}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/8"
                  >
                    <p className="type-label text-peach">{item.place}</p>
                    <p className="mt-3 text-sm font-medium leading-snug text-mist md:text-base">
                      {item.title}
                    </p>
                    <p className="type-body-sm mt-2 text-slate">{item.note}</p>
                  </motion.li>
                ))}
              </ul>
            </div>

            <ul className="mt-16 flex flex-col">
              {drivers.map((driver, i) => (
                <motion.li
                  key={driver.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.75,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group border-t border-white/8 py-7 last:border-b hover:border-peach/40"
                >
                  <div className="flex items-baseline gap-5">
                    <span className="type-label text-peach/70 transition-colors duration-500 group-hover:text-peach">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="type-title text-mist">{driver.title}</h3>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate md:text-base">
                        {driver.text}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
