import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import PillButton from './PillButton'
import SplitText from './SplitText'
import { HERO_PROJECTS as PROJECTS } from '../data/projects'
import { WHATSAPP_URL } from '../data/site'
import { useI18n } from '../lib/locale'

const ASSETS = `${import.meta.env.BASE_URL}hero/`
const EASE = [0.16, 1, 0.3, 1]

/** What the 3D scene needs to know about each project. */
const SCENE_PROJECTS = PROJECTS.map((p) => ({ id: p.id, url: p.url, host: p.frameUrl }))

/**
 * HeroStory — the first screen and the bridge into the portfolio.
 *
 * A tall section with a sticky stage. On load a laptop and a phone drop in;
 * scrolling then opens the lid, builds the first page, walks through every
 * project on both screens, flies into the laptop and lays the projects out as
 * floating windows. The 3D work lives in src/lib/heroScene.js and is loaded
 * as its own chunk; this component owns the text layers around it.
 *
 * `ready` is held false until the preloader has finished, so the headline and
 * the drop play into a settled page.
 */
export default function HeroStory({ ready = true }) {
  const { t } = useI18n()
  const pinRef = useRef(null)
  const stageRef = useRef(null)
  const glRef = useRef(null)
  const slotRef = useRef(null)
  const taglineRef = useRef(null)
  const hintRef = useRef(null)
  const copyRef = useRef(null)
  const caseRef = useRef(null)
  const engineRef = useRef(null)
  const readyRef = useRef(ready)
  const [phase, setPhase] = useState('copy')
  const [caseIndex, setCaseIndex] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let engine = null
    let cancelled = false
    import('../lib/heroScene')
      .then(({ createHeroScene }) => {
        if (cancelled) return
        try {
          engine = createHeroScene({
            container: glRef.current,
            stage: stageRef.current,
            pin: pinRef.current,
            slot: slotRef.current,
            projects: SCENE_PROJECTS,
            assetBase: ASSETS,
            copyEl: copyRef.current,
            caseEl: caseRef.current,
            taglineEl: taglineRef.current,
            hintEl: hintRef.current,
            onPhase: setPhase,
            onCase: setCaseIndex,
          })
        } catch {
          // No WebGL 2: keep the copy and show a still of the first project.
          setFailed(true)
          return
        }
        engineRef.current = engine
        if (readyRef.current) engine.start()
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
      engine?.dispose()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    readyRef.current = ready
    if (ready) engineRef.current?.start()
  }, [ready])

  const headline = t('hero.headline')
  const project = PROJECTS[caseIndex]
  const copy = t(`projects.${project.id}`)
  const layer = (on) =>
    `col-start-1 row-start-1 min-w-0 transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-out-expo)] ${
      on ? 'opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
    }`

  return (
    <section
      id="top"
      ref={pinRef}
      className={failed ? 'relative' : 'relative h-[520vh] lg:h-[560vh]'}
    >
      <div ref={stageRef} className="sticky top-0 isolate h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20"
          style={{
            background:
              'radial-gradient(70rem 40rem at 20% -10%, #1E3A5F 0%, transparent 62%), radial-gradient(50rem 30rem at 85% 110%, rgba(232,180,160,0.10) 0%, transparent 60%)',
          }}
        />
        {/* Hairline grid, barely there. Adds structure without noise. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: 'clamp(80px, 12vw, 160px) 100%',
            maskImage: 'linear-gradient(to bottom, black, transparent 78%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 78%)',
          }}
        />

        {/* WebGL stage: the scene appends its own canvas here. */}
        <div ref={glRef} className="absolute inset-0" />

        <div className="shell relative grid h-full grid-cols-1 content-start pt-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:content-center lg:items-center lg:gap-8 lg:pt-24 lg:pb-20">
          <div className="grid min-w-0">
            {/* Layer 1: the promise */}
            <div
              ref={copyRef}
              className={`${layer(phase === 'copy')} flex flex-col gap-4 self-start lg:gap-6 lg:self-center`}
              inert={phase !== 'copy'}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                className="flex w-fit items-center gap-3 rounded-full bg-white/[0.04] py-2 pr-5 pl-3 ring-1 ring-white/10 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-peach opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-peach" />
                </span>
                <span className="type-label text-mist">
                  {t('hero.available')}
                </span>
              </motion.div>

              <h1 className="type-display-xl">
                {headline.map((line) => (
                  <span key={line.text} className="split-line">
                    <SplitText
                      as="span"
                      text={line.text}
                      by="word"
                      start="mount"
                      delay={0.3}
                      stagger={0.05}
                      className={line.tone === 'peach' ? undefined : 'text-bone'}
                      fragmentClassName={line.tone === 'peach' ? 'text-gradient-peach' : ''}
                      active={ready}
                    />
                  </span>
                ))}
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
                className="flex flex-col gap-4 lg:gap-6"
              >
                <p className="max-w-md text-[0.9rem] leading-relaxed text-slate lg:text-lg">
                  {t('hero.sub')}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Compact on phones, where the devices sit right under the copy. */}
                  <PillButton href={WHATSAPP_URL} variant="primary" size="md" withArrow>
                    {t('hero.ctaPrimary')}
                  </PillButton>
                  {/* On phones the scroll itself is the way to the work. */}
                  <PillButton
                    href="#proyectos"
                    variant="outline"
                    size="md"
                    withArrow
                    className="max-sm:hidden"
                  >
                    {t('hero.ctaSecondary')}
                  </PillButton>
                </div>
                <p className="type-body-sm -mt-1 text-slate lg:-mt-3">{t('hero.proof')}</p>
              </motion.div>
            </div>

            {/* Layer 2: the project on the screens right now */}
            <div
              ref={caseRef}
              className={`${layer(phase === 'case')} flex max-w-xl flex-col gap-4 self-start lg:gap-5 lg:self-center`}
              inert={phase !== 'case'}
              aria-live="polite"
            >
              <div className="type-label flex items-center gap-4 text-slate">
                <span className="text-peach">{String(caseIndex + 1).padStart(2, '0')}</span>
                <span className="h-px w-16 bg-white/10" aria-hidden="true" />
                {String(PROJECTS.length).padStart(2, '0')}
              </div>
              <motion.div
                key={caseIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="flex flex-col gap-4"
              >
                <h2 className="type-display-lg text-bone">
                  {copy.name}
                </h2>
                <p className="type-label text-peach">
                  {copy.category}
                  {project.practice && <span className="text-slate"> · {t('ui.practice')}</span>}
                </p>
                <p className="hidden max-w-md leading-relaxed text-slate lg:block">
                  {copy.description}
                </p>
                <div>
                  <PillButton
                    href={project.url}
                    variant="ghost"
                    size="sm"
                    withArrow
                    aria-label={t('ui.viewProject')(copy.name)}
                  >
                    {t('ui.liveSite')}
                  </PillButton>
                </div>
              </motion.div>
              <ol className="flex gap-1.5" aria-hidden="true">
                {PROJECTS.map((p, i) => (
                  <li
                    key={p.id}
                    className={`h-0.5 w-6 transition-colors duration-500 ${i === caseIndex ? 'bg-peach' : 'bg-white/15'}`}
                  />
                ))}
              </ol>
            </div>
          </div>

          {failed && (
            <img
              src={`${ASSETS}manaba-desk.webp`}
              alt=""
              className="mt-10 aspect-[16/10] w-full rounded-xl object-cover object-top ring-1 ring-white/10 lg:hidden"
            />
          )}

          {/* The devices are framed into this column on desktop. */}
          <div ref={slotRef} className="hidden h-full lg:block" aria-hidden="true">
            {failed && (
              <div className="flex h-full items-center">
                <img
                  src={`${ASSETS}manaba-desk.webp`}
                  alt=""
                  className="aspect-[16/10] w-full rounded-xl object-cover object-top shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
                />
              </div>
            )}
          </div>
        </div>

        <p
          ref={taglineRef}
          className="pointer-events-none absolute bottom-[12%] left-1/2 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 text-center text-[clamp(1rem,2vw,1.4rem)] font-medium text-peach-bright opacity-0"
        >
          {t('portal.tagline')}
        </p>
        <div
          ref={hintRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 transition-opacity duration-700 lg:bottom-6 lg:gap-3"
        >
          <span className="type-label whitespace-nowrap text-slate">
            {t('portal.hint')}
          </span>
          <span className="relative h-6 w-px overflow-hidden bg-white/15 lg:h-10">
            <motion.span
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-x-0 h-1/2 bg-peach"
            />
          </span>
        </div>
      </div>
    </section>
  )
}
