import * as THREE from 'three'

/* Scroll choreography, as fractions of the pinned run.
     lid      the lid swings open
     power    both panels wake
     build    the page assembles itself, block by block
     reveal   the wireframe gives way to the real Manaba site
     projects four projects, each scrolled then swiped to the next
     dive     the camera flies into the laptop screen
     windows  inside: the projects float as windows, then line up */
const T = {
  lid: [0.0, 0.07],
  power: [0.05, 0.085],
  build: [0.075, 0.145],
  reveal: [0.14, 0.17],
  projects: [0.17, 0.62],
  dive: [0.62, 0.76],
  windows: [0.76, 1.0],
}

/* =====================================================================
   Helpers
   ===================================================================== */
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const seg = (p, a, b) => clamp01((p - a) / (b - a))
const lerp = (a, b, t) => a + (b - a) * t
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)

// Matches Tailwind's lg breakpoint, where the hero switches to two columns.
const small = () => innerWidth < 1024

function canvas(w, h) {
  const c = document.createElement('canvas')
  c.width = Math.round(w)
  c.height = Math.round(h)
  return c
}
function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}
function fit(img, maxW) {
  if (!img || img.width <= maxW) return img
  const c = canvas(maxW, img.height * (maxW / img.width))
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
  return c
}
function rrShape(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2,
    y = -h / 2
  r = Math.min(r, w / 2, h / 2)
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}
/* A rounded slab lying flat: w along x, d along z, h tall (y 0..h), with a
   real bevel on every edge so the rim catches light like machined metal. */
function slab(w, d, h, r, bevel) {
  const geo = new THREE.ExtrudeGeometry(
    rrShape(w - 2 * bevel, d - 2 * bevel, Math.max(0.002, r - bevel)),
    {
      depth: Math.max(0.0002, h - 2 * bevel),
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 4,
      curveSegments: 24,
    },
  )
  geo.rotateX(-Math.PI / 2)
  geo.translate(0, bevel, 0)
  return geo
}
/* Same, standing up: w along x, h along y, depth along z (z -d/2..d/2). */
function standingSlab(w, h, d, r, bevel) {
  const geo = new THREE.ExtrudeGeometry(
    rrShape(w - 2 * bevel, h - 2 * bevel, Math.max(0.002, r - bevel)),
    {
      depth: Math.max(0.0002, d - 2 * bevel),
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 5,
      curveSegments: 28,
    },
  )
  geo.translate(0, 0, -(d - 2 * bevel) / 2)
  return geo
}
function flat(w, h, r, segs = 16) {
  // rounded rect lying flat, facing +y
  const g = new THREE.ShapeGeometry(rrShape(w, h, r), segs)
  g.rotateX(-Math.PI / 2)
  return g
}
function flatDown(w, h, r, segs = 16) {
  // rounded rect lying flat, facing -y
  const g = new THREE.ShapeGeometry(rrShape(w, h, r), segs)
  g.rotateX(Math.PI / 2)
  return g
}
function ring(w, h, r, inset, segs = 16, up = false) {
  // rounded-rect outline, facing -y (or +y)
  const s = rrShape(w, h, r)
  const hole = rrShape(w - inset * 2, h - inset * 2, Math.max(0.002, r - inset))
  s.holes.push(new THREE.Path(hole.getPoints(segs * 4).reverse()))
  const g = new THREE.ShapeGeometry(s, segs)
  g.rotateX(up ? -Math.PI / 2 : Math.PI / 2)
  return g
}
/* The SVB mark as real geometry (three rounded strokes), so it stays razor
   sharp at any distance instead of being a stretched bitmap. Lies in XY,
   facing +z, centred, `size` wide. */
function markGroup(size, mat) {
  const group = new THREE.Group()
  const k = size / 512,
    r = 22 * k
  const P = (x, y) => [(x - 256) * k, (291 - y) * k]
  const stroke = (a, b) => {
    const [x1, y1] = P(...a),
      [x2, y2] = P(...b)
    const len = Math.hypot(x2 - x1, y2 - y1)
    const geo = new THREE.ShapeGeometry(rrShape(len + 2 * r, 2 * r, r), 32)
    geo.rotateZ(Math.atan2(y2 - y1, x2 - x1))
    geo.translate((x1 + x2) / 2, (y1 + y2) / 2, 0)
    group.add(new THREE.Mesh(geo, mat))
  }
  stroke([140, 168], [256, 350])
  stroke([372, 168], [256, 350])
  stroke([184, 414], [328, 414])
  return group
}
function canvasTex(c, { srgb = true, repeat } = {}) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat, repeat)
  }
  t.anisotropy = maxAniso // keeps fine detail sharp at grazing angles
  return t
}
function imageTex(img) {
  const t = new THREE.Texture(img)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = maxAniso
  t.needsUpdate = true
  return t
}
// Set by the renderer once it exists; used by every texture for sharp
// filtering at grazing angles.
let maxAniso = 1
const BLANK = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1)
BLANK.needsUpdate = true
const WHITE = new THREE.DataTexture(new Uint8Array([246, 243, 238, 255]), 1, 1)
WHITE.needsUpdate = true

/**
 * Builds the hero's 3D story in `container` and drives it from the scroll
 * position of `pin` (a tall section whose sticky child is `stage`).
 *
 * Throws when WebGL 2 is unavailable, so the caller can show a still instead.
 * Returns { start, dispose }: `start` lets the devices drop in (call it once
 * the page is ready to be looked at), `dispose` frees the GPU context.
 */
