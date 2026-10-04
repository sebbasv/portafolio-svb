/**
 * Site copy, in every supported language.
 *
 * Spanish is the source language and the default; English is a full translation
 * written to carry the same meaning and tone rather than word-for-word
 * mirroring, which in the Spanish-to-English direction often reads badly.
 *
 * `t('hero.sub')`-style lookups live in src/lib/LocaleProvider.jsx.
 */

import { FACTS } from './about'
import { CLIENT_PROJECT_COUNT } from './projects'

export const LOCALES = ['es', 'en']
export const DEFAULT_LOCALE = 'es'

/** Short code shown on the toggle. */
export const LOCALE_LABEL = { es: 'ES', en: 'EN' }

/** Name of each language, used as the toggle buttons' accessible labels. */
export const LOCALE_NAME = { es: 'Español', en: 'English' }

export const DICT = {
  /* ============================== Spanish ============================== */
  es: {
    meta: {
      title: 'SVB — Sebastian de Jesus Valecillos Blanco | Desarrollo web a medida',
      description:
        'Diseño y desarrollo web a medida: landing pages, e-commerce, sitios institucionales y sistemas de turnos. Basado en CABA, Argentina.',
    },
    ui: {
      loading: 'Cargando',
      language: 'Idioma',
      skipToContent: 'Saltar al contenido',
      backToTop: 'SVB — volver al inicio',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      menuDialog: 'Menú de navegación',
      mainNav: 'Navegación principal',
      directContact: 'Contacto directo',
      letsTalk: 'Hablemos',
      menuTagline:
        'Desarrollo web a medida para negocios que necesitan aparecer mejor en internet y recibir clientes por WhatsApp.',
      liveSite: 'Ver sitio en vivo',
      inProgress: 'Sitio en preparación',
      practice: 'Proyecto de práctica',
      viewProject: (name) =>
        `Visitar el sitio de ${name} (se abre en una pestaña nueva)`,
      shot: (name) => `Captura de pantalla del sitio ${name}`,
      ctaWhatsapp:
        'Escribime por WhatsApp para iniciar tu proyecto (se abre en una pestaña nueva)',
    },
    nav: { services: 'Servicios', work: 'Proyectos', about: 'Sobre mí', contact: 'Contacto' },
    role: 'Desarrollador web',
    hero: {
      available: 'Disponible para proyectos nuevos',
      headline: [
        { text: 'Webs a medida', tone: 'bone' },
        { text: 'que convierten', tone: 'bone' },
        { text: 'visitantes en clientes.', tone: 'peach' },
      ],
      sub: 'Desde landing pages hasta e-commerce. Soluciones escalables que hacen crecer tu marca.',
      proof: `${CLIENT_PROJECT_COUNT} proyectos para clientes · Respuesta en menos de 24 h`,
      ctaPrimary: 'Iniciar proyecto',
      ctaSecondary: 'Ver proyectos',
    },
    portal: {
      hint: 'Deslizá para ver el trabajo',
      label: 'Portafolio',
      tagline: 'Cada proyecto, resuelto a medida.',
    },
    work: {
      eyebrow: 'Trabajo reciente',
      title: 'Portafolio',
      count: (n) => `${String(n).padStart(2, '0')} proyectos`,
      showMore: (n) => `Ver ${n} más`,
      showLess: 'Ver menos',
      role: 'Rol',
      year: 'Año',
      stack: 'Stack',
    },
    projects: {
      manaba: {
        name: 'Manaba Café',
        category: 'Web Institucional / Gastronomía',
        description:
          'Interfaz cálida y minimalista enfocada en transmitir la identidad del local y facilitar reservas de mesas.',
        tags: ['Identidad', 'Reservas', 'Menú'],
        role: 'Diseño y desarrollo',
      },
      sebtech: {
        name: 'SebTech',
        category: 'E-Commerce / Tecnología',
        description:
          'Catálogo digital rápido e intuitivo, diseñado para optimizar el recorrido del usuario y maximizar ventas.',
        tags: ['Catálogo', 'Carrito', 'Filtros'],
        role: 'Diseño y desarrollo',
      },
      barbudos: {
        name: "Barbudo's Barbershop",
        category: 'Web Corporativa / Sistema de Turnos',
        description:
          'Diseño audaz y de alto impacto visual, estructurado para captar clientes y agilizar reservas vía WhatsApp.',
        tags: ['Turnos', 'WhatsApp', 'Galería'],
        role: 'Diseño y desarrollo',
      },
      oswaldo: {
        name: 'Oswaldo Traslados',
        category: 'Landing Page / Reservas por WhatsApp',
        description:
          'Landing nocturna con un viaje animado de CABA a Ezeiza, pensada para que el pasajero reserve su traslado en dos toques.',
        tags: ['Reservas', 'WhatsApp', 'Animación'],
        role: 'Diseño y desarrollo',
      },
      capricciosa: {
        name: 'Capricciosa Postres',
        category: 'Landing Page / Delivery Local',
        description:
          'Experiencia visual vibrante y tentadora, centrada en facilitar pedidos rápidos y destacar los productos.',
        tags: ['Delivery', 'Pedidos', 'Carrito'],
        role: 'Diseño y desarrollo',
      },
    },
    services: {
      eyebrow: 'Qué hago',
      titleLines: ['Del primer', 'clic a la venta'],
      lead:
        'Construyo sitios pensados para una sola cosa: que alguien que llega desde un anuncio termine hablando con vos por WhatsApp.',
      from: 'Desde',
      items: [
        {
          title: 'Landing pages',
          price: '$250.000',
          whatsapp: 'Hola Sebastián, quiero una landing page',
          text: 'Páginas de una sola pantalla, cargadas rápido y diseñadas para que el visitante pase a la acción.',
        },
        {
          title: 'Sistemas de turnos',
          price: '$350.000',
          whatsapp: 'Hola Sebastián, quiero una landing con turnos o pedidos por WhatsApp',
          text: 'Una landing con turnos o pedidos que llegan directo a tu WhatsApp, para no perder clientes por llamadas sin atender.',
        },
        {
          title: 'Sitios institucionales',
          price: '$450.000',
          whatsapp: 'Hola Sebastián, quiero un sitio institucional',
          text: 'Hasta 5–7 páginas para negocios de servicios: identidad clara, información ordenada y contacto directo.',
        },
        {
          title: 'E-commerce',
          price: '$650.000',
          whatsapp: 'Hola Sebastián, quiero una tienda online',
          text: 'Catálogo con filtros y carrito que arma el pedido y lo manda por WhatsApp, sin que nadie se pierda en el camino.',
        },
      ],
      currencyNote: 'Precios en pesos argentinos, para clientes en Argentina.',
      extrasTitle: 'Extras',
      extras: [
        { label: 'Página adicional', price: '$60.000' },
        { label: 'Versión bilingüe ES/EN', price: '+25%' },
        { label: 'Mantenimiento mensual', price: '$20.000/mes' },
        { label: 'Hora de trabajo fuera de alcance', price: '$15.000' },
      ],
      maintenanceTitle: 'Mantenimiento',
      maintenance:
        'Después del lanzamiento me puedo encargar yo de tu sitio: cambios chicos, actualizar precios o fotos y soporte cuando algo falla, sin que tengas que tocar nada.',
      maintenancePrice: 'Desde $20.000 por mes',
      termsTitle: 'Condiciones',
      terms: [
        {
          title: 'Precio de lanzamiento',
          text: '15–20% de descuento para los próximos 3 clientes, a cambio de un testimonio.',
        },
        { title: 'Forma de pago', text: '50% de anticipo para empezar y 50% al entregar.' },
        {
          title: 'Dominio y hosting',
          text: 'Se pagan aparte y corren por cuenta del cliente (por ejemplo, tu dominio .com.ar).',
        },
      ],
      quote: 'Pedir presupuesto',
      quoteWhatsapp: 'Hola Sebastián, quiero un presupuesto para mi sitio web',
    },
    process: {
      eyebrow: 'Cómo trabajo',
      titleLines: ['Del brief', 'al lanzamiento'],
      lead: 'Cuatro pasos, sin vueltas. Sabés en qué etapa está tu proyecto en todo momento.',
      steps: [
        { title: 'Brief', text: 'Charlamos por WhatsApp o videollamada: qué vendés, a quién y qué tiene que lograr el sitio.' },
        { title: 'Diseño', text: 'Te muestro la propuesta visual de las pantallas clave y la ajustamos antes de escribir código.' },
        { title: 'Desarrollo', text: 'Construyo el sitio rápido y responsive, y te comparto un link para que lo revises en tu celular.' },
        { title: 'Lanzamiento', text: 'Lo publicamos con tu dominio, conectado a WhatsApp. Te explico cómo actualizarlo, o me encargo yo con el mantenimiento mensual.' },
      ],
    },
    about: {
      eyebrow: 'Sobre mí',
      titleLines: ['Detrás de', 'cada proyecto'],
      techLabel: 'Con qué trabajo',
      educationLabel: 'Formación',
      education: [
        { title: 'Ingeniería en Sistemas de Información', place: 'UTN', note: 'En curso' },
        { title: 'Inteligencia artificial', place: 'Big School', note: '2 cursos' },
        { title: 'Desarrollo web', place: 'Coder House', note: 'Completado' },
      ],
      journeyNote: (years) => `Venezuela · ${years} años en Argentina`,
      summary:
        'Soy Sebastián, desarrollador web venezolano radicado en CABA. Estudio Ingeniería en Sistemas de Información en la UTN y construyo sitios que resuelven problemas concretos de cada negocio.',
      readMore: 'Leer más',
      readLess: 'Leer menos',
      bio: [
        `Me llamo Sebastián de Jesús Valecillos Blanco, tengo ${FACTS.age} años y vengo de Venezuela. Llegué a Argentina con ${FACTS.movedAtAge} años, así que crecí entre dos países y eso me dejó con la costumbre de adaptarme rápido y de no dar por sentado nada.`,
        'Estudio Ingeniería en Sistemas de Información en la UTN. Antes me formé en programación web en Coder House y completé dos cursos de inteligencia artificial en Big School. El desarrollo se volvió mi forma de pensar las cosas: me apasiona ese momento en que una idea que tenías en la cabeza de repente existe en pantalla y alguien la puede usar.',
        'Me dedico al 100% a esto porque creo que la tecnología bien usada resuelve problemas concretos: le ahorra tiempo a alguien, le muestra algo que no sabía, o le abre una salida donde no la había. Quiero seguir creciendo en esto y ayudar a las personas a resolver las necesidades que tienen.',
      ],
      stats: [
        { value: String(CLIENT_PROJECT_COUNT), label: 'Proyectos para clientes' },
        { value: '<24 h', label: 'De respuesta' },
        { value: 'React', label: '+ Tailwind CSS' },
      ],
      drivers: [
        {
          title: 'Que sea usable de verdad',
          text: 'Me guía que alguien que no sabe de tecnología pueda usarlo sin instrucciones. Si hay que explicar cómo funciona, todavía no está terminado.',
        },
        {
          title: 'Aprender de lo que construyo',
          text: 'Cada proyecto es una obligación de aprender algo nuevo. Me deja llevar por la curiosidad técnica más que por una fórmula.',
        },
        {
          title: 'Impacto antes que estética',
          text: 'Que se vea bien es importante, pero no sirve de nada si no acerca a la persona a lo que buscaba. Primero que funcione, después que se vea.',
        },
      ],
    },
    tech: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'React',
      'Tailwind CSS',
      'Diseño responsive',
      'Git',
      'GitHub',
    ],
    cta: {
      eyebrow: 'Siguiente paso',
      title: '¿Listo para destacar tu negocio en internet?',
      body: 'Contame qué tenés en mente y te paso una idea de cómo se vería tu proyecto.',
      response: 'Respuesta en menos de 24 horas',
      instagram: 'Instagram',
      email: 'Email',
      testimonialLabel: 'Lo que dicen',
      socialNav: 'Redes y contacto',
    },
  },

  /* ============================== English ============================== */
  en: {
    meta: {
      title: 'SVB — Sebastian de Jesus Valecillos Blanco | Bespoke web development',
      description:
        'Custom web design and development: landing pages, e-commerce, corporate sites and booking systems. Based in Buenos Aires, Argentina.',
    },
    ui: {
      loading: 'Loading',
      language: 'Language',
      skipToContent: 'Skip to content',
      backToTop: 'SVB — back to top',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      menuDialog: 'Navigation menu',
      mainNav: 'Main navigation',
      directContact: 'Direct contact',
      letsTalk: "Let's talk",
      menuTagline:
        'Bespoke web development for businesses that need to show up better online and win customers over WhatsApp.',
      liveSite: 'View live site',
      inProgress: 'Site in progress',
      practice: 'Practice project',
      viewProject: (name) => `Visit the ${name} site (opens in a new tab)`,
      shot: (name) => `Screenshot of the ${name} site`,
      ctaWhatsapp:
        'Message me on WhatsApp to start your project (opens in a new tab)',
    },
    nav: { services: 'Services', work: 'Work', about: 'About', contact: 'Contact' },
    role: 'Web developer',
    hero: {
      available: 'Available for new projects',
      headline: [
        { text: 'Custom websites', tone: 'bone' },
        { text: 'that turn', tone: 'bone' },
        { text: 'visitors into customers.', tone: 'peach' },
      ],
      sub: 'From landing pages to e-commerce. Scalable solutions that grow your brand.',
      proof: `${CLIENT_PROJECT_COUNT} client projects · Replies within 24 h`,
      ctaPrimary: 'Start a project',
      ctaSecondary: 'See the work',
    },
    portal: {
      hint: 'Scroll to see the work',
      label: 'Portfolio',
      tagline: 'Every project, built to measure.',
    },
    work: {
      eyebrow: 'Recent work',
      title: 'Portfolio',
      count: (n) => `${String(n).padStart(2, '0')} projects`,
      showMore: (n) => `Show ${n} more`,
      showLess: 'Show less',
      role: 'Role',
      year: 'Year',
      stack: 'Stack',
    },
    projects: {
      manaba: {
        name: 'Manaba Café',
        category: 'Institutional Site / Food & Drink',
        description:
          'A warm, minimal interface built to convey the character of the venue and make table bookings effortless.',
        tags: ['Identity', 'Bookings', 'Menu'],
        role: 'Design and development',
      },
      sebtech: {
        name: 'SebTech',
        category: 'E-commerce / Technology',
        description:
          'A fast, intuitive digital catalogue designed to streamline the user journey and maximise sales.',
        tags: ['Catalogue', 'Cart', 'Filters'],
        role: 'Design and development',
      },
      barbudos: {
        name: "Barbudo's Barbershop",
        category: 'Corporate Site / Booking System',
        description:
          'A bold, high-impact design built to win customers and speed up bookings over WhatsApp.',
        tags: ['Appointments', 'WhatsApp', 'Gallery'],
        role: 'Design and development',
      },
      oswaldo: {
        name: 'Oswaldo Traslados',
        category: 'Landing Page / WhatsApp Bookings',
        description:
          'A night-time landing page with an animated drive from Buenos Aires to Ezeiza airport, built so passengers can book a ride in two taps.',
        tags: ['Bookings', 'WhatsApp', 'Animation'],
        role: 'Design and development',
      },
      capricciosa: {
        name: 'Capricciosa Postres',
        category: 'Landing Page / Local Delivery',
        description:
          'A vibrant, appetising experience focused on quick ordering and putting the products front and centre.',
        tags: ['Delivery', 'Orders', 'Cart'],
        role: 'Design and development',
      },
    },
    services: {
      eyebrow: 'What I do',
      titleLines: ['From the first', 'click to the sale'],
      lead: 'I build sites with a single goal in mind: that someone arriving from an ad ends up talking to you over WhatsApp.',
      from: 'From',
      items: [
        {
          title: 'Landing pages',
          price: 'USD 220',
          whatsapp: 'Hi Sebastián, I would like a landing page',
          text: 'Single-screen pages that load fast and are built to move the visitor to action.',
        },
        {
          title: 'Booking systems',
          price: 'USD 300',
          whatsapp: 'Hi Sebastián, I would like a landing page with WhatsApp bookings or orders',
          text: 'A landing page whose bookings or orders land straight in your WhatsApp, so no customer is lost to a missed call.',
        },
        {
          title: 'Corporate sites',
          price: 'USD 400',
          whatsapp: 'Hi Sebastián, I would like a corporate site',
          text: 'Up to 5–7 pages for service businesses: clear identity, organised information and direct contact.',
        },
        {
          title: 'E-commerce',
          price: 'USD 550',
          whatsapp: 'Hi Sebastián, I would like an online store',
          text: 'A catalogue with filters and a cart that builds the order and sends it over WhatsApp, so nobody gets lost on the way.',
        },
      ],
      currencyNote: 'Prices in US dollars.',
      extrasTitle: 'Extras',
      extras: [
        { label: 'Additional page', price: 'USD 45' },
        { label: 'Bilingual ES/EN version', price: '+25%' },
        { label: 'Monthly maintenance', price: 'USD 20/mo' },
        { label: 'Out-of-scope work, per hour', price: 'USD 15' },
      ],
      maintenanceTitle: 'Maintenance',
      maintenance:
        'After launch I can look after your site for you: small changes, updated prices or photos, and support when something breaks, without you having to touch a thing.',
      maintenancePrice: 'From USD 20 per month',
      termsTitle: 'Terms',
      terms: [
        {
          title: 'Launch pricing',
          text: '15–20% off for my next 3 clients, in exchange for a testimonial.',
        },
        { title: 'Payment', text: '50% upfront to get started and 50% on delivery.' },
        { title: 'Domain and hosting', text: 'Billed separately and paid by the client.' },
      ],
      quote: 'Get a quote',
      quoteWhatsapp: 'Hi Sebastián, I would like a quote for my website',
    },
    process: {
      eyebrow: 'How I work',
      titleLines: ['From brief', 'to launch'],
      lead: 'Four steps, no detours. You always know which stage your project is at.',
      steps: [
        { title: 'Brief', text: 'We talk over WhatsApp or a video call: what you sell, to whom and what the site has to achieve.' },
        { title: 'Design', text: 'I show you the visual direction for the key screens and we refine it before any code is written.' },
        { title: 'Development', text: 'I build a fast, responsive site and send you a link so you can review it on your phone.' },
        { title: 'Launch', text: 'We publish it on your domain, wired to WhatsApp. I show you how to update it, or I look after it for you with monthly maintenance.' },
      ],
    },
    about: {
      eyebrow: 'About me',
      titleLines: ['Behind', 'every project'],
      techLabel: 'What I work with',
      educationLabel: 'Education',
      education: [
        { title: 'Information Systems Engineering', place: 'UTN', note: 'In progress' },
        { title: 'Artificial intelligence', place: 'Big School', note: '2 courses' },
        { title: 'Web development', place: 'Coder House', note: 'Completed' },
      ],
      journeyNote: (years) => `Venezuela · ${years} years in Argentina`,
      summary:
        'I am Sebastián, a Venezuelan web developer based in Buenos Aires. I study Information Systems Engineering at UTN and build sites that solve each business’s concrete problems.',
      readMore: 'Read more',
      readLess: 'Read less',
      bio: [
        `My name is Sebastián de Jesús Valecillos Blanco. I am ${FACTS.age} and I come from Venezuela. I moved to Argentina at ${FACTS.movedAtAge}, so I grew up between two countries, which left me used to adapting fast and taking nothing for granted.`,
        'I study Information Systems Engineering at UTN (Universidad Tecnológica Nacional). Before that I trained in web programming at Coder House and completed two artificial intelligence courses at Big School. Development has become how I think: I love that moment when an idea in your head suddenly exists on screen and someone can actually use it.',
        'I am 100% committed to this because I think technology, used well, solves concrete problems: it saves someone time, shows them something they did not know, or opens a door that was not there before. I want to keep growing in this and help people with the needs they have.',
      ],
      stats: [
        { value: String(CLIENT_PROJECT_COUNT), label: 'Client projects' },
        { value: '<24 h', label: 'Response time' },
        { value: 'React', label: '+ Tailwind CSS' },
      ],
      drivers: [
        {
          title: 'Genuinely usable',
          text: 'What guides me is that someone who knows nothing about technology can use it without instructions. If it needs explaining, it is not finished yet.',
        },
        {
          title: 'Learning from what I build',
          text: 'Every project obliges me to learn something new. Curiosity about the craft leads me further than any formula does.',
        },
        {
          title: 'Impact before aesthetics',
          text: 'Looking good matters, but it is worthless if it does not bring the person closer to what they came for. First make it work, then make it look good.',
        },
      ],
    },
    tech: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'React',
      'Tailwind CSS',
      'Responsive design',
      'Git',
      'GitHub',
    ],
    cta: {
      eyebrow: 'Next step',
      title: 'Ready to make your business stand out online?',
      body: 'Tell me what you have in mind and I will sketch out what your project could look like.',
      response: 'Reply within 24 hours',
      instagram: 'Instagram',
      email: 'Email',
      testimonialLabel: 'What clients say',
      socialNav: 'Profiles and contact',
    },
  },
}
