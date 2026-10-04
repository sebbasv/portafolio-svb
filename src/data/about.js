/**
 * Objective facts about the site owner.
 *
 * Only non-translatable data lives here. Every sentence of visible copy is in
 * src/data/i18n.js so it can be translated.
 *
 * Age and years in Argentina are worked out from the real dates on each visit,
 * so the copy never goes stale on a birthday or an anniversary.
 */

/** Months are 1-based, as written on a calendar. */
const BIRTH = { year: 2008, month: 3, day: 5 }
/** Only the month is known, so the anniversary counts from its first day. */
const ARRIVAL = { year: 2018, month: 10, day: 1 }

/** Whole years from `from` to `to` (a Date), counting a full year only once
    the month and day have been reached. */
function yearsBetween(from, to) {
  const years = to.getFullYear() - from.year
  const month = to.getMonth() + 1
  const reached =
    month > from.month || (month === from.month && to.getDate() >= from.day)
  return reached ? years : years - 1
}

const today = new Date()

export const FACTS = {
  age: yearsBetween(BIRTH, today),
  coderHouse: true,
  originCountry: 'Venezuela',
  originCity: 'Trujillo',
  yearsInArgentina: yearsBetween(ARRIVAL, today),
  movedAtAge: yearsBetween(BIRTH, new Date(ARRIVAL.year, ARRIVAL.month - 1, ARRIVAL.day)),
}

/** Current base. "CABA" is the local name for Buenos Aires city. */
export const CURRENT_CITY = 'CABA'

/**
 * Testimonials shown above the closing call to action. `placeholder: true`
 * renders an entry only in development, so a draft never reaches the live
 * site; a real quote has no flag.
 */
export const TESTIMONIALS = [
  {
    quote: {
      es: 'Me encantó el servicio, pudo plasmar la esencia de mi negocio en una página web, haciéndola sobre todo útil.',
      en: 'I loved the service. He captured the essence of my business in a website and, above all, made it useful.',
    },
    name: 'Oriana Uzcategui',
    role: { es: 'Capricciosa', en: 'Capricciosa' },
  },
  {
    quote: {
      es: 'Me resultó muy útil la decisión de tener una página web, potenció mi trabajo de una gran manera.',
      en: 'Deciding to have a website turned out to be really useful. It boosted my work in a big way.',
    },
    name: 'Oswaldo',
    role: { es: 'Oval', en: 'Oval' },
  },
]