export function createHeroScene({
  container,
  stage,
  pin,
  slot,
  projects: PROJECTS,
  assetBase,
  copyEl,
  caseEl,
  taglineEl,
  hintEl,
  onPhase,
  onCase,
}) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  // Dev-only test hooks: ?snap skips easing, ?drop=0.6 freezes the drop clock.
  const QS = import.meta.env.DEV ? new URLSearchParams(location.search) : new URLSearchParams()
  const SNAP = QS.has('snap')
  const FREEZE = QS.has('drop') ? Number(QS.get('drop')) : null
  // Phones get lighter textures: half the GPU memory, no visible loss at that size.
  const TEX_W = Math.min(innerWidth, innerHeight) < 700 ? 1024 : 1440
  let disposed = false

  /* =====================================================================
   Renderer
   ===================================================================== */
  // The scene owns its canvas: a disposed WebGL context can't be reused, and
  // React may mount this twice in development.
  const glCanvas = document.createElement('canvas')
  glCanvas.setAttribute('aria-hidden', 'true')
  glCanvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none'
  container.appendChild(glCanvas)
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: glCanvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
  } catch (err) {
    glCanvas.remove()
    throw err
  }
  if (!renderer.capabilities.isWebGL2) {
    renderer.dispose()
    glCanvas.remove()
    throw new Error('WebGL2 required')
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.autoClear = false
  renderer.setClearColor(0x000000, 0)
  maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy())

  /* A dark product studio for reflections: an overhead softbox, a cool strip on
   the left, a warm (brand peach) strip behind the right shoulder and a faint
   kicker in front. Metal and glass pick these up as clean highlight bands. */
  function studioEnvironment() {
    const env = new THREE.Scene()
    env.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(40, 20, 40),
        new THREE.MeshBasicMaterial({ color: 0x07090d, side: THREE.BackSide }),
      ),
    )
    const light = (w, h, hex, k, pos) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(hex).multiplyScalar(k),
          side: THREE.DoubleSide,
        }),
      )
      m.position.set(...pos)
      m.lookAt(0, 0.8, 0)
      env.add(m)
    }
    light(16, 7, 0xffffff, 3.0, [0, 9, 1])
    light(16, 6, 0xf4f6fa, 2.4, [0, 6.5, -9]) // what the deck and the closed lid mirror
    light(1.6, 8, 0xdde6ff, 5.0, [-9, 3, 2])
    light(1.6, 8, 0xffcdb6, 3.6, [8, 3.5, -4])
    light(7, 1.1, 0xffffff, 0.9, [0, 1.2, 10])
    light(30, 30, 0x1a1d24, 1, [0, -2, 0])
    const pm = new THREE.PMREMGenerator(renderer)
    const tex = pm.fromScene(env, 0.02).texture
    pm.dispose()
    return tex
  }

  const scene = new THREE.Scene()
  scene.environment = studioEnvironment()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.3, 80)
  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))

  const key = new THREE.DirectionalLight(0xffffff, 1.5)
  key.position.set(-4, 8, 5)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xffc9b0, 1.1)
  rim.position.set(5, 3, -6)
  scene.add(rim)
  scene.add(new THREE.HemisphereLight(0x8fa9d6, 0x0a0f18, 0.3))

  /* =====================================================================
   Procedural maps
   ===================================================================== */
  function noiseMap() {
    // bead-blasted aluminium: fine, even grain
    const c = canvas(256, 256),
      g = c.getContext('2d'),
      d = g.createImageData(256, 256)
    for (let i = 0; i < d.data.length; i += 4) {
      const v = 118 + Math.random() * 30
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v
      d.data[i + 3] = 255
    }
    g.putImageData(d, 0, 0)
    return canvasTex(c, { srgb: false, repeat: 5 })
  }
  function dotsMap(cols, rows, holeR) {
    // speaker grille perforation, 16 px per hole
    const c = canvas(cols * 16, rows * 16),
      g = c.getContext('2d')
    g.fillStyle = '#000'
    g.fillRect(0, 0, c.width, c.height)
    g.fillStyle = '#fff'
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        g.beginPath()
        g.arc(x * 16 + 8 + (y % 2) * 4, y * 16 + 8, holeR, 0, Math.PI * 2)
        g.fill()
      }
    return canvasTex(c, { srgb: false })
  }
  function slotsMap(n) {
    // bottom vents
    const c = canvas(64, n * 16),
      g = c.getContext('2d')
    g.fillStyle = '#000'
    g.fillRect(0, 0, c.width, c.height)
    g.fillStyle = '#fff'
    for (let i = 0; i < n; i++) {
      g.beginPath()
      g.roundRect(8, i * 16 + 4, 48, 8, 4)
      g.fill()
    }
    return canvasTex(c, { srgb: false })
  }
  /* Bead-blasted grain as a normal map: tiny random bumps that break up the
   highlights the way real anodised aluminium does. */
  function grainNormalMap(size = 512, strength = 2.2) {
    const n = size * size,
      h = new Float32Array(n),
      b = new Float32Array(n)
    for (let i = 0; i < n; i++) h[i] = Math.random()
    const at = (x, y) => ((y + size) % size) * size + ((x + size) % size)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        let s = 0
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += h[at(x + i, y + j)]
        b[at(x, y)] = s / 9
      }
    const c = canvas(size, size),
      g = c.getContext('2d'),
      d = g.createImageData(size, size)
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const dx = (b[at(x + 1, y)] - b[at(x - 1, y)]) * strength,
          dy = (b[at(x, y + 1)] - b[at(x, y - 1)]) * strength
        const l = Math.hypot(dx, dy, 1),
          o = at(x, y) * 4
        d.data[o] = ((-dx / l) * 0.5 + 0.5) * 255
        d.data[o + 1] = ((-dy / l) * 0.5 + 0.5) * 255
        d.data[o + 2] = ((1 / l) * 0.5 + 0.5) * 255
        d.data[o + 3] = 255
      }
    g.putImageData(d, 0, 0)
    return canvasTex(c, { srgb: false, repeat: 7 })
  }
  /* Soft glow the lit screen throws onto the deck: brightest under the panel. */
  function spillMap() {
    const c = canvas(512, 512),
      g = c.getContext('2d')
    const grd = g.createRadialGradient(256, 0, 10, 256, 0, 470)
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(0.5, 'rgba(255,255,255,0.35)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 512, 512)
    return canvasTex(c, { srgb: false })
  }
  /* Occlusion strip: the open lid darkens the deck right in front of the hinge. */
  function aoStripMap() {
    const c = canvas(16, 256),
      g = c.getContext('2d')
    const grd = g.createLinearGradient(0, 0, 0, 256)
    grd.addColorStop(0, 'rgba(0,0,0,0.85)')
    grd.addColorStop(0.35, 'rgba(0,0,0,0.35)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 16, 256)
    return canvasTex(c, { srgb: false })
  }
  /* Soft shadow: a blurred rounded rect, drawn through canvas shadowBlur so it
   works in every browser. */
  function shadowMap(rw, rh, radius, blur, alpha) {
    const c = canvas(512, 512),
      g = c.getContext('2d')
    g.shadowColor = `rgba(0,0,0,${alpha})`
    g.shadowBlur = blur
    g.shadowOffsetX = 2000
    g.fillStyle = '#000'
    g.beginPath()
    g.roundRect(256 - rw / 2 - 2000, 256 - rh / 2, rw, rh, radius)
    g.fill()
    return canvasTex(c, { srgb: false })
  }

  const noise = noiseMap()
  const grain = grainNormalMap()

  /* =====================================================================
   Materials
   ===================================================================== */
  const M = {
    alu: new THREE.MeshPhysicalMaterial({
      color: 0xc4c7cc,
      metalness: 1,
      roughness: 0.62,
      roughnessMap: noise,
      normalMap: grain,
      normalScale: new THREE.Vector2(0.18, 0.18),
      envMapIntensity: 1.15,
    }),
    // Diamond-cut chamfer: the polished bright line that frames the deck and lid.
    polish: new THREE.MeshPhysicalMaterial({
      color: 0xe2e5e9,
      metalness: 1,
      roughness: 0.06,
      envMapIntensity: 1.4,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    }),
    aluDark: new THREE.MeshPhysicalMaterial({ color: 0xa3a7ad, metalness: 1, roughness: 0.42 }),
    key: new THREE.MeshPhysicalMaterial({
      color: 0x141518,
      metalness: 0,
      roughness: 0.7,
      clearcoat: 0.18,
      clearcoatRoughness: 0.55,
      envMapIntensity: 0.4,
    }),
    well: new THREE.MeshStandardMaterial({ color: 0x0d0e10, roughness: 0.85 }),
    pad: new THREE.MeshPhysicalMaterial({
      color: 0xb2b5ba,
      metalness: 0.9,
      roughness: 0.26,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
    padEdge: new THREE.MeshStandardMaterial({ color: 0x9a9da3, metalness: 1, roughness: 0.18 }),
    port: new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.9 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x17181a, roughness: 0.95 }),
    hinge: new THREE.MeshPhysicalMaterial({ color: 0x1d1e22, metalness: 0.75, roughness: 0.32 }),
    bezel: new THREE.MeshStandardMaterial({
      color: 0x050506,
      roughness: 0.6,
      envMapIntensity: 0.25,
    }),
    gasket: new THREE.MeshStandardMaterial({ color: 0x0b0b0c, roughness: 1 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0,
      roughness: 0.05,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      envMapIntensity: 1.6,
    }),
    cam: new THREE.MeshPhysicalMaterial({
      color: 0x0b1020,
      metalness: 0.3,
      roughness: 0.08,
      clearcoat: 1,
    }),
    grille: new THREE.MeshStandardMaterial({
      color: 0x0f1012,
      roughness: 0.8,
      transparent: true,
      alphaMap: dotsMap(18, 128, 3.1),
      polygonOffset: true,
      polygonOffsetFactor: -2,
    }),
    vents: new THREE.MeshStandardMaterial({
      color: 0x0b0c0e,
      roughness: 0.9,
      transparent: true,
      alphaMap: slotsMap(40),
      polygonOffset: true,
      polygonOffsetFactor: -2,
    }),
    logo: new THREE.MeshPhysicalMaterial({
      color: 0xf2e6da,
      metalness: 1,
      roughness: 0.05,
      envMapIntensity: 1.5,
      polygonOffset: true,
      polygonOffsetFactor: -3,
    }),
    titanium: new THREE.MeshPhysicalMaterial({
      color: 0xb8ab9e,
      metalness: 1,
      roughness: 0.3,
      roughnessMap: noise,
      normalMap: grain,
      normalScale: new THREE.Vector2(0.12, 0.12),
      envMapIntensity: 1.2,
    }),
    backGlass: new THREE.MeshPhysicalMaterial({
      color: 0xc9b2a0,
      metalness: 0,
      roughness: 0.55,
      clearcoat: 0.35,
      clearcoatRoughness: 0.45,
    }),
    frontGlass: new THREE.MeshPhysicalMaterial({
      color: 0x020203,
      metalness: 0,
      roughness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
    }),
    lensRing: new THREE.MeshPhysicalMaterial({ color: 0x8d847b, metalness: 1, roughness: 0.18 }),
    lensGlass: new THREE.MeshPhysicalMaterial({
      color: 0x040406,
      metalness: 0,
      roughness: 0.04,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
    }),
    lensCore: new THREE.MeshPhysicalMaterial({
      color: 0x1c2645,
      metalness: 0.5,
      roughness: 0.12,
      clearcoat: 1,
    }),
    flash: new THREE.MeshStandardMaterial({ color: 0xefe6d2, roughness: 0.4 }),
  }

  /* =====================================================================
   Screen shader: page content scrolled inside a window, its pinned layer
   (header, floating buttons) on top, browser or phone UI strips around it,
   and either a swipe or a cross-fade between two sites.
   ===================================================================== */
  const SCREEN_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
  const SCREEN_FRAG = /* glsl */ `
  uniform sampler2D cA, oA, tA, bA, cB, oB, tB, bB;
  uniform vec2 winA, winB;        // x: visible share of the page height, y: scroll offset
  uniform float mixAB, mode, bright, radius, aspect, topFrac, botFrac, opacity, border;
  varying vec2 vUv;

  vec3 page(sampler2D c, sampler2D o, vec2 win, vec2 uv) {
    float top = 1.0 - uv.y;
    float py = clamp((top - topFrac) / (1.0 - topFrac), 0.0, 1.0);
    vec3 col = texture2D(c, vec2(uv.x, 1.0 - (win.y + py * win.x))).rgb;
    vec4 ov = texture2D(o, vec2(uv.x, 1.0 - py));
    return mix(col, ov.rgb, ov.a);
  }
  vec3 chrome(vec3 col, sampler2D tt, sampler2D bt, vec2 uv) {
    float top = 1.0 - uv.y;
    vec4 t = texture2D(tt, vec2(uv.x, 1.0 - clamp(top / topFrac, 0.0, 1.0)));
    col = mix(col, t.rgb, t.a * step(top, topFrac));
    float s = clamp((top - (1.0 - botFrac)) / botFrac, 0.0, 1.0);
    vec4 b = texture2D(bt, vec2(uv.x, 1.0 - s));
    return mix(col, b.rgb, b.a * step(1.0 - botFrac, top));
  }
  float sdBox(vec2 uv) {
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    vec2 q = abs(p) - (vec2(aspect, 1.0) * 0.5 - radius);
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }
  void main() {
    vec3 col;
    if (mode < 0.5) {
      float edge = 1.0 - mixAB;
      vec3 a = page(cA, oA, winA, vec2(vUv.x + mixAB, vUv.y));
      vec3 b = page(cB, oB, winB, vec2(vUv.x - edge, vUv.y));
      col = vUv.x < edge ? a : b;
      // Soft shade on the incoming page's leading edge, like a card sliding over.
      float shade = smoothstep(0.0, 0.035, vUv.x - edge);
      col *= (mixAB > 0.0 && mixAB < 1.0 && vUv.x >= edge) ? mix(0.6, 1.0, shade) : 1.0;
    } else {
      col = mix(page(cA, oA, winA, vUv), page(cB, oB, winB, vUv), mixAB);
    }
    col = mixAB < 0.5 ? chrome(col, tA, bA, vUv) : chrome(col, tB, bB, vUv);
    float d = sdBox(vUv);
    col += border * (1.0 - smoothstep(0.0, 0.004, abs(d + 0.002)));
    float alpha = 1.0 - smoothstep(-0.0025, 0.0, d);
    gl_FragColor = vec4(col * bright, alpha * opacity);
    #include <colorspace_fragment>
  }`
  function screenMaterial({ aspect, radius, topFrac, botFrac, border = 0 }) {
    const u = {}
    for (const k of ['cA', 'oA', 'tA', 'bA', 'cB', 'oB', 'tB', 'bB']) u[k] = { value: BLANK }
    u.cA.value = u.cB.value = WHITE
    Object.assign(u, {
      winA: { value: new THREE.Vector2(1, 0) },
      winB: { value: new THREE.Vector2(1, 0) },
      mixAB: { value: 0 },
      mode: { value: 0 },
      bright: { value: 0 },
      radius: { value: radius },
      aspect: { value: aspect },
      topFrac: { value: topFrac },
      botFrac: { value: botFrac },
      opacity: { value: 1 },
      border: { value: border },
    })
    return new THREE.ShaderMaterial({
      uniforms: u,
      vertexShader: SCREEN_VERT,
      fragmentShader: SCREEN_FRAG,
      transparent: true,
      toneMapped: false,
    })
  }

  /* =====================================================================
   Laptop — a 14" machine, 1 unit = 10 cm
   ===================================================================== */
  const L = { W: 3.12, D: 2.2, H: 0.09, T: 0.058, R: 0.16 }
  L.SW = 3.02
  L.SH = L.SW / 1.6
  const LAPTOP_TOP = 52 / 900 // browser bar share of the panel

  const laptop = new THREE.Group() // drop + spin
  const laptopBody = new THREE.Group() // offset so the spin pivots near the middle
  laptopBody.position.y = -0.08
  laptop.add(laptopBody)
  scene.add(laptop)

  laptopBody.add(new THREE.Mesh(slab(L.W, L.D, L.H, L.R, 0.014), M.alu))
  {
    const chamfer = new THREE.Mesh(
      ring(L.W - 0.03, L.D - 0.03, L.R - 0.016, 0.006, 24, true),
      M.polish,
    )
    chamfer.position.y = L.H + 0.0004
    laptopBody.add(chamfer)
  }
  // Screen light on the deck, and the lid's occlusion in front of the hinge.
  const spill = new THREE.Mesh(
    new THREE.PlaneGeometry(L.W * 0.94, L.D * 0.82).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      map: spillMap(),
      color: 0xfff1e4,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  )
  spill.position.set(0, L.H + 0.01 + 0.0012, -L.D / 2 + L.D * 0.41)
  spill.renderOrder = 3
  laptopBody.add(spill)
  const hingeShade = new THREE.Mesh(
    new THREE.PlaneGeometry(L.W * 0.96, 0.26).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      map: aoStripMap(),
      color: 0x000000,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    }),
  )
  hingeShade.position.set(0, L.H + 0.0016, -L.D / 2 + 0.15)
  hingeShade.renderOrder = 2
  laptopBody.add(hingeShade)

  // Keyboard: a dark well, key caps grouped by size into instanced meshes, and
  // one decal carrying every legend (Latin American layout, ñ included).
  const KB = { W: 2.7, D: 1.06 }
  KB.Z = -L.D / 2 + 0.17 + KB.D / 2
  const KEY_TOP = L.H + 0.01
  {
    const well = new THREE.Mesh(flat(KB.W + 0.05, KB.D + 0.05, 0.035), M.well)
    well.position.set(0, L.H + 0.0012, KB.Z)
    laptopBody.add(well)
  }
  const ROWS = [
    {
      h: 0.62,
      keys: [['esc', 1], ...Array.from({ length: 12 }, (_, i) => [`F${i + 1}`, 1]), ['⏻', 1]],
    },
    {
      h: 1,
      keys: [
        ['|', 1],
        ['1', 1],
        ['2', 1],
        ['3', 1],
        ['4', 1],
        ['5', 1],
        ['6', 1],
        ['7', 1],
        ['8', 1],
        ['9', 1],
        ['0', 1],
        ["'", 1],
        ['¿', 1],
        ['borrar', 1.5],
      ],
    },
    {
      h: 1,
      keys: [
        ['tab', 1.5],
        ...'QWERTYUIOP'.split('').map((k) => [k, 1]),
        ['´', 1],
        ['+', 1],
        ['}', 1],
      ],
    },
    {
      h: 1,
      keys: [
        ['bloq mayús', 1.8],
        ...'ASDFGHJKLÑ'.split('').map((k) => [k, 1]),
        ['{', 1],
        ['intro', 1.7],
      ],
    },
    {
      h: 1,
      keys: [
        ['⇧', 1.3],
        ['<', 1],
        ...'ZXCVBNM'.split('').map((k) => [k, 1]),
        [',', 1],
        ['.', 1],
        ['-', 1],
        ['⇧', 2.2],
      ],
    },
    {
      h: 1,
      keys: [
        ['fn', 1],
        ['ctrl', 1],
        ['alt', 1],
        ['cmd', 1.25],
        ['', 5],
        ['cmd', 1.25],
        ['alt', 1],
        ['ARROWS', 3],
      ],
    },
  ]
  const KEYS = [] // { x, z, w, d, label }
  {
    const gap = 0.018
    const unitD = (KB.D - gap * (ROWS.length - 1)) / ROWS.reduce((s, r) => s + r.h, 0)
    let z = KB.Z - KB.D / 2
    for (const row of ROWS) {
      const d = unitD * row.h
      const units = row.keys.reduce((s, k) => s + k[1], 0)
      const unitW = (KB.W - gap * (row.keys.length - 1)) / units
      let x = -KB.W / 2
      for (const [label, size] of row.keys) {
        const w = unitW * size
        if (label === 'ARROWS') {
          const aw = (w - gap * 2) / 3,
            ah = (d - gap) / 2
          KEYS.push({ x: x + aw / 2, z: z + d - ah / 2, w: aw, d: ah, label: '◀' })
          KEYS.push({ x: x + aw * 1.5 + gap, z: z + ah / 2, w: aw, d: ah, label: '▲' })
          KEYS.push({ x: x + aw * 1.5 + gap, z: z + d - ah / 2, w: aw, d: ah, label: '▼' })
          KEYS.push({ x: x + aw * 2.5 + gap * 2, z: z + d - ah / 2, w: aw, d: ah, label: '▶' })
        } else {
          KEYS.push({ x: x + w / 2, z: z + d / 2, w, d, label })
        }
        x += w + gap
      }
      z += d + gap
    }
    const groups = new Map()
    for (const k of KEYS) {
      const id = `${k.w.toFixed(3)}x${k.d.toFixed(3)}`
      if (!groups.has(id)) groups.set(id, [])
      groups.get(id).push(k)
    }
    const m4 = new THREE.Matrix4()
    for (const list of groups.values()) {
      const { w, d } = list[0]
      const mesh = new THREE.InstancedMesh(slab(w, d, 0.022, 0.014, 0.0045), M.key, list.length)
      list.forEach((k, i) => mesh.setMatrixAt(i, m4.makeTranslation(k.x, KEY_TOP - 0.022, k.z)))
      laptopBody.add(mesh)
    }
  }
  function legendsTexture() {
    const CW = 3072,
      CH = Math.round((3072 * KB.D) / KB.W)
    const c = canvas(CW, CH),
      g = c.getContext('2d')
    const sx = CW / KB.W,
      sz = CH / KB.D
    g.fillStyle = '#d9dce1'
    g.textBaseline = 'middle'
    for (const k of KEYS) {
      if (!k.label) continue
      const cx = (k.x + KB.W / 2) * sx,
        cy = (k.z - (KB.Z - KB.D / 2)) * sz
      const kw = k.w * sx,
        kd = k.d * sz
      const word = k.label.length > 2 && !/^F\d+$/.test(k.label)
      const size = word ? kd * 0.2 : k.label.length === 1 ? kd * 0.32 : kd * 0.26
      g.font = `500 ${size}px Inter, system-ui, sans-serif`
      if (word) {
        g.textAlign = 'left'
        g.fillText(k.label, cx - kw / 2 + kd * 0.14, cy + kd * 0.24)
      } else {
        g.textAlign = 'center'
        g.fillText(k.label, cx, cy + (k.label.length === 1 ? 0 : kd * 0.02))
      }
    }
    return canvasTex(c)
  }
  const legendMat = new THREE.MeshStandardMaterial({
    transparent: true,
    roughness: 0.6,
    color: 0xffffff,
    emissive: 0xfff1e6,
    emissiveIntensity: 0,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    depthWrite: false,
  })
  const legends = new THREE.Mesh(
    new THREE.PlaneGeometry(KB.W, KB.D).rotateX(-Math.PI / 2),
    legendMat,
  )
  legends.position.set(0, KEY_TOP + 0.0004, KB.Z)
  legends.renderOrder = 1
  legends.visible = false // shown once the web font is in and the legends are drawn
  laptopBody.add(legends)

  // Speaker grilles either side of the keys
  for (const s of [-1, 1]) {
    const grille = new THREE.Mesh(
      new THREE.PlaneGeometry(0.13, KB.D).rotateX(-Math.PI / 2),
      M.grille,
    )
    grille.position.set(s * (KB.W / 2 + 0.13), L.H + 0.0008, KB.Z)
    laptopBody.add(grille)
  }
  // Trackpad: polished glass with a fine chamfer line
  {
    const edge = new THREE.Mesh(flat(1.4, 0.86, 0.04), M.padEdge)
    edge.position.set(0, L.H + 0.0006, L.D / 2 - 0.13 - 0.43)
    laptopBody.add(edge)
    const pad = new THREE.Mesh(flat(1.385, 0.845, 0.034), M.pad)
    pad.position.set(0, L.H + 0.0011, L.D / 2 - 0.13 - 0.43)
    laptopBody.add(pad)
  }
  // Thumb scoop on the front edge
  {
    const shape = new THREE.Shape()
    shape.absellipse(0, 0, 0.28, 0.05, 0, Math.PI, false)
    const g = new THREE.ShapeGeometry(shape, 24)
    g.rotateX(-Math.PI / 2)
    const scoop = new THREE.Mesh(g, M.aluDark)
    scoop.position.set(0, L.H + 0.0007, L.D / 2 - 0.004)
    laptopBody.add(scoop)
  }
  // Ports: MagSafe, two USB-C and a headphone jack on the left; HDMI, USB-C, SD on the right
  function sideSlot(side, z, w, h, r) {
    const g = new THREE.ShapeGeometry(rrShape(w, h, r), 8)
    g.rotateY(side < 0 ? -Math.PI / 2 : Math.PI / 2)
    const m = new THREE.Mesh(g, M.port)
    m.position.set(side * (L.W / 2 + 0.0012), L.H / 2, z)
    laptopBody.add(m)
  }
  sideSlot(-1, -0.78, 0.13, 0.026, 0.013)
  sideSlot(-1, -0.55, 0.085, 0.026, 0.013)
  sideSlot(-1, -0.4, 0.085, 0.026, 0.013)
  sideSlot(-1, 0.55, 0.034, 0.034, 0.017)
  sideSlot(1, -0.62, 0.13, 0.03, 0.006)
  sideSlot(1, -0.4, 0.085, 0.026, 0.013)
  sideSlot(1, 0.25, 0.22, 0.012, 0.004)
  // Underside: rubber feet and vent slots (seen while it tumbles)
  for (const x of [-1, 1])
    for (const z of [-1, 1]) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.09, 0.012, 32), M.rubber)
      foot.position.set(x * (L.W / 2 - 0.3), -0.005, z * (L.D / 2 - 0.28))
      laptopBody.add(foot)
    }
  for (const x of [-1, 1]) {
    const v = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 1.5).rotateX(Math.PI / 2), M.vents)
    v.position.set(x * (L.W / 2 - 0.12), -0.0008, -0.1)
    laptopBody.add(v)
  }
  // Hinge
  {
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.044, L.W * 0.82, 32), M.hinge)
    h.rotation.z = Math.PI / 2
    h.position.set(0, L.H + 0.012, -L.D / 2 + 0.045)
    laptopBody.add(h)
  }

  // Lid, pivoting on the hinge. Closed, it lies flat over the deck.
  const lid = new THREE.Group()
  lid.position.set(0, L.H + 0.014, -L.D / 2 + 0.045)
  laptopBody.add(lid)
  const LZ = L.D / 2 - 0.045 // lid centre along its own depth
  {
    const shell = new THREE.Mesh(slab(L.W, L.D, L.T, L.R, 0.012), M.alu)
    shell.position.z = LZ
    lid.add(shell)
    const lidChamfer = new THREE.Mesh(
      ring(L.W - 0.026, L.D - 0.026, L.R - 0.014, 0.005, 24, true),
      M.polish,
    )
    lidChamfer.position.set(0, L.T + 0.0004, LZ)
    lid.add(lidChamfer)
    const bezel = new THREE.Mesh(flatDown(L.W - 0.03, L.D - 0.03, L.R - 0.015), M.bezel)
    bezel.position.set(0, -0.0012, LZ)
    lid.add(bezel)
    const gasket = new THREE.Mesh(ring(L.W - 0.012, L.D - 0.012, L.R - 0.006, 0.014), M.gasket)
    gasket.position.set(0, -0.0016, LZ)
    lid.add(gasket)
    const cam = new THREE.Mesh(new THREE.CircleGeometry(0.012, 24).rotateX(Math.PI / 2), M.cam)
    cam.position.set(0, -0.0028, L.D - 0.045 - 0.037)
    lid.add(cam)
    const logo = markGroup(0.5, M.logo)
    logo.rotation.set(-Math.PI / 2, 0, Math.PI)
    logo.position.set(0, L.T + 0.0012, LZ)
    lid.add(logo)
  }
  const laptopScreenMat = screenMaterial({
    aspect: 1.6,
    radius: 0.008,
    topFrac: LAPTOP_TOP,
    botFrac: 0.0001,
  })
  const laptopScreen = new THREE.Mesh(new THREE.PlaneGeometry(L.SW, L.SH), laptopScreenMat)
  laptopScreen.rotation.x = Math.PI / 2
  laptopScreen.position.set(0, -0.0024, L.D - 0.045 - 0.075 - L.SH / 2)
  laptopScreen.renderOrder = 1
  lid.add(laptopScreen)
  {
    const glass = new THREE.Mesh(flatDown(L.W - 0.03, L.D - 0.03, L.R - 0.015), M.glass)
    glass.position.set(0, -0.0036, LZ)
    glass.renderOrder = 2
    lid.add(glass)
  }

  /* =====================================================================
   Phone — 6.1", standing on its edge beside the laptop
   ===================================================================== */
  const P = { W: 0.706, H: 1.466, D: 0.0825, R: 0.105 }
  P.SW = 0.662
  P.SH = (P.SW * 844) / 390
  const PHONE_TOP = 47 / 844,
    PHONE_BOT = 80 / 844
  const PHONE_YAW = -0.36

  const phone = new THREE.Group()
  scene.add(phone)
  phone.add(new THREE.Mesh(standingSlab(P.W, P.H, P.D, P.R, 0.024), M.titanium))
  {
    const front = new THREE.Mesh(
      new THREE.ShapeGeometry(rrShape(P.W - 0.016, P.H - 0.016, P.R - 0.008), 24),
      M.frontGlass,
    )
    front.position.z = P.D / 2 + 0.0006
    phone.add(front)
    const back = new THREE.Mesh(
      new THREE.ShapeGeometry(rrShape(P.W - 0.018, P.H - 0.018, P.R - 0.009), 24),
      M.backGlass,
    )
    back.rotation.y = Math.PI
    back.position.z = -P.D / 2 - 0.0006
    phone.add(back)
    // Camera plateau with three lenses, flash and lidar
    const plate = new THREE.Mesh(standingSlab(0.33, 0.33, 0.012, 0.075, 0.004), M.backGlass)
    const px = P.W / 2 - 0.205,
      py = P.H / 2 - 0.205 // seen from the back, top-left
    plate.position.set(px, py, -P.D / 2 - 0.006)
    phone.add(plate)
    const lens = (x, y) => {
      const g = new THREE.Group()
      const ringM = new THREE.Mesh(
        new THREE.CylinderGeometry(0.058, 0.06, 0.016, 48).rotateX(Math.PI / 2),
        M.lensRing,
      )
      g.add(ringM)
      const glassM = new THREE.Mesh(new THREE.CircleGeometry(0.05, 48), M.lensGlass)
      glassM.rotation.y = Math.PI
      glassM.position.z = -0.0082
      g.add(glassM)
      const core = new THREE.Mesh(new THREE.CircleGeometry(0.026, 40), M.lensCore)
      core.rotation.y = Math.PI
      core.position.z = -0.0084
      g.add(core)
      g.position.set(px + x, py + y, -P.D / 2 - 0.02)
      phone.add(g)
    }
    lens(0.072, 0.075)
    lens(0.072, -0.072)
    lens(-0.078, 0)
    const flash = new THREE.Mesh(new THREE.CircleGeometry(0.018, 32), M.flash)
    flash.rotation.y = Math.PI
    flash.position.set(px - 0.078, py + 0.085, -P.D / 2 - 0.0124)
    phone.add(flash)
    const lidar = new THREE.Mesh(new THREE.CircleGeometry(0.017, 32), M.lensGlass)
    lidar.rotation.y = Math.PI
    lidar.position.set(px - 0.078, py - 0.085, -P.D / 2 - 0.0124)
    phone.add(lidar)
    // Side buttons: action + volume on the left, power on the right
    const button = (x, y, len) => {
      const b = new THREE.Mesh(standingSlab(0.012, len, 0.034, 0.006, 0.003), M.titanium)
      b.position.set(x, y, 0)
      phone.add(b)
    }
    button(-P.W / 2 - 0.003, 0.43, 0.06)
    button(-P.W / 2 - 0.003, 0.27, 0.11)
    button(-P.W / 2 - 0.003, 0.12, 0.11)
    button(P.W / 2 + 0.003, 0.25, 0.2)
    const mark = markGroup(0.18, M.logo)
    mark.rotation.y = Math.PI
    mark.position.set(0, -0.02, -P.D / 2 - 0.0014)
    phone.add(mark)
  }
  const phoneScreenMat = screenMaterial({
    aspect: P.SW / P.SH,
    radius: 0.088 / P.SH,
    topFrac: PHONE_TOP,
    botFrac: PHONE_BOT,
  })
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(P.SW, P.SH), phoneScreenMat)
  phoneScreen.position.z = P.D / 2 + 0.0014
  phoneScreen.renderOrder = 1
  phone.add(phoneScreen)
  {
    const glass = new THREE.Mesh(
      new THREE.ShapeGeometry(rrShape(P.W - 0.016, P.H - 0.016, P.R - 0.008), 24),
      M.glass,
    )
    glass.position.z = P.D / 2 + 0.0022
    glass.renderOrder = 2
    phone.add(glass)
  }
  const PHONE_POS = V(1.62, P.H / 2, 1.3)

  /* Ground shadows: a wide soft penumbra plus a tight contact shadow. */
  function groundShadow(w, d, tex) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        opacity: 0,
        toneMapped: false,
        color: 0x000000,
      }),
    )
    m.position.y = 0.001
    scene.add(m)
    return m
  }
  const shadowSoftTex = shadowMap(300, 220, 40, 60, 0.9)
  const shadowTightTex = shadowMap(330, 240, 30, 14, 1)
  const laptopShadow = groundShadow(L.W * 1.6, L.D * 1.75, shadowSoftTex)
  const laptopContact = groundShadow(L.W * 1.42, L.D * 1.5, shadowTightTex)
  const phoneShadow = groundShadow(1.1, 0.42, shadowSoftTex)

  /* =====================================================================
   Screen artwork: browser bar, phone status bar and address pill, and the
   wireframe the first page builds from.
   ===================================================================== */
  function drawLock(g, x, y) {
    g.save()
    g.strokeStyle = g.fillStyle
    g.lineWidth = 1.5
    g.beginPath()
    g.arc(x, y - 3, 3.2, Math.PI, 0)
    g.stroke()
    g.fillRect(x - 4.5, y - 3, 9, 7)
    g.restore()
  }
  function browserBar(host) {
    const s = TEX_W / 1440
    const c = canvas(1440 * s, 52 * s),
      g = c.getContext('2d')
    g.scale(s, s)
    const grd = g.createLinearGradient(0, 0, 0, 52)
    grd.addColorStop(0, '#f3f2f0')
    grd.addColorStop(1, '#e7e5e2')
    g.fillStyle = grd
    g.fillRect(0, 0, 1440, 52)
    g.fillStyle = '#cfccc7'
    g.fillRect(0, 51, 1440, 1)
    ;[
      ['#ff5f57', '#e0443e'],
      ['#febc2e', '#dea123'],
      ['#28c840', '#1aab29'],
    ].forEach(([f, st], i) => {
      g.beginPath()
      g.arc(24 + i * 20, 26, 6.2, 0, Math.PI * 2)
      g.fillStyle = f
      g.fill()
      g.lineWidth = 0.7
      g.strokeStyle = st
      g.stroke()
    })
    g.lineWidth = 1.8
    g.lineCap = g.lineJoin = 'round'
    g.strokeStyle = '#7d7a76'
    g.beginPath()
    g.moveTo(112, 20)
    g.lineTo(106, 26)
    g.lineTo(112, 32)
    g.stroke()
    g.strokeStyle = '#b9b6b2'
    g.beginPath()
    g.moveTo(134, 20)
    g.lineTo(140, 26)
    g.lineTo(134, 32)
    g.stroke()
    const fw = 600,
      fx = (1440 - fw) / 2
    g.fillStyle = '#ffffff'
    g.beginPath()
    g.roundRect(fx, 11, fw, 30, 8)
    g.fill()
    g.strokeStyle = 'rgba(0,0,0,0.07)'
    g.lineWidth = 1
    g.stroke()
    g.font = '500 13px Inter, system-ui, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const tw = g.measureText(host).width
    g.fillStyle = '#3a3a3c'
    g.fillText(host, 728, 26.5)
    g.fillStyle = '#6e6e73'
    drawLock(g, 728 - tw / 2 - 14, 27)
    g.strokeStyle = '#7d7a76'
    g.lineWidth = 1.6
    g.beginPath()
    g.moveTo(1356, 19)
    g.lineTo(1356, 33)
    g.moveTo(1349, 26)
    g.lineTo(1363, 26)
    g.stroke()
    g.beginPath()
    g.roundRect(1386, 18, 16, 16, 3)
    g.stroke()
    g.beginPath()
    g.roundRect(1390, 14, 16, 16, 3)
    g.stroke()
    return canvasTex(c)
  }
  function luminance(rgb) {
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  }
  function topColor(img) {
    if (!img) return [246, 243, 238]
    const c = canvas(img.width, 4),
      g = c.getContext('2d')
    g.drawImage(img, 0, 0, img.width, 4, 0, 0, img.width, 4)
    const d = g.getImageData(Math.round(img.width * 0.5), 2, 1, 1).data
    return [d[0], d[1], d[2]]
  }
  function statusBar(rgb) {
    const k = 1.5,
      c = canvas(390 * k, 47 * k),
      g = c.getContext('2d')
    g.scale(k, k)
    g.fillStyle = `rgb(${rgb.join(',')})`
    g.fillRect(0, 0, 390, 47)
    const ink = luminance(rgb) > 140 ? '#111113' : '#f5f5f7'
    g.fillStyle = ink
    g.font = '600 16px Inter, system-ui, sans-serif'
    g.textBaseline = 'middle'
    g.textAlign = 'center'
    g.fillText('9:41', 62, 25)
    g.fillStyle = '#000'
    g.beginPath()
    g.roundRect(132, 11, 126, 35, 17.5)
    g.fill()
    g.fillStyle = ink
    for (let i = 0; i < 4; i++) {
      g.beginPath()
      g.roundRect(292 + i * 5, 29 - (i + 1) * 2.6, 3.2, (i + 1) * 2.6, 1)
      g.fill()
    }
    g.lineWidth = 2
    g.strokeStyle = ink
    g.lineCap = 'round'
    for (let i = 0; i < 3; i++) {
      g.beginPath()
      g.arc(325, 30, 3 + i * 3.4, Math.PI * 1.25, Math.PI * 1.75)
      g.stroke()
    }
    g.lineWidth = 1
    g.globalAlpha = 0.45
    g.beginPath()
    g.roundRect(340, 19.5, 25, 12, 3.6)
    g.stroke()
    g.globalAlpha = 1
    g.beginPath()
    g.roundRect(342, 21.5, 18, 8, 2)
    g.fill()
    g.globalAlpha = 0.45
    g.beginPath()
    g.roundRect(366.5, 23, 1.6, 5, 1)
    g.fill()
    return canvasTex(c)
  }
  function addressPill(host, rgb) {
    const k = 1.5,
      c = canvas(390 * k, 80 * k),
      g = c.getContext('2d')
    g.scale(k, k)
    g.shadowColor = 'rgba(0,0,0,0.18)'
    g.shadowBlur = 14
    g.shadowOffsetY = 3
    g.fillStyle = 'rgba(250,250,252,0.94)'
    g.beginPath()
    g.roundRect(14, 10, 362, 44, 22)
    g.fill()
    g.shadowColor = 'transparent'
    g.fillStyle = '#1c1c1e'
    g.font = '500 13.5px Inter, system-ui, sans-serif'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    const short = host.replace('sebbasv.', '')
    g.fillText(short, 195, 32.5)
    g.fillStyle = '#6e6e73'
    drawLock(g, 195 - g.measureText(short).width / 2 - 13, 33)
    g.fillStyle = luminance(rgb) > 140 ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.85)'
    g.beginPath()
    g.roundRect(128, 69, 134, 5, 2.5)
    g.fill()
    return canvasTex(c)
  }

  /* Wireframe build: the page appears as layout blocks first (a designer's
   grid, outlines, then fills), with a cursor placing each one. Laid out like
   Manaba's own first screen so the real page lands right on top of it. */
  const WIRE = {
    desk: {
      w: 1440,
      h: 848,
      bg: '#f6f2ec',
      grid: [120, 1320, 12],
      blocks: [
        ['rect', 120, 22, 44, 44, '#e3d8cb', 12],
        ['rect', 176, 28, 96, 14, '#4a3628', 3],
        ['rect', 176, 50, 150, 7, '#b8a898', 3],
        ['links', 760, 40, 400, 8, '#6f5b4b'],
        ['rect', 1180, 26, 140, 38, '#5b3f2c', 6],
        ['rect', 120, 210, 320, 9, '#a08f7e', 3],
        ['rect', 120, 244, 520, 58, '#3f2b1f', 8],
        ['rect', 120, 312, 450, 58, '#3f2b1f', 8],
        ['rect', 120, 380, 540, 58, '#3f2b1f', 8],
        ['rect', 120, 466, 470, 11, '#a89989', 4],
        ['rect', 120, 488, 410, 11, '#a89989', 4],
        ['rect', 120, 532, 180, 50, '#5b3f2c', 6],
        ['rect', 326, 552, 112, 10, '#4a3628', 3],
        ['arch', 820, 96, 440, 640, '#c9b8a5'],
        ['circle', 1180, 112, 124, 124, '#5b3f2c'],
        ['card', 760, 620, 250, 86, '#ffffff', 12],
      ],
    },
    mob: {
      w: 390,
      h: 797,
      bg: '#f6f2ec',
      grid: [16, 374, 4],
      blocks: [
        ['rect', 16, 12, 36, 36, '#e3d8cb', 10],
        ['rect', 60, 18, 80, 12, '#4a3628', 3],
        ['rect', 60, 36, 110, 6, '#b8a898', 3],
        ['circle', 338, 12, 36, 36, '#e3d8cb'],
        ['rect', 16, 104, 230, 8, '#a08f7e', 3],
        ['rect', 16, 128, 300, 40, '#3f2b1f', 6],
        ['rect', 16, 174, 250, 40, '#3f2b1f', 6],
        ['rect', 16, 220, 320, 40, '#3f2b1f', 6],
        ['rect', 16, 282, 330, 9, '#a89989', 3],
        ['rect', 16, 298, 300, 9, '#a89989', 3],
        ['rect', 16, 314, 180, 9, '#a89989', 3],
        ['rect', 16, 344, 150, 44, '#5b3f2c', 6],
        ['rect', 186, 362, 80, 8, '#4a3628', 3],
        ['arch', 16, 420, 358, 330, '#c9b8a5'],
        ['circle', 290, 404, 84, 84, '#5b3f2c'],
      ],
    },
  }
  function drawWire(g, spec, t) {
    const { w, h, bg, grid, blocks } = spec
    const k = g.canvas.width / w
    g.setTransform(k, 0, 0, k, 0, 0)
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    // Column grid
    const ga = seg(t, 0, 0.12) * (1 - seg(t, 0.82, 1))
    if (ga > 0) {
      const [x0, x1, n] = grid,
        gut = n > 4 ? 24 : 12,
        cw = (x1 - x0 - gut * (n - 1)) / n
      g.fillStyle = `rgba(232,180,160,${0.16 * ga})`
      for (let i = 0; i < n; i++) g.fillRect(x0 + i * (cw + gut), 0, cw, h)
    }
    const n = blocks.length,
      span = 0.72,
      dur = 0.24
    let cursor = null
    blocks.forEach((b, i) => {
      const [kind, x, y, bw, bh, color, r = 0] = b
      const delay = 0.06 + (i / n) * span
      const u = clamp01((t - delay) / dur)
      if (u <= 0) return
      if (u < 1 && !cursor) cursor = [x + bw * 0.62, y + bh * 0.7, u]
      const dy = (1 - easeOutCubic(u)) * 22
      const fill = easeOutCubic(seg(u, 0.3, 1))
      const line = seg(u, 0, 0.3) * (1 - seg(u, 0.75, 1))
      const shape = () => {
        g.beginPath()
        if (kind === 'arch') {
          g.moveTo(x, y + bh + dy)
          g.lineTo(x, y + bw / 2 + dy)
          g.arc(x + bw / 2, y + bw / 2 + dy, bw / 2, Math.PI, 0)
          g.lineTo(x + bw, y + bh + dy)
          g.closePath()
        } else if (kind === 'circle') g.arc(x + bw / 2, y + bh / 2 + dy, bw / 2, 0, Math.PI * 2)
        else g.roundRect(x, y + dy, bw, bh, r)
      }
      if (kind === 'links') {
        g.fillStyle = color
        g.globalAlpha = fill
        for (let j = 0; j < 5; j++) {
          g.beginPath()
          g.roundRect(x + j * (bw / 5), y + dy, bw / 5 - 26, bh, 3)
          g.fill()
        }
        g.globalAlpha = 1
        return
      }
      if (line > 0) {
        g.setLineDash([6, 5])
        g.lineWidth = 2
        g.strokeStyle = `rgba(232,160,130,${line})`
        shape()
        g.stroke()
        g.setLineDash([])
      }
      if (fill > 0) {
        g.globalAlpha = fill
        if (kind === 'arch') {
          const grd = g.createLinearGradient(0, y, 0, y + bh)
          grd.addColorStop(0, '#dccdbd')
          grd.addColorStop(1, '#ad9883')
          g.fillStyle = grd
        } else g.fillStyle = color
        if (kind === 'card') {
          g.shadowColor = 'rgba(60,40,20,0.18)'
          g.shadowBlur = 24
          g.shadowOffsetY = 8
        }
        shape()
        g.fill()
        g.shadowColor = 'transparent'
        g.globalAlpha = 1
      }
    })
    // Cursor placing the current block, with a selection frame
    const ca = seg(t, 0.03, 0.08) * (1 - seg(t, 0.86, 0.94))
    if (cursor && ca > 0) {
      const [cx, cy] = cursor
      g.save()
      g.globalAlpha = ca
      g.translate(cx, cy)
      g.scale(w > 1000 ? 1.4 : 1, w > 1000 ? 1.4 : 1)
      g.beginPath()
      g.moveTo(0, 0)
      g.lineTo(0, 18)
      g.lineTo(4.5, 14)
      g.lineTo(8, 21)
      g.lineTo(11, 19.6)
      g.lineTo(7.6, 12.8)
      g.lineTo(13, 12.8)
      g.closePath()
      g.fillStyle = '#111'
      g.fill()
      g.lineWidth = 1.4
      g.strokeStyle = '#fff'
      g.stroke()
      g.restore()
    }
    g.setTransform(1, 0, 0, 1, 0, 0)
  }
  const wire = {
    desk: { c: canvas(960, 565) },
    mob: { c: canvas(390, 797) },
    t: -1,
  }
  wire.desk.tex = canvasTex(wire.desk.c)
  wire.mob.tex = canvasTex(wire.mob.c)
  function updateWire(t) {
    if (Math.abs(t - wire.t) < 0.0005) return
    wire.t = t
    drawWire(wire.desk.c.getContext('2d'), WIRE.desk, t)
    wire.desk.tex.needsUpdate = true
    drawWire(wire.mob.c.getContext('2d'), WIRE.mob, t)
    wire.mob.tex.needsUpdate = true
  }

  /* =====================================================================
   Assets per project
   ===================================================================== */
  const A = PROJECTS.map(() => ({
    desk: { c: WHITE, o: BLANK, t: BLANK, b: BLANK },
    mob: { c: WHITE, o: BLANK, t: BLANK, b: BLANK },
  }))
  async function loadProject(i) {
    const p = PROJECTS[i],
      a = A[i]
    const [desk, deskOv, mob, mobOv] = await Promise.all(
      ['desk', 'desk-ov', 'mob', 'mob-ov'].map((k) => loadImage(`${assetBase}${p.id}-${k}.webp`)),
    )
    const mobW = Math.round(TEX_W === 1440 ? 585 : 390)
    if (desk) a.desk.c = imageTex(fit(desk, TEX_W))
    if (deskOv) a.desk.o = imageTex(fit(deskOv, TEX_W))
    if (mob) a.mob.c = imageTex(fit(mob, mobW))
    if (mobOv) a.mob.o = imageTex(fit(mobOv, mobW))
    a.desk.t = browserBar(p.host)
    const rgb = topColor(mob)
    a.mob.t = statusBar(rgb)
    a.mob.b = addressPill(p.host, rgb)
    if (disposed) return
    buildPanel(i)
    requestRender()
  }

  /* =====================================================================
   Inside the screen: the projects as floating windows
   ===================================================================== */
  const wscene = new THREE.Scene()
  const wcam = new THREE.PerspectiveCamera(camera.fov, 1, 0.3, 80)
  wscene.add(wcam)
  const curtain = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      color: 0x0a0f18,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    }),
  )
  curtain.position.z = -1
  curtain.renderOrder = -10
  wcam.add(curtain)
  const panelShadowTex = shadowMap(330, 330, 40, 50, 0.85)
  const panels = PROJECTS.map(() => {
    const desk = new THREE.Group()
    const dm = screenMaterial({
      aspect: 1.6,
      radius: 0.018,
      topFrac: LAPTOP_TOP,
      botFrac: 0.0001,
      border: 0.06,
    })
    dm.uniforms.bright.value = 1
    const dMesh = new THREE.Mesh(new THREE.PlaneGeometry(L.SW, L.SH), dm)
    dMesh.renderOrder = 2
    desk.add(dMesh)
    const dShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(L.SW * 1.5, L.SH * 1.7),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        map: panelShadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0,
        toneMapped: false,
      }),
    )
    dShadow.position.set(0.08, -0.2, -0.12)
    dShadow.renderOrder = 1
    desk.add(dShadow)
    const mobile = new THREE.Group()
    const frame = new THREE.Mesh(
      new THREE.ShapeGeometry(rrShape(P.W, P.H, P.R), 24),
      new THREE.MeshBasicMaterial({
        color: 0x0b0b0d,
        transparent: true,
        opacity: 0,
        toneMapped: false,
      }),
    )
    frame.renderOrder = 2
    mobile.add(frame)
    const edge = new THREE.Mesh(
      new THREE.ShapeGeometry(rrShape(P.W + 0.016, P.H + 0.016, P.R + 0.008), 24),
      new THREE.MeshBasicMaterial({
        color: 0x8d8780,
        transparent: true,
        opacity: 0,
        toneMapped: false,
      }),
    )
    edge.position.z = -0.002
    edge.renderOrder = 1
    mobile.add(edge)
    const mm = screenMaterial({
      aspect: P.SW / P.SH,
      radius: 0.088 / P.SH,
      topFrac: PHONE_TOP,
      botFrac: PHONE_BOT,
    })
    mm.uniforms.bright.value = 1
    const mMesh = new THREE.Mesh(new THREE.PlaneGeometry(P.SW, P.SH), mm)
    mMesh.position.z = 0.002
    mMesh.renderOrder = 3
    mobile.add(mMesh)
    const mShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(P.W * 2.1, P.H * 1.5),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        map: panelShadowTex,
        transparent: true,
        depthWrite: false,
        opacity: 0,
        toneMapped: false,
      }),
    )
    mShadow.position.set(0.05, -0.12, -0.1)
    mShadow.renderOrder = 0
    mobile.add(mShadow)
    wscene.add(desk, mobile)
    return { desk, mobile, dm, mm, dShadow, mShadow, frame, edge }
  })
  function buildPanel(i) {
    const a = A[i],
      pn = panels[i]
    for (const [mat, src] of [
      [pn.dm, a.desk],
      [pn.mm, a.mob],
    ]) {
      const u = mat.uniforms
      u.cA.value = src.c
      u.oA.value = src.o
      u.tA.value = src.t
      u.bA.value = src.b
      u.winA.value.set(0.5, 0)
      u.mixAB.value = 0
    }
  }
  function setPanelOpacity(pn, o) {
    pn.dm.uniforms.opacity.value = o
    pn.mm.uniforms.opacity.value = o
    pn.frame.material.opacity = o
    pn.edge.material.opacity = o
    pn.dShadow.material.opacity = 0.6 * o
    pn.mShadow.material.opacity = 0.5 * o
    const vis = o > 0.002
    pn.desk.visible = vis
    pn.mobile.visible = vis
  }

  /* =====================================================================
   Per-frame poses
   ===================================================================== */
  // Where the devices sit on screen: right column on desktop, under the copy on phones.
  let slotRegion = { cx: 0.71, cy: 0.54, fw: 0.52, fh: 0.8 }
  // Phones: the devices fill whatever is left under the text layer showing.
  let below = { copy: { cy: 0.765, fh: 0.42 }, case: { cy: 0.62, fh: 0.62 } }
  function spaceUnder(el, s) {
    const top = el.getBoundingClientRect().bottom - s.top + 36
    const bottom = s.height - 34 // keeps clear of the scroll hint
    const h = Math.max(bottom - top, s.height * 0.3)
    return { cy: (bottom - h / 2) / s.height, fh: (h / s.height) * 0.86 }
  }
  function measureSlot() {
    const s = stage.getBoundingClientRect()
    if (!s.width) return
    if (small()) {
      if (copyEl && caseEl) below = { copy: spaceUnder(copyEl, s), case: spaceUnder(caseEl, s) }
      return
    }
    const r = slot.getBoundingClientRect()
    if (!r.width) return
    slotRegion = {
      cx: (r.left + r.width / 2 - s.left) / s.width,
      cy: 0.54,
      fw: Math.min(0.6, r.width / s.width),
      fh: 0.8,
    }
  }
  function region(p) {
    if (!small()) return slotRegion
    const c = seg(p, 0.15, 0.2) * (1 - seg(p, 0.6, 0.66))
    return {
      cx: 0.5,
      cy: lerp(below.copy.cy, below.case.cy, c),
      fw: 0.94,
      fh: lerp(below.copy.fh, below.case.fh, c),
    }
  }
  const CENTER = V(0.22, 0.95, -0.1)
  const RADIUS = 2.3
  const rig = new THREE.PerspectiveCamera() // a camera, so lookAt aims its -z
  const tmp = { v: V(), q: new THREE.Quaternion(), m: new THREE.Matrix4(), x: V(), y: V(), z: V() }
  let pointer = { x: 0, y: 0, vx: 0, vy: 0 }

  function heroCamera(p) {
    const reg = region(p)
    const aspect = camera.aspect
    // The bounding sphere is generous; on phones a tighter one fills the space.
    const dist =
      (small() ? RADIUS * 0.84 : RADIUS) / Math.min(tanV * reg.fh, tanV * aspect * reg.fw)
    const drift = seg(p, T.projects[0], T.projects[1])
    const az = -0.26 + drift * 0.12 + pointer.vx * 0.04
    const el = 0.2 - drift * 0.04 + pointer.vy * 0.02
    rig.position.set(
      CENTER.x + Math.sin(az) * Math.cos(el) * dist,
      CENTER.y + Math.sin(el) * dist,
      CENTER.z + Math.cos(az) * Math.cos(el) * dist,
    )
    rig.lookAt(CENTER)
    return { pos: rig.position.clone(), quat: rig.quaternion.clone(), reg }
  }
  function diveCamera() {
    laptopScreen.updateWorldMatrix(true, false)
    const m = laptopScreen.matrixWorld
    const c = V().setFromMatrixPosition(m)
    tmp.x.setFromMatrixColumn(m, 0).normalize()
    tmp.y.setFromMatrixColumn(m, 1).normalize()
    tmp.z.setFromMatrixColumn(m, 2).normalize()
    const d = diveDistance()
    const pos = c.addScaledVector(tmp.z, d)
    const quat = new THREE.Quaternion().setFromRotationMatrix(tmp.m.makeBasis(tmp.x, tmp.y, tmp.z))
    return { pos, quat }
  }
  // Close enough that the screen spans the full width of the view.
  function diveDistance() {
    return L.SW / 2 / (tanV * camera.aspect)
  }

  // Drop-in, time based: both devices fall in tumbling, the phone a beat later.
  let dropStart = 0
  const DROP = {
    laptop: { delay: 0, fall: 1.25 },
    phone: { delay: 0.32, fall: 1.15 },
    bounce: 0.34,
  }
  function dropPose(t, d, height) {
    const tt = t - d.delay
    if (tt <= 0) return { y: height, u: 0, landed: 0 }
    const u = clamp01(tt / d.fall)
    let y = height * (1 - u * u)
    let landed = 0
    if (u >= 1) {
      const v = clamp01((tt - d.fall) / DROP.bounce)
      y = 0.13 * Math.sin(Math.PI * v) * (1 - v)
      landed = v
    }
    return { y, u, landed }
  }
  function dropTime(now) {
    if (FREEZE !== null) return FREEZE
    return reduce ? 99 : dropStart ? (now - dropStart) / 1000 : 0
  }
  function dropDone(now) {
    return dropTime(now) > DROP.phone.delay + DROP.phone.fall + DROP.bounce
  }

  function poseDevices(p, now) {
    const t = dropTime(now)
    // Laptop
    // The spin eases out gently, so a good part of it is still happening once
    // the laptop is inside the frame rather than finishing above it.
    const spin = (u) => 1 - Math.pow(1 - u, 1.6)
    const ld = dropPose(t, DROP.laptop, 5.4)
    const lr = spin(ld.u)
    laptop.position.set(0, 0.08 + ld.y, 0)
    laptop.rotation.set(
      lerp(Math.PI * 1.25, 0, lr),
      lerp(-Math.PI * 2.4, 0, lr),
      Math.sin(ld.u * Math.PI) * 0.3 * (1 - ld.u),
    )
    laptop.visible = t > DROP.laptop.delay
    // Phone
    const pd = dropPose(t, DROP.phone, 5.2)
    const pr = spin(pd.u)
    phone.position.set(PHONE_POS.x, PHONE_POS.y + pd.y, PHONE_POS.z)
    phone.rotation.set(
      lerp(Math.PI * 0.7, 0, pr),
      lerp(PHONE_YAW + Math.PI * 3.2, PHONE_YAW, pr),
      lerp(-0.5, 0, pr),
    )
    phone.visible = t > DROP.phone.delay
    // Once both are down, they turn a little toward the pointer (desktop only),
    // easing out before the dive so the flight into the screen stays steady.
    const settled = DROP.phone.delay + DROP.phone.fall + DROP.bounce
    const follow = clamp01((t - settled) / 0.6) * (1 - seg(p, T.dive[0], T.dive[0] + 0.05))
    laptop.rotation.y += pointer.vx * 0.24 * follow
    laptop.rotation.x -= pointer.vy * 0.06 * follow
    phone.rotation.y += pointer.vx * 0.34 * follow
    phone.rotation.x -= pointer.vy * 0.09 * follow
    // Shadows track height
    const near = (y, k) => {
      const n = 1 - clamp01(y / k)
      return n * n
    }
    laptopShadow.material.opacity = 0.62 * near(ld.y, 4.5) * (laptop.visible ? 1 : 0)
    laptopContact.material.opacity = 0.7 * near(ld.y, 0.8) * (laptop.visible ? 1 : 0)
    const ls = 0.8 + 0.2 * near(ld.y, 4.5)
    laptopShadow.scale.set(ls, 1, ls)
    phoneShadow.position.set(PHONE_POS.x, 0.001, PHONE_POS.z)
    phoneShadow.rotation.y = PHONE_YAW
    phoneShadow.material.opacity = 0.55 * near(pd.y, 4) * (phone.visible ? 1 : 0)

    // Lid and panels
    const open = easeInOut(seg(p, T.lid[0], T.lid[1]))
    lid.rotation.x = -THREE.MathUtils.degToRad(108) * open
    const on = seg(p, T.power[0], T.power[1])
    const level = on <= 0 ? 0 : Math.min(1, easeOutCubic(on) * 1.06) - Math.sin(on * Math.PI) * 0.05
    laptopScreenMat.uniforms.bright.value = level
    phoneScreenMat.uniforms.bright.value = level
    legendMat.emissiveIntensity = 0.45 * level
    spill.material.opacity = 0.2 * level * open
    hingeShade.material.opacity = 0.6 * open
    updateScreens(p)
  }

  function layer(src, scroll) {
    return { c: src.c, o: src.o, t: src.t, b: src.b, win: [0.5, scroll] }
  }
  function wireLayer(dev) {
    return { c: wire[dev].tex, o: BLANK, t: A[0][dev].t, b: A[0][dev].b, win: [1, 0] }
  }
  let caseIndex = -1
  function projectAt(p) {
    const len = (T.projects[1] - T.projects[0]) / PROJECTS.length
    const s = (p - T.projects[0]) / len
    const k = Math.max(0, Math.min(PROJECTS.length - 1, Math.floor(s)))
    return { k, local: s - k }
  }
  function screenState(p, dev) {
    const reveal = seg(p, T.reveal[0], T.reveal[1])
    if (reveal < 1) {
      updateWire(seg(p, T.build[0], T.build[1]))
      return { A: wireLayer(dev), B: layer(A[0][dev], 0), mix: easeInOut(reveal), mode: 1 }
    }
    if (p < T.dive[0]) {
      const { k, local } = projectAt(p)
      const delay = dev === 'mob' ? 0.04 : 0
      const scroll = 0.5 * easeInOut(seg(local, 0.04, 0.7))
      const swipe = k < PROJECTS.length - 1 ? easeInOut(seg(local, 0.76 + delay, 1.0)) : 0
      const next = Math.min(k + 1, PROJECTS.length - 1)
      return { A: layer(A[k][dev], scroll), B: layer(A[next][dev], 0), mix: swipe, mode: 0 }
    }
    const back = easeInOut(seg(p, T.dive[0], lerp(T.dive[0], T.dive[1], 0.6)))
    const last = PROJECTS.length - 1
    return { A: layer(A[last][dev], 0.5 * (1 - back)), B: layer(A[last][dev], 0), mix: 0, mode: 0 }
  }
  function applyScreen(mat, st) {
    const u = mat.uniforms
    u.cA.value = st.A.c
    u.oA.value = st.A.o
    u.tA.value = st.A.t
    u.bA.value = st.A.b
    u.winA.value.set(st.A.win[0], st.A.win[1])
    u.cB.value = st.B.c
    u.oB.value = st.B.o
    u.tB.value = st.B.t
    u.bB.value = st.B.b
    u.winB.value.set(st.B.win[0], st.B.win[1])
    u.mixAB.value = st.mix
    u.mode.value = st.mode
  }
  function updateScreens(p) {
    applyScreen(laptopScreenMat, screenState(p, 'desk'))
    applyScreen(phoneScreenMat, screenState(p, 'mob'))
  }

  /* Inside the screen. The project on the laptop becomes the first window,
   recedes into a corridor of the others, the camera flies down it, and the
   windows line up in a grid. */
  const SLOTS = [V(-2.4, 0.75, -9), V(2.5, -0.35, -12.5), V(-2.35, -0.55, -16), V(2.45, 0.8, -19.5)]
  const SLOT_YAW = [0.32, -0.32, 0.3, -0.3]
  const CAM_END_Z = -3.5
  function gridLayout() {
    const portrait = wcam.aspect < 0.85
    const s = 0.6,
      dw = L.SW * s,
      dh = L.SH * s
    const out = PROJECTS.map((_, i) => {
      const col = portrait ? 0 : i % 2,
        row = portrait ? i : Math.floor(i / 2)
      const cols = portrait ? 1 : 2,
        rows = portrait ? 4 : 2
      const gx = portrait ? 0.3 : 0.55,
        gy = portrait ? 0.32 : 0.45
      const x = (col - (cols - 1) / 2) * (dw + gx) - (portrait ? 0.25 : 0.12)
      const y = -(row - (rows - 1) / 2) * (dh + gy) + 0.1
      return { pos: V(x, y, 0), s }
    })
    const w = portrait ? dw + 0.9 : dw * 2 + 0.55 + 0.9
    const h = portrait ? dh * 4 + 0.32 * 3 + 0.6 : dh * 2 + 0.45 + 0.7
    const d = Math.max(h / 2 / tanV, w / 2 / (tanV * wcam.aspect)) * 1.12
    for (const g of out) g.pos.z = CAM_END_Z - d
    return out
  }
  function poseWindows(p) {
    const t = seg(p, T.windows[0], T.windows[1])
    const fly = reduce ? 1 : easeInOut(seg(t, 0.28, 0.78))
    wcam.position.set(
      Math.sin(fly * Math.PI) * 0.7,
      Math.sin(fly * Math.PI) * -0.15,
      lerp(0, CAM_END_Z, fly),
    )
    wcam.lookAt(wcam.position.x * 0.3, wcam.position.y * 0.3, wcam.position.z - 10)
    const grid = gridLayout()
    const last = PROJECTS.length - 1
    const cutZ = -diveDistance()
    panels.forEach((pn, i) => {
      const g = reduce ? 1 : easeInOut(seg(t, 0.66 + i * 0.035, 0.92 + i * 0.02))
      const recede = easeInOut(seg(t, 0.04, 0.42))
      // Desk window: slot pose, or (for the last project) from the cut pose.
      const slot = SLOTS[i]
      // While the camera dollies in, the corridor drifts toward it for parallax.
      const drift = easeInOut(seg(t, 0.2, 0.75)) * 1.4
      let pos = slot.clone().add(V(0, 0, drift)),
        yaw = SLOT_YAW[i],
        scale = 1
      if (i === last && !reduce) {
        pos = V(0, 0, cutZ).lerp(pos, recede)
        yaw = lerp(0, SLOT_YAW[i], recede)
      }
      pos.lerp(grid[i].pos, g)
      yaw = lerp(yaw, 0, g)
      scale = lerp(1, grid[i].s, g)
      pn.desk.position.copy(pos)
      pn.desk.rotation.set(0, yaw, 0)
      pn.desk.scale.setScalar(scale)
      // Phone window rides beside its desktop window.
      // Beside it in the corridor (outer side); tucked over its corner in the grid.
      const side = Math.sign(slot.x)
      const mOff = V(side * 1.95, -0.5, 0.9).lerp(V(0.92, -0.42, 0.14), g)
      pn.mobile.position.copy(pn.desk.position).add(mOff)
      pn.mobile.rotation.set(0, yaw, 0)
      pn.mobile.scale.setScalar(lerp(1, grid[i].s, g))
      // Fade: the cut window is fully there; others arrive staggered; distance dims.
      const appear = i === last ? 1 : seg(t, 0.06 + i * 0.05, 0.3 + i * 0.05)
      const dist = pn.desk.position.distanceTo(wcam.position)
      const depth = clamp01((27 - dist) / 9)
      setPanelOpacity(pn, (reduce ? seg(t, 0, 0.15) : appear) * depth)
    })
  }

  /* =====================================================================
   Page bindings: which text layer shows, which project is on screen
   ===================================================================== */
  let phase = ''
  function updateDom(p, now) {
    const next = p < 0.165 ? 'copy' : p < 0.61 ? 'case' : 'none'
    if (next !== phase) {
      phase = next
      onPhase?.(phase)
    }
    if (phase === 'case') {
      const { k, local } = projectAt(p)
      const i = local >= 0.88 && k < PROJECTS.length - 1 ? k + 1 : k
      if (i !== caseIndex) {
        caseIndex = i
        onCase?.(i)
      }
    }
    const t = seg(p, T.windows[0], T.windows[1])
    if (taglineEl) taglineEl.style.opacity = String(seg(t, 0.3, 0.4) * (1 - seg(t, 0.6, 0.68)))
    if (hintEl) hintEl.style.opacity = dropDone(now) && p < 0.01 ? '1' : '0'
  }

  /* =====================================================================
   Loop: renders only while something is moving
   ===================================================================== */
  let target = 0,
    current = 0,
    raf = 0
  function readScroll() {
    const r = pin.getBoundingClientRect()
    const run = pin.offsetHeight - innerHeight
    target = run > 0 ? clamp01(-r.top / run) : 0
    requestRender()
  }
  function requestRender() {
    if (!raf && !disposed) raf = requestAnimationFrame(frame)
  }

  function frame(now) {
    raf = 0
    const landed = dropDone(now)
    // The lid waits for the landing: scrolling during the drop is held back.
    const goal = landed ? target : 0
    current = reduce || SNAP ? goal : current + (goal - current) * 0.12
    if (Math.abs(goal - current) < 0.00025) current = goal
    pointer.vx += (pointer.x - pointer.vx) * 0.08
    pointer.vy += (pointer.y - pointer.vy) * 0.08
    const p = current

    const wt = seg(p, T.windows[0], T.windows[1])
    const cover = reduce ? seg(p, T.dive[1] - 0.04, T.windows[0] + 0.02) : seg(wt, 0, 0.06)
    const showDevices = cover < 1
    const showWindows = p >= T.windows[0] - (reduce ? 0.04 : 0)

    renderer.clear()
    if (showDevices) {
      poseDevices(p, now)
      const hero = heroCamera(p)
      const dive = reduce ? 0 : easeInOut(seg(p, T.dive[0], T.dive[1]))
      if (dive > 0) {
        const d = diveCamera()
        camera.position.copy(hero.pos).lerp(d.pos, dive)
        camera.quaternion.copy(hero.quat).slerp(d.quat, dive)
      } else {
        camera.position.copy(hero.pos)
        camera.quaternion.copy(hero.quat)
      }
      const w = glCanvas.clientWidth,
        h = glCanvas.clientHeight
      camera.setViewOffset(
        w,
        h,
        -(hero.reg.cx - 0.5) * w * (1 - dive),
        -(hero.reg.cy - 0.5) * h * (1 - dive),
        w,
        h,
      )
      renderer.render(scene, camera)
    }
    if (showWindows) {
      poseWindows(p)
      curtain.material.opacity = cover
      renderer.clearDepth()
      renderer.render(wscene, wcam)
    }
    updateDom(p, now)

    const moving =
      !landed ||
      current !== goal ||
      Math.abs(pointer.x - pointer.vx) > 0.001 ||
      Math.abs(pointer.y - pointer.vy) > 0.001
    if (moving) requestRender()
  }

  function resize() {
    const w = stage.clientWidth,
      h = stage.clientHeight
    if (!w || !h) return
    // Never below 1.5x on desktop: thin metal edges and key legends need the extra
    // samples to stay clean on 1x monitors. Rendering is on demand, so it's cheap.
    const dpr = devicePixelRatio || 1
    renderer.setPixelRatio(small() ? Math.min(dpr, 1.75) : Math.min(2, Math.max(dpr, 1.5)))
    renderer.setSize(w, h, false)
    camera.aspect = wcam.aspect = w / h
    camera.updateProjectionMatrix()
    wcam.updateProjectionMatrix()
    measureSlot()
    const ch = 2 * Math.tan(THREE.MathUtils.degToRad(wcam.fov / 2)) * 1.2
    curtain.scale.set(ch * wcam.aspect, ch, 1)
    readScroll()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(stage)
  // The text layers settle as web fonts arrive; re-measure when they do.
  for (const el of [copyEl, caseEl]) if (el) ro.observe(el)
  addEventListener('scroll', readScroll, { passive: true })
  const onPointer = (e) => {
    pointer.x = (e.clientX / innerWidth) * 2 - 1
    pointer.y = -((e.clientY / innerHeight) * 2 - 1)
    requestRender()
  }
  const followPointer = matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce
  if (followPointer) addEventListener('pointermove', onPointer, { passive: true })

  // Legends wait for the web font. Manaba (the first page shown) loads right
  // away; the drop starts on start(), once Manaba is in or after two seconds.
  document.fonts.ready.then(() => {
    if (disposed) return
    legendMat.map = legendMat.emissiveMap = legendsTexture()
    legendMat.needsUpdate = true
    legends.visible = true
    requestRender()
  })
  const first = loadProject(0)
  resize()
  requestRender()

  let started = false
  function start() {
    if (started || disposed) return
    started = true
    Promise.race([first, new Promise((r) => setTimeout(r, 2000))]).then(() => {
      if (disposed) return
      dropStart = performance.now()
      requestRender()
      for (let i = 1; i < PROJECTS.length; i++) loadProject(i)
    })
  }
  function dispose() {
    disposed = true
    cancelAnimationFrame(raf)
    ro.disconnect()
    removeEventListener('scroll', readScroll)
    if (followPointer) removeEventListener('pointermove', onPointer)
    renderer.dispose()
    renderer.forceContextLoss()
    glCanvas.remove()
  }
  return { start, dispose }
}
