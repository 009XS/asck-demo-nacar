import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import sharp from 'sharp'

const BASE = process.env.QA_BASE ?? 'http://localhost:4187'
const ownServer = !process.env.QA_BASE
// Intervalo entre muestras del barrido. 100 ms basta en local; en remoto se sube (p. ej. QA_STEP_MS=600) para que la secuencia precargue.
const STEP_MS = Number(process.env.QA_STEP_MS ?? 100)
if (!Number.isFinite(STEP_MS) || STEP_MS < 0) throw new Error('QA_STEP_MS invalido: ' + process.env.QA_STEP_MS)
const server = ownServer ? spawn('npm run preview', { stdio: 'pipe', shell: true }) : undefined
const waitForServer = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(BASE)).ok) return } catch { /* retry */ }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`Preview no respondió en ${BASE}`)
}

mkdirSync('qa/v2', { recursive: true })
mkdirSync('qa/v2.4/contrast', { recursive: true })
await waitForServer()
const manifest = JSON.parse(readFileSync('public/film/manifest.json', 'utf8'))
const frameBytes = (set) => manifest.sets[set].reduce((total, url) => total + readFileSync(`public${url.split('?')[0]}`).length, 0)
const budgets = { desktop: frameBytes('desktop'), mobile: frameBytes('mobile') }
const limits = { desktop: 8_000_000, mobile: 2_500_000 }
// Presupuesto de ENTRADA de la doctrina (secuencia + HTML + JS + CSS + fuentes),
// medido por tamaño real de cuerpo, no por `content-length`.
const entryBudgets = { mobile: 2_500_000, desktop: 8_000_000 }
const mobileProfiles = new Set(['390x844', '667x375', '768x1024'])
const LCP_PRESUPUESTO = 2500
const LCP_TOPE_FRIO = 4000
const CLS_BARRIDO_MAX = 0.1
// Umbrales WCAG AA. 4.5 para texto normal (párrafo y etiqueta); 3.0 para texto
// grande, que la norma define como >= 24 px — si el `h2` computa por debajo de
// eso, se le exige 4.5 como a cualquier otro texto.
const CONTRASTE_MIN = 4.5
const CONTRASTE_MIN_GRANDE = 3.0
const TEXTO_GRANDE_PX = 24
const umbralDe = ({ elemento, fontPx }) => (elemento === 'h2' && fontPx >= TEXTO_GRANDE_PX ? CONTRASTE_MIN_GRANDE : CONTRASTE_MIN)
const TEXTOS = [['label', '.label'], ['h2', 'h2'], ['parrafo', 'p:last-of-type']]
const PERFILES_CONTRASTE = [['390x844', 390, 844], ['1440x900', 1440, 900]]
const viewports = [['390x844',390,844],['667x375',667,375],['768x1024',768,1024],['1024x768',1024,768],['1440x900',1440,900],['1920x1080',1920,1080]]
const failures = []
const results = []
let browser

