import { GOATCOUNTER_CODE } from '../data/site'

/**
 * Visit counter (GoatCounter, cookie-free).
 *
 * Counts one pageview per visit, tagged with the language the page ended up
 * in, and one event per click on a contact link (WhatsApp, Instagram, email,
 * GitHub, LinkedIn), tagged with the section it was clicked from. Nothing
 * runs in development, so testing locally never inflates the numbers.
 */

/** Contact channels worth counting, matched against a link's href. */
const CHANNELS = [
  ['whatsapp', (href) => href.includes('wa.me/')],
  ['instagram', (href) => href.includes('instagram.com')],
  ['email', (href) => href.startsWith('mailto:')],
  ['github', (href) => href.includes('github.com')],
  ['linkedin', (href) => href.includes('linkedin.com')],
]

function count(vars) {
  try {
    window.goatcounter?.count?.(vars)
  } catch {
    // Blocked or failed to load: analytics must never break the page.
  }
}

function onClick(event) {
  const link = event.target.closest?.('a[href]')
  if (!link) return
  const href = link.getAttribute('href')
  const channel = CHANNELS.find(([, matches]) => matches(href))?.[0]
  if (!channel) return

  // Named by the section's id (servicios, contacto, menu-fullscreen...); the
  // header has none, so it is named by its tag.
  const area = link.closest('section[id], footer[id], [role="dialog"][id], header')
  const from = area ? area.id || area.tagName.toLowerCase() : 'page'
  count({ path: `click-${channel}`, title: `${channel} desde ${from}`, event: true })
}

export function initAnalytics() {
  if (!GOATCOUNTER_CODE || !import.meta.env.PROD) return

  // The visit is counted by hand rather than on script load: GoatCounter would
  // otherwise read the canonical URL, which drops the ?lang= the visitor saw.
  window.goatcounter = { no_onload: true }

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://gc.zgo.at/count.js'
  script.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`
  script.onload = () => {
    // By now LocaleProvider has set <html lang> to the resolved language.
    count({ path: `/?lang=${document.documentElement.lang || 'es'}` })
  }
  document.head.appendChild(script)

  document.addEventListener('click', onClick, { capture: true })
}
