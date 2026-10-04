import barbudosShot from '../assets/projects/barbudos.webp'
import capricciosaShot from '../assets/projects/Capricciosa.webp'
import manabaShot from '../assets/projects/ManabaCafe.webp'
import oswaldoShot from '../assets/projects/oswaldo.webp'
import sebtechShot from '../assets/projects/Sebtech.webp'
import barbudosLogo from '../assets/projects/logo-barbudos.svg'
import capricciosaLogo from '../assets/projects/logo-capricciosa.webp'
import manabaLogo from '../assets/projects/logo-manaba.svg'
import oswaldoLogo from '../assets/projects/logo-oswaldo.svg'
import sebtechLogo from '../assets/projects/logo-sebtech.webp'

/**
 * Portfolio case studies — technical data only.
 *
 * All visible copy (name, category, description, tags) lives in src/data/i18n.js
 * under `projects.<id>`, so it can be translated. This file stays free of text.
 *
 * `year` and `stack` feed the case row under each card (Rol · Año · Stack);
 * the role is copy, so it lives in i18n under `projects.<id>.role`.
 * Year and stack were read from each project's GitHub repository.
 *
 * `url` is only set for projects that are actually published on GitHub Pages.
 * Cards render a neutral state when it is null, so we never link to a 404.
 *
 * `practice: true` marks a self-initiated project with no real client behind
 * it; the card labels it so, and it is left out of the delivered-projects count.
 */
export const PROJECTS = [
  {
    id: 'oswaldo',
    index: '01',
    year: '2026',
    stack: 'HTML · CSS · JavaScript',
    shot: oswaldoShot,
    logo: oswaldoLogo,
    logoType: 'svg',
    url: 'https://sebbasv.github.io/Oswaldo/',
    frameUrl: 'sebbasv.github.io/Oswaldo',
  },
  {
    id: 'manaba',
    index: '02',
    year: '2026',
    stack: 'HTML · SCSS · JavaScript',
    shot: manabaShot,
    logo: manabaLogo,
    logoType: 'svg',
    practice: true,
    url: 'https://sebbasv.github.io/Manaba.github.io/',
    // Text shown in the mock browser's address bar.
    frameUrl: 'sebbasv.github.io/Manaba.github.io',
  },
  {
    id: 'sebtech',
    index: '03',
    year: '2026',
    stack: 'HTML · SCSS · JavaScript',
    shot: sebtechShot,
    logo: sebtechLogo,
    logoType: 'webp',
    url: 'https://sebbasv.github.io/sebtech.github.io/',
    frameUrl: 'sebbasv.github.io/sebtech.github.io',
  },
  {
    id: 'capricciosa',
    index: '04',
    year: '2026',
    stack: 'HTML · CSS · JavaScript',
    shot: capricciosaShot,
    logo: capricciosaLogo,
    logoType: 'webp',
    url: 'https://sebbasv.github.io/Capricciosa/',
    frameUrl: 'sebbasv.github.io/Capricciosa',
  },
  {
    id: 'barbudos',
    index: '05',
    year: '2026',
    stack: 'HTML · CSS · JavaScript',
    shot: barbudosShot,
    logo: barbudosLogo,
    logoType: 'svg',
    url: 'https://sebbasv.github.io/Barbudos/',
    frameUrl: 'sebbasv.github.io/Barbudos',
  },
]

/**
 * The four projects the 3D hero walks through, in order. Every id needs its
 * four captures in public/hero/ (see README).
 */
const HERO_IDS = ['oswaldo', 'manaba', 'sebtech', 'capricciosa']
export const HERO_PROJECTS = HERO_IDS.map((id) => PROJECTS.find((p) => p.id === id))

/** Projects built for real clients, i.e. everything but practice work. */
export const CLIENT_PROJECT_COUNT = PROJECTS.filter((p) => !p.practice).length