const luminance = ([r, g, b]) => {
  const linear = [r, g, b].map((value) => {
    const channel = value / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

/**
 * Contraste WCAG real: texto contra el fondo que hay DETRÁS de ese mismo texto.
 * Se capturan dos veces los mismos píxeles — con el glifo y con el glifo en
 * `transparent` — y sólo se promedian los píxeles donde el texto domina. Nada de
 * percentiles de luminancia del recorte: eso comparaba el píxel más claro con el
 * decil más oscuro y no es la relación que define WCAG.
 */
async function relacionTextoFondo(conTexto, sinTexto) {
  const a = await sharp(conTexto).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const b = await sharp(sinTexto).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  if (a.data.length !== b.data.length) throw new Error('Los dos recortes de la etiqueta no coinciden en tamaño')
  const canales = a.info.channels
  const pixeles = a.data.length / canales
  const deltas = new Float64Array(pixeles)
  let maximo = 0
  for (let p = 0, i = 0; p < pixeles; p += 1, i += canales) {
    const delta = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2])
    deltas[p] = delta
    if (delta > maximo) maximo = delta
  }
  if (maximo < 24) throw new Error('No se detectó texto dentro del cuadro de la etiqueta')
  // Dos lecturas: el núcleo ancho (conservador, incluye antialias a 11 px) manda
  // en la puerta; el núcleo puro dice cuánto contraste tiene el color en sí.
  const medir = (factor) => {
    const umbral = maximo * factor
    let n = 0, tr = 0, tg = 0, tb = 0, fr = 0, fg = 0, fb = 0
    for (let p = 0, i = 0; p < pixeles; p += 1, i += canales) {
      if (deltas[p] < umbral) continue
      n += 1
      tr += a.data[i]; tg += a.data[i + 1]; tb += a.data[i + 2]
      fr += b.data[i]; fg += b.data[i + 1]; fb += b.data[i + 2]
    }
    if (!n) return null
    const texto = luminance([tr / n, tg / n, tb / n])
    const fondo = luminance([fr / n, fg / n, fb / n])
    const claro = Math.max(texto, fondo)
    const oscuro = Math.min(texto, fondo)
    return { valor: (claro + 0.05) / (oscuro + 0.05), pixeles: n }
  }
  const nucleo = medir(0.6)
  if (!nucleo) throw new Error('0 píxeles de núcleo de glifo en la etiqueta')
  const puro = medir(0.95)
  return { contraste: nucleo.valor, pixelesDeTexto: nucleo.pixeles, contrastePuro: puro?.valor ?? null, pixelesPuros: puro?.pixeles ?? 0 }
}

async function contrasteDeTexto(page, elemento, ruta) {
  const vista = page.viewportSize()
  const box = await elemento.boundingBox()
  if (!box) throw new Error(`Texto sin caja: ${ruta}`)
  // El recorte se limita al viewport: un `h2` de 92 px puede desbordar la lámina
  // y `page.screenshot({ clip })` trabaja en coordenadas de viewport.
  const x0 = Math.max(0, Math.round(box.x))
  const y0 = Math.max(0, Math.round(box.y))
  const x1 = Math.min(vista.width, Math.round(box.x + box.width))
  const y1 = Math.min(vista.height, Math.round(box.y + box.height))
  if (x1 - x0 < 2 || y1 - y0 < 2) throw new Error(`Texto fuera del viewport: ${ruta}`)
  const clip = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }
  const conTexto = await page.screenshot({ clip, animations: 'disabled', path: ruta })
  await elemento.evaluate((node) => {
    node.dataset.qaColor = node.style.color
    node.style.color = 'transparent'
  })
  const sinTexto = await page.screenshot({ clip, animations: 'disabled' })
  await elemento.evaluate((node) => {
    node.style.color = node.dataset.qaColor ?? ''
    delete node.dataset.qaColor
  })
  return relacionTextoFondo(conTexto, sinTexto)
}

/**
 * Mide los TRES textos sobre imagen de los 9 capítulos —etiqueta, titular y
 * párrafo— SOBRE EL ESTADO REAL de la página: en modo animado se navega al
 * progreso de cada capítulo y se comprueba que la tarjeta esté realmente
 * visible. No se fuerza `visibility`, `opacity` ni `transform`: si el usuario no
 * lo ve así, la puerta debe fallar, no maquillarse.
 *
 * Hasta la v2.3 esto sólo miraba `.label`, que es el texto con más contraste
 * (lleva su propio fondo petróleo). Los dos que de verdad se apoyan en el scrim
 * —el `h2` y el párrafo— quedaban fuera, y ahí vivía el fallo AA del capítulo 03
 * en modo quieto (h2 2.62:1, párrafo 4.18:1 a 1440×900).
 */
