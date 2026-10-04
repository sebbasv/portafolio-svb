/**
 * Site-wide constants: contact channels and navigation.
 * Single WhatsApp number reused across every call to action.
 */
export const WHATSAPP_URL = 'https://wa.me/541138991228'
export const INSTAGRAM_URL = 'https://www.instagram.com/sebbasv/'
export const GITHUB_URL = 'https://github.com/sebbasv'
/** Fill in to show LinkedIn next to the other profiles; null hides it. */
export const LINKEDIN_URL = null
export const EMAIL = 'sebastianvalecillosblanco@gmail.com'

/** WhatsApp link with the message already typed in. */
export const whatsappWith = (text) => `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`

/** Full name used for SEO / structured data. */
export const OWNER = {
  name: 'Sebastian de Jesus Valecillos Blanco',
  initials: 'SVB',
  role: 'Desarrollador web',
  location: 'CABA, Argentina',
}

/**
 * Anchor targets for the header, the full-screen menu and in-page links, in
 * the order the sections appear on the page. `key` resolves to a label in
 * src/data/i18n.js under `nav`, so the menu is translated rather than
 * hardcoded.
 */
export const NAV_LINKS = [
  { key: 'work', href: '#proyectos' },
  { key: 'services', href: '#servicios' },
  { key: 'about', href: '#sobre-mi' },
  { key: 'contact', href: '#contacto' },
]
