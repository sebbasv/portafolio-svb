import { motion } from 'motion/react'
import { useId, useState } from 'react'
import BrowserFrame from './BrowserFrame'
import PillButton from './PillButton'
import TiltedCard from './TiltedCard'
import { PROJECTS } from '../data/projects'
import { useI18n } from '../lib/locale'

/** Section heading. */
function SectionHeading({ eyebrow, title, count }) {
  return (
    <div className="mb-16 flex flex-col gap-6 border-b border-white/8 pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="type-label text-peach"
        >
          {eyebrow}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="type-display-lg mt-3 text-bone"
        >
          {title}
        </motion.h2>
      </div>
      <span className="type-label text-slate">
        {count}
      </span>
    </div>
  )
}

function ProjectCard({ project, index }) {
  const { t } = useI18n()
  // Copy for this project in the active language.
  const copy = t(`projects.${project.id}`)
  const wide = index % 2 === 0
  const Wrapper = project.url ? 'a' : 'div'

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`group flex flex-col ${
        wide ? 'lg:col-span-7' : 'lg:col-span-5 lg:mt-28'
      }`}
    >
      <TiltedCard maxTilt={7}>
        <Wrapper
          {...(project.url
            ? {
                href: project.url,
                target: '_blank',
                rel: 'noopener noreferrer',
                'aria-label': t('ui.viewProject')(copy.name),
                // The "View live site" button below goes to the same place,
                // so the screenshot stays clickable but is skipped by the
                // keyboard instead of being a second, identical tab stop.
                tabIndex: -1,
              }
            : {})}
          className="block rounded-xl"
        >
          <BrowserFrame
            url={project.frameUrl}
            logo={project.logo}
            logoType={project.logoType}
          >
            <img
              src={project.shot}
              alt={t('ui.shot')(copy.name)}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]"
            />
          </BrowserFrame>
        </Wrapper>
      </TiltedCard>

      {/* Meta */}
      <div className="mt-7 flex flex-1 flex-col">
        <div className="flex items-center gap-4">
          <span className="type-label text-peach">
            {project.index}
          </span>
          <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
          <span className="type-label text-right text-slate">
            {copy.category}
          </span>
        </div>

        {project.practice && (
          <span className="type-label mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-mist ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-slate" aria-hidden="true" />
            {t('ui.practice')}
          </span>
        )}

        <h3 className="type-display-md mt-4 text-bone">
          {copy.name}
        </h3>

        <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate md:text-base">
          {copy.description}
        </p>

        {/* Case facts: what makes a screenshot read as a case study. */}
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
          {[
            [t('work.role'), copy.role],
            [t('work.year'), project.year],
            [t('work.stack'), project.stack],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="type-label text-slate">{term}</dt>
              <dd className="type-body-sm mt-1 font-medium text-mist">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {copy.tags.map((tag) => (
            <span
              key={tag}
              className="type-label rounded-full bg-white/[0.04] px-3 py-1.5 text-slate ring-1 ring-white/8"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-7 flex items-center">
          {project.url ? (
            <PillButton href={project.url} variant="ghost" size="sm" withArrow>
              {t('ui.liveSite')}
            </PillButton>
          ) : (
            <span className="type-button inline-flex items-center gap-2.5 text-slate">
              <span
                className="h-1.5 w-1.5 rounded-full bg-slate-dim"
                aria-hidden="true"
              />
              {t('ui.inProgress')}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/** Cards shown before "Show more"; the rest stay one click away. */
const VISIBLE = 4

/**
 * Portfolio — the case-study gallery.
 *
 * Laid out on a 12-column grid with alternating spans and a vertical offset
 * on the narrow column, so the projects read as an editorial spread rather
 * than a uniform card grid. Only the first four are shown up front so the
 * section never turns into a wall of screenshots.
 */
export default function Portfolio() {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const moreId = useId()
  const hidden = PROJECTS.length - VISIBLE

  return (
    <section id="proyectos" className="relative py-24 md:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow={t('work.eyebrow')}
          title={t('work.title')}
          count={t('work.count')(PROJECTS.length)}
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-20 lg:grid-cols-12 lg:gap-y-28">
          {PROJECTS.slice(0, VISIBLE).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
          {/* display: contents keeps the extra cards on the same grid. */}
          <div id={moreId} className="contents">
            {expanded &&
              PROJECTS.slice(VISIBLE).map((project, i) => (
                <ProjectCard key={project.id} project={project} index={VISIBLE + i} />
              ))}
          </div>
        </div>

        {hidden > 0 && (
          <div className="mt-20 flex justify-center border-t border-white/8 pt-10 lg:mt-28">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls={moreId}
              className="type-button group inline-flex h-12 items-center gap-2.5 rounded-full border border-white/14 px-7 text-mist transition-colors duration-500 hover:border-peach hover:text-peach"
            >
              {expanded ? t('work.showLess') : t('work.showMore')(hidden)}
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              >
                <path d="M3.5 6 8 10.5 12.5 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