async function medirContrastes(page, mode, name) {
  const medidas = []
  let inicio = 0
  let fin = 0
  if (mode === 'on') {
    const rango = await page.evaluate(() => {
      const trigger = window.ScrollTrigger?.getAll?.().find((t) => t.pin)
      return trigger ? { inicio: trigger.start, fin: trigger.end } : null
    })
    if (!rango) throw new Error(`Sin ScrollTrigger pinneado para situar los capítulos en ${name}`)
    inicio = rango.inicio
    fin = rango.fin
  }
  for (let index = 0; index < 9; index += 1) {
    const card = page.locator('.film-card').nth(index)
    if (mode === 'on') {
      const punto = await card.evaluate((element) => (Number(element.dataset.from) + Number(element.dataset.to)) / 2)
      await page.evaluate((y) => scrollTo(0, y), Math.round(inicio + (fin - inicio) * Math.min(1, Math.max(0, punto))))
      await page.waitForTimeout(Math.max(800, STEP_MS))
    }
    const estado = await card.evaluate((element) => {
      const estilo = getComputedStyle(element)
      return { visibility: estilo.visibility, opacity: Number(estilo.opacity) }
    })
    for (const [clave, selector] of TEXTOS) {
      const nodo = card.locator(selector)
      // En quieto la lámina mide 88svh: el titular y el párrafo sólo entran en
      // cuadro si se les acerca, que es justo lo que hace quien lee.
      if (mode === 'off') {
        await nodo.scrollIntoViewIfNeeded()
        await page.waitForTimeout(150)
      }
      const fontPx = await nodo.evaluate((node) => parseFloat(getComputedStyle(node).fontSize))
      const ruta = `qa/v2.4/contrast/${name}-${mode}-${String(index + 1).padStart(2, '0')}-${clave}.png`
      const medida = await contrasteDeTexto(page, nodo, ruta)
      const fila = {
        modo: mode, viewport: name, capitulo: index + 1, elemento: clave,
        fontPx: Number(fontPx.toFixed(1)),
        contraste: Number(medida.contraste.toFixed(2)),
        contrastePuro: medida.contrastePuro === null ? null : Number(medida.contrastePuro.toFixed(2)),
        pixelesDeTexto: medida.pixelesDeTexto, pixelesPuros: medida.pixelesPuros,
        estadoReal: estado,
      }
      fila.umbral = umbralDe(fila)
      medidas.push(fila)
    }
  }
  return medidas
}

async function medirLcp(repeticiones) {
  const valores = []
  for (let intento = 0; intento < repeticiones; intento += 1) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'no-preference' })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await cdp.send('Network.enable')
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false, latency: 100, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8,
    })
    await page.addInitScript(() => {
      window.__lcp = 0
      new PerformanceObserver((list) => { window.__lcp = list.getEntries().at(-1)?.startTime ?? 0 }).observe({ type: 'largest-contentful-paint', buffered: true })
    })
    await page.goto(`${BASE}/?motion=on`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    valores.push(Math.round(await page.evaluate(() => window.__lcp)))
    await context.close()
  }
  return valores
}

try {
  browser = await chromium.launch()
  for (const mode of ['on', 'off']) for (const [name, width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: mode === 'off' ? 'reduce' : 'no-preference' })
    const page = await context.newPage()
    const errors = []
    const broken = []
    const responseBytes = new Map()
    const sinCuerpo = []
    let bodyReads = []
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('response', (response) => {
      if (response.status() >= 400) broken.push(`${response.status()} ${response.url()}`)
      // Tamaño REAL del cuerpo. `content-length` no vale: contra HTTP/2 falta en
      // 251 de 274 respuestas y la puerta leía 79,661 B donde había 3,365,621 B.
      bodyReads.push(response.body().then(
        (buffer) => { responseBytes.set(response.url(), buffer.length) },
        () => { if (response.status() === 200) sinCuerpo.push(response.url()) },
      ))
    })
    const cdp = await context.newCDPSession(page)
    if (name === '390x844') {
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
      await cdp.send('Network.enable')
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 100,
        downloadThroughput: 1_600_000 / 8,
        uploadThroughput: 750_000 / 8,
      })
    }
    await page.addInitScript(() => {
      window.__qa = { clsInitial: 0, clsScrollDiagnostico: 0, phase: 'initial', lcp: 0, shifts: [] }
      const selector = (node) => {
        if (!(node instanceof Element)) return null
        if (node.id) return `#${node.id}`
        const classes = [...node.classList].slice(0, 2).join('.')
        return `${node.tagName.toLowerCase()}${classes ? `.${classes}` : ''}`
      }
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue
          const phase = window.__qa.phase
          if (phase === 'initial') window.__qa.clsInitial += entry.value
          else window.__qa.clsScrollDiagnostico += entry.value
          window.__qa.shifts.push({
            phase,
            value: entry.value,
            startTime: Math.round(entry.startTime),
            sources: (entry.sources ?? []).map(({ node, previousRect, currentRect }) => ({ node: selector(node), previousRect, currentRect })),
          })
        }
      }).observe({ type: 'layout-shift', buffered: true })
      new PerformanceObserver((list) => { window.__qa.lcp = list.getEntries().at(-1)?.startTime ?? 0 }).observe({ type: 'largest-contentful-paint', buffered: true })
    })
    await page.goto(`${BASE}/?motion=${mode}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(350)
    const metrics = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      clsInitial: window.__qa.clsInitial,
      lcp: window.__qa.lcp,
      shifts: window.__qa.shifts,
      motionOff: document.documentElement.dataset.motion === 'off',
      triggerCount: window.ScrollTrigger?.getAll?.().length ?? document.querySelectorAll('.pin-spacer').length,
      motionToggle: (() => {
        const element = document.querySelector('[data-motion-toggle]')
        const rect = element?.getBoundingClientRect()
        return { width: rect?.width ?? 0, height: rect?.height ?? 0, pressed: element?.getAttribute('aria-pressed') }
      })(),
    }))
    let scrollProof = null
    let contentScreens = null
    if (mode === 'on') {
      if (name === '390x844') await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
      await page.evaluate(() => { window.__qa.phase = 'scroll' })
      await page.waitForFunction(() => document.querySelector('.film')?.classList.contains('is-painted'), null, { timeout: 10000 })
      const filmTop = await page.locator('.film').evaluate((element) => element.getBoundingClientRect().top + scrollY)
      const seen = new Set()
      for (let point = 0; point < 45; point += 1) {
        await page.evaluate((y) => scrollTo(0, y), filmTop + height * 22.5 * point / 44)
        await page.waitForTimeout(STEP_MS)
        seen.add(await page.locator('.film').getAttribute('data-frame'))
        if ((name === '1440x900' || name === '390x844') && [0, 11, 22, 33, 44].includes(point)) {
          await page.screenshot({ path: `qa/v2/${name}-${String(point / 11).padStart(2, '0')}.png` })
        }
      }
      scrollProof = seen.size
      contentScreens = await page.evaluate((vh) => {
        const pin = document.querySelector('.pin-spacer')
        const end = pin ? pin.getBoundingClientRect().bottom + scrollY : 0
        return (document.documentElement.scrollHeight - end) / vh
      }, height)
    } else if (name === '390x844') {
      const visibleCards = await page.locator('.film-card').evaluateAll((cards) => cards.filter((card) => {
        const estilo = getComputedStyle(card)
        return estilo.visibility === 'visible' && Number(estilo.opacity) === 1
      }).length)
      if (visibleCards !== 9) failures.push({ mode, name, visibleCards })
    }
    const postScroll = await page.evaluate(() => ({ clsScrollDiagnostico: window.__qa.clsScrollDiagnostico, shifts: window.__qa.shifts }))
    while (bodyReads.length) {
      const pendientes = bodyReads
      bodyReads = []
      await Promise.all(pendientes)
    }
    const inputBytes = [...responseBytes.values()].reduce((total, bytes) => total + bytes, 0)
    const row = { mode, name, lcpMs: Math.round(metrics.lcp), clsInitial: Number(metrics.clsInitial.toFixed(4)), clsScrollDiagnostico: Number(postScroll.clsScrollDiagnostico.toFixed(4)), inputBytes, respuestasSinCuerpo: sinCuerpo.length, entryBudget: mobileProfiles.has(name) ? entryBudgets.mobile : entryBudgets.desktop, overflowPx: metrics.overflow, errors, broken, scrollProof, contentScreens: contentScreens === null ? null : Number(contentScreens.toFixed(2)), motionToggle: metrics.motionToggle, shifts: postScroll.shifts }
    results.push(row)
    const invalidToggle = metrics.motionToggle.width < 44 || metrics.motionToggle.height < 44 || metrics.motionToggle.pressed !== String(mode === 'on')
    // Puerta de bytes sobre los SEIS perfiles y sobre el presupuesto de entrada
    // de la doctrina, no sobre un límite suelto de dos perfiles.
    const invalidInput = mode === 'on' && inputBytes > row.entryBudget
    const invalidScrollCls = mode === 'on' && postScroll.clsScrollDiagnostico >= CLS_BARRIDO_MAX
    if (metrics.overflow > 0 || metrics.clsInitial > 0.05 || invalidToggle || invalidInput || invalidScrollCls || sinCuerpo.length || errors.length || broken.length || (mode === 'on' && (scrollProof ?? 0) < 40) || (contentScreens !== null && height >= 600 && contentScreens > 8.01)) failures.push(row)
    console.log(`${mode} ${name}: LCP ${row.lcpMs}ms CLS inicial ${row.clsInitial} CLS barrido ${row.clsScrollDiagnostico} entrada ${row.inputBytes} B / ${row.entryBudget} overflow ${row.overflowPx}px cambios ${scrollProof ?? '-'} coda ${row.contentScreens ?? '-'}vh`)
    await context.close()
  }

  // ------------------------------------------------- contraste AA de los textos
  // Pasada propia y a densidad ×2 (más antialias real del glifo, lectura más
  // severa que a ×1). Va aparte del bucle de arriba para no tocar el DPR con el
  // que se miden bytes, CLS y LCP: los tres textos sobre imagen, los 9 capítulos,
  // los dos modos y los dos anchos = 108 medidas en estado real.
  const contrastes = []
  for (const mode of ['on', 'off']) for (const [name, width, height] of PERFILES_CONTRASTE) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, reducedMotion: mode === 'off' ? 'reduce' : 'no-preference' })
    const page = await context.newPage()
    await page.goto(`${BASE}/?motion=${mode}`, { waitUntil: 'networkidle' })
    if (mode === 'on') await page.waitForFunction(() => document.querySelector('.film')?.classList.contains('is-painted'), null, { timeout: 20000 })
    contrastes.push(...await medirContrastes(page, mode, name))
    await context.close()
  }
  const contrasteFlojo = contrastes.filter((fila) => fila.contraste < fila.umbral)
  const tarjetaNoVisible = contrastes.filter(({ estadoReal }) => estadoReal.visibility !== 'visible' || estadoReal.opacity < 0.9)
  if (contrastes.length !== 2 * PERFILES_CONTRASTE.length * 9 * TEXTOS.length) failures.push({ contraste: 'medidas incompletas', medidas: contrastes.length })
  if (contrasteFlojo.length || tarjetaNoVisible.length) failures.push({ contraste: 'AA', contrasteFlojo, tarjetaNoVisible })
  for (const [clave] of TEXTOS) for (const mode of ['on', 'off']) for (const [name] of PERFILES_CONTRASTE) {
    const sub = contrastes.filter((f) => f.elemento === clave && f.modo === mode && f.viewport === name)
    const min = Math.min(...sub.map((f) => f.contraste))
    const peor = sub.find((f) => f.contraste === min)
    console.log(`contraste ${clave.padEnd(8)} ${mode} ${name}: min ${min.toFixed(2)}:1 (cap ${peor.capitulo}, ${peor.fontPx}px, umbral ${peor.umbral}) max ${Math.max(...sub.map((f) => f.contraste)).toFixed(2)}:1`)
  }

  // --------------------------------- objetivos táctiles de la nav de escritorio
  // Con `(pointer: coarse)` los cuatro enlaces medían 18 px de alto a partir de
  // 1024 px. La puerta comprueba además que la regla NO resucite en el teléfono
  // los enlaces que el layout oculta por debajo de 821 px.
  const navPerfiles = [['390x844', 390, 844, 1], ['820x1180', 820, 1180, 1], ['1024x768', 1024, 768, 5], ['1280x800', 1280, 800, 5], ['1440x900', 1440, 900, 5]]
  const navObjetivos = []
  for (const [name, width, height, esperados] of navPerfiles) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: true, reducedMotion: 'reduce' })
    const page = await context.newPage()
    await page.goto(`${BASE}/?motion=off`, { waitUntil: 'domcontentloaded' })
    // Se espera al enlace de WhatsApp: es el único visible en los cinco anchos
    // (por debajo de 821 px los otros cuatro están ocultos a propósito).
    await page.waitForSelector('.nav__enlaces .nav__wa')
    const medida = await page.evaluate(() => ({
      punteroGrueso: matchMedia('(pointer: coarse)').matches,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      filaPx: Math.round(document.querySelector('.nav__fila').getBoundingClientRect().height),
      enlaces: [...document.querySelectorAll('.nav__enlaces a')]
        .filter((a) => getComputedStyle(a).display !== 'none')
        .map((a) => {
          const caja = a.getBoundingClientRect()
          return { texto: a.textContent.trim(), width: Math.round(caja.width), height: Math.round(caja.height) }
        }),
    }))
    navObjetivos.push({ viewport: name, ...medida })
    const chicos = medida.enlaces.filter(({ height: alto }) => alto < 44)
    // Si la emulación de puntero grueso no se aplicara, esta puerta no probaría nada.
    if (!medida.punteroGrueso) failures.push({ nav: name, motivo: 'no se emuló (pointer: coarse)' })
    if (medida.enlaces.length !== esperados || chicos.length || medida.overflow > 0) failures.push({ nav: name, esperados, medida })
    console.log(`nav ${name} (pointer: coarse): ${medida.enlaces.length}/${esperados} enlaces visibles, ${chicos.length} por debajo de 44 px, fila ${medida.filaPx}px, overflow ${medida.overflow}px`)
    await context.close()
  }

  // ---------------------------------------------------------------- LCP honesto
  // El primer contexto del proceso es la ÚNICA visita en frío real: se reporta
  // tal cual y sólo se le exige el tope de 4 s. El presupuesto de 2.5 s se le
  // pide a la mediana de tres visitas nuevas, que es lo que ve un visitante
  // cuando el contenedor ya está caliente.
  const lcpFrio = results.find((row) => row.mode === 'on' && row.name === '390x844')?.lcpMs ?? null
  const lcpRepeticiones = await medirLcp(3)
  const lcpMediana = [...lcpRepeticiones].sort((a, b) => a - b)[1]
  console.log(`LCP 390x844 CPU4x: frío ${lcpFrio} ms | repeticiones ${lcpRepeticiones.join(' / ')} ms | mediana ${lcpMediana} ms`)
  if (lcpMediana > LCP_PRESUPUESTO) failures.push({ lcp: 'mediana', lcpMediana, presupuesto: LCP_PRESUPUESTO, lcpRepeticiones })
  if (lcpFrio !== null && lcpFrio > LCP_TOPE_FRIO) failures.push({ lcp: 'frio', lcpFrio, tope: LCP_TOPE_FRIO })

  const lifecycleContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  const lifecyclePage = await lifecycleContext.newPage()
  await lifecyclePage.goto(`${BASE}/?motion=on`, { waitUntil: 'networkidle' })
  await lifecyclePage.waitForFunction(() => document.querySelector('.film')?.classList.contains('is-painted'))
  await lifecyclePage.locator('[data-motion-toggle]').click()
  await lifecyclePage.waitForFunction(() => document.documentElement.dataset.motion === 'off')
  const offState = await lifecyclePage.evaluate(() => ({
    visibleCards: [...document.querySelectorAll('.film-card')].filter((card) => {
      const style = getComputedStyle(card)
      return style.visibility === 'visible' && Number(style.opacity) === 1
    }).length,
    pinSpacers: document.querySelectorAll('.pin-spacer').length,
    triggers: window.ScrollTrigger?.getAll?.().length ?? -1,
  }))
  if (offState.visibleCards !== 9 || offState.pinSpacers !== 0 || offState.triggers !== 0) failures.push({ lifecycle: 'on->off', ...offState })
  await lifecyclePage.locator('[data-motion-toggle]').click()
  await lifecyclePage.waitForFunction(() => document.documentElement.dataset.motion === 'on' && document.querySelector('.film')?.classList.contains('is-painted'))
  const lifecycleFilmTop = await lifecyclePage.locator('.film').evaluate((element) => element.getBoundingClientRect().top + scrollY)
  const lifecycleFrames = new Set()
  for (let point = 0; point < 45; point += 1) {
    await lifecyclePage.evaluate((y) => scrollTo(0, y), lifecycleFilmTop + 900 * 22.5 * point / 44)
    await lifecyclePage.waitForTimeout(STEP_MS)
    lifecycleFrames.add(await lifecyclePage.locator('.film').getAttribute('data-frame'))
  }
  if (lifecycleFrames.size !== 45) failures.push({ lifecycle: 'on->off->on', changes: lifecycleFrames.size })
  await lifecycleContext.close()

  const offOnContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const offOnPage = await offOnContext.newPage()
  await offOnPage.goto(`${BASE}/?motion=off`, { waitUntil: 'networkidle' })
  await offOnPage.locator('[data-motion-toggle]').click()
  await offOnPage.waitForFunction(() => document.documentElement.dataset.motion === 'on' && document.querySelectorAll('.pin-spacer').length === 1)
  await offOnContext.close()

  // ------------------------------------------------- CTA de WhatsApp con teclado
  // En modo animado las tarjetas ya no usan `visibility`, así que los 9 CTA de
  // capítulo siguen en el orden de tabulación; al recibir el foco la película
  // salta a su tramo. La regresión recorre la página entera con Tab.
  const tecladoResumen = {}
  for (const [name, width, height] of [['1440x900', 1440, 900], ['390x844', 390, 844]]) {
    const tecladoContext = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' })
    const tecladoPage = await tecladoContext.newPage()
    await tecladoPage.goto(`${BASE}/?motion=on`, { waitUntil: 'networkidle' })
    await tecladoPage.waitForFunction(() => document.querySelector('.film')?.classList.contains('is-painted'), null, { timeout: 15000 })
    const totalWa = await tecladoPage.evaluate(() => {
      const enlaces = [...document.querySelectorAll('a[href*="wa.me"]')]
      enlaces.forEach((enlace, indice) => { enlace.dataset.qaWa = String(indice) })
      return enlaces.length
    })
    await tecladoPage.evaluate(() => { scrollTo(0, 0); document.activeElement?.blur?.() })
    const alcanzados = new Set()
    for (let paso = 0; paso < 160 && alcanzados.size < totalWa; paso += 1) {
      await tecladoPage.keyboard.press('Tab')
      await tecladoPage.waitForTimeout(60)
      const indice = await tecladoPage.evaluate(() => document.activeElement?.dataset?.qaWa ?? null)
      if (indice !== null) alcanzados.add(indice)
    }
    tecladoResumen[name] = { totalWa, alcanzados: alcanzados.size }
    console.log(`teclado ${name} (modo on): ${alcanzados.size}/${totalWa} enlaces wa.me alcanzados con Tab`)
    if (totalWa !== 13 || alcanzados.size !== totalWa) failures.push({ teclado: name, totalWa, alcanzados: alcanzados.size })
    await tecladoContext.close()
  }

  // ------------------------------------------- CTA de capitulo con el raton
  // El teclado no basta: las tarjetas invisibles llevan `pointer-events: none`
  // y quien las enciende es el onUpdate de la timeline. Si eso se sincronizara
  // con el scroll en vez de con la timeline, el CTA visible se quedaria sin
  // punteros al asentarse el scrub — y los 9 CTA de capitulo dejarian de ser
  // clicables sin que nada fallara.
  const punteroContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  const punteroPage = await punteroContext.newPage()
  await punteroPage.goto(`${BASE}/?motion=on`, { waitUntil: 'networkidle' })
  await punteroPage.waitForFunction(() => document.querySelector('.film')?.classList.contains('is-painted'), null, { timeout: 15000 })
  const punteroRango = await punteroPage.evaluate(() => {
    const trigger = window.ScrollTrigger?.getAll?.().find((t) => t.pin)
    return trigger ? { inicio: trigger.start, fin: trigger.end } : null
  })
  if (!punteroRango) failures.push({ punteros: 'sin ScrollTrigger pinneado' })
  const punteros = []
  for (let index = 0; punteroRango && index < 9; index += 1) {
    const punto = await punteroPage.locator('.film-card').nth(index).evaluate((element) => (Number(element.dataset.from) + Number(element.dataset.to)) / 2)
    await punteroPage.evaluate((y) => scrollTo(0, y), Math.round(punteroRango.inicio + (punteroRango.fin - punteroRango.inicio) * Math.min(1, Math.max(0, punto))))
    await punteroPage.waitForTimeout(Math.max(900, STEP_MS))
    punteros.push(await punteroPage.evaluate((idx) => {
      const cards = [...document.querySelectorAll('.film-card')]
      const cta = cards[idx].querySelector('.film-card__cta')
      const caja = cta.getBoundingClientRect()
      const enElPunto = document.elementFromPoint(Math.round(caja.x + caja.width / 2), Math.round(caja.y + caja.height / 2))
      return {
        capitulo: idx + 1,
        opacidad: Number(Number(getComputedStyle(cards[idx]).opacity).toFixed(2)),
        recibeElClic: !!(enElPunto && (enElPunto === cta || cta.contains(enElPunto))),
        invisiblesClicables: cards.filter((card, j) => j !== idx && Number(getComputedStyle(card).opacity) < 0.1 && getComputedStyle(card).pointerEvents !== 'none').length,
      }
    }, index))
  }
  const punterosMalos = punteros.filter(({ recibeElClic, invisiblesClicables }) => !recibeElClic || invisiblesClicables > 0)
  console.log(`punteros 1440x900 (modo on): ${punteros.filter((p) => p.recibeElClic).length}/${punteros.length} CTA de capitulo reciben el clic; ${punteros.reduce((t, p) => t + p.invisiblesClicables, 0)} tarjetas invisibles clicables`)
  if (punteros.length !== 9 || punterosMalos.length) failures.push({ punteros: punterosMalos, medidos: punteros.length })
  await punteroContext.close()

  const targetContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const targetPage = await targetContext.newPage()
  await targetPage.goto(`${BASE}/?motion=off`, { waitUntil: 'networkidle' })
  const tapTargets = await targetPage.locator('#hero .h-quiet, .nav__marca, .nav__wa, .cierre__tel, .footer__credito a').evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect()
    return { selector: element.className || element.tagName, width: rect.width, height: rect.height }
  }))
  if (tapTargets.some(({ width, height }) => width < 44 || height < 44)) failures.push({ tapTargets })
  await targetContext.close()

  if (budgets.desktop > limits.desktop || budgets.mobile > limits.mobile) failures.push({ frameBudgets: budgets, limits })
  const summary = { frameBytes: budgets, limits, entryBudgets, lcp: { frio: lcpFrio, repeticiones: lcpRepeticiones, mediana: lcpMediana, presupuestoMediana: LCP_PRESUPUESTO, topeFrio: LCP_TOPE_FRIO }, teclado: tecladoResumen, punteros, umbralesContraste: { normal: CONTRASTE_MIN, grande: CONTRASTE_MIN_GRANDE, textoGrandePx: TEXTO_GRANDE_PX }, contrastes, navObjetivos, results, failures }
  writeFileSync('qa/v2/metrics.json', `${JSON.stringify(summary, null, 2)}\n`)
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2))
    process.exitCode = 1
  } else console.log('QA APROBADO: 6 viewports, consola/404/overflow/CLS<0.1/bytes reales/LCP mediana, contraste AA real de etiqueta+titular+parrafo en los 2 modos y los 2 anchos, nav >=44 px con puntero grueso, 13/13 CTA con teclado, 9/9 CTA con raton, >=40 cambios y motion-off.')
} finally {
  await browser?.close()
  if (server) server.kill()
}
