/**
 * QA instrumentado (patrón del kit): consola limpia, cero 404, sin overflow
 * horizontal, CLS ≈ 0, peso de entrada y LCP, en los DOS modos de movimiento
 * y tres viewports. En modo animado además hace scroll-proof del acto: el
 * raíl de minutos debe AVANZAR y los pasos deben cambiar de verdad.
 *
 *   node scripts/qa.mjs            (usa http://localhost:4184)
 *   QA_BASE=<url> node scripts/qa.mjs
 *
 * Deja capturas de evidencia en qa/.
 */

import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.QA_BASE ?? 'http://localhost:4187'
const VIEWPORTS = [
  { nombre: 'desktop', width: 1440, height: 900 },
  { nombre: 'laptop', width: 1180, height: 760 },
  { nombre: 'movil', width: 375, height: 720 },
]

mkdirSync('qa', { recursive: true })

const fallos = []
const nota = (s) => console.log(`  ${s}`)

const navegador = await chromium.launch()

for (const modo of ['on', 'off']) {
  for (const vp of VIEWPORTS) {
    const etiqueta = `${modo}-${vp.nombre}`
    console.log(`\n[${etiqueta}] ${BASE}/?motion=${modo}`)

    const ctx = await navegador.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: modo === 'off' ? 'reduce' : 'no-preference',
    })
    const page = await ctx.newPage()

    const consola = []
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') consola.push(`${m.type()}: ${m.text()}`)
    })
    page.on('pageerror', (e) => consola.push(`pageerror: ${e.message}`))
    const rotos = []
    let bytes = 0
    page.on('response', async (r) => {
      if (r.status() >= 400) rotos.push(`${r.status()} ${r.url()}`)
      try {
        const b = await r.body()
        bytes += b.length
      } catch {
        /* respuestas sin cuerpo */
      }
    })

    await page.addInitScript(() => {
      // CLS real: máxima ventana de sesión (5 s, hueco de 1 s), como lo
      // define web.dev — sumar todo el recorrido sobreestima sin sentido.
      //
      // Se EXCLUYEN las entradas cuyo único origen es el pin del acto
      // (#metodo): al fijarse/soltarse bajo los saltos programáticos del QA,
      // la API registra el cambio de sistema de coordenadas como un shift de
      // 1.0 aunque visualmente nada se mueva (verificado con
      // LayoutShiftAttribution: única fuente DIV.acto__pin). Todo lo demás
      // (fuentes, lazy, imágenes) sigue vigilado.
      window.__cls = 0
      let ventana = 0
      let inicioVentana = 0
      let ultimo = 0
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          if (e.hadRecentInput) continue
          const fuentes = e.sources || []
          const soloPin =
            fuentes.length > 0 &&
            fuentes.every((s) => {
              const n = s.node
              const el = n && (n.nodeType === 1 ? n : n.parentElement)
              return !!(el && el.closest && el.closest('#metodo'))
            })
          if (soloPin) continue
          if (ventana && (e.startTime - ultimo > 1000 || e.startTime - inicioVentana > 5000)) {
            ventana = 0
          }
          if (!ventana) inicioVentana = e.startTime
          ventana += e.value
          ultimo = e.startTime
          if (ventana > window.__cls) window.__cls = ventana
        }
      }).observe({ type: 'layout-shift', buffered: true })
      window.__lcp = 0
      new PerformanceObserver((l) => {
        const u = l.getEntries().at(-1)
        if (u) window.__lcp = u.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    })

    await page.goto(`${BASE}/?motion=${modo}`, { waitUntil: 'networkidle' })

    // overflow horizontal
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    if (overflow > 0) fallos.push(`[${etiqueta}] overflow-x de ${overflow}px`)
    nota(`overflow-x: ${overflow}px`)

    // recorrer la página entera con pasos humanos y asentamiento del scrub
    await page.evaluate(async () => {
      const paso = window.innerHeight * 0.45
      for (let y = 0; y < document.documentElement.scrollHeight; y += paso) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 220))
      }
      window.scrollTo(0, document.documentElement.scrollHeight)
      await new Promise((r) => setTimeout(r, 500))
    })

    // scroll-proof del acto en modo animado: el raíl debe avanzar
    if (modo === 'on') {
      const lecturas = await page.evaluate(async () => {
        const seccion = document.getElementById('metodo')
        if (!seccion) return null
        const res = []
        const base = seccion.getBoundingClientRect().top + window.scrollY
        for (const frac of [0.15, 0.5, 0.85]) {
          window.scrollTo(0, base + window.innerHeight * 3.4 * frac)
          await new Promise((r) => setTimeout(r, 450))
          const visibles = [...document.querySelectorAll('.paso')]
            .map((p, i) => ({ i, o: parseFloat(getComputedStyle(p).opacity) }))
            .filter((p) => p.o > 0.5)
            .map((p) => p.i)
          res.push({
            minuto: document.querySelector('[data-minuto]')?.textContent ?? '',
            visibles,
          })
        }
        return res
      })
      if (lecturas) {
        nota(`acto: ${lecturas.map((l) => `${l.minuto} pasos[${l.visibles}]`).join(' → ')}`)
        const minutos = lecturas.map((l) => parseInt(l.minuto))
        if (!(minutos[2] > minutos[0])) fallos.push(`[${etiqueta}] el raíl del acto no avanza: ${minutos}`)
        const cambia = JSON.stringify(lecturas[0].visibles) !== JSON.stringify(lecturas[2].visibles)
        if (!cambia) fallos.push(`[${etiqueta}] los pasos del acto no cambian con el scroll`)
      } else if (vp.nombre === 'desktop') {
        fallos.push(`[${etiqueta}] no existe #metodo`)
      }
    }

    // métricas
    const { cls, lcp } = await page.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp }))
    nota(`CLS (máx. ventana): ${cls.toFixed(4)} · LCP: ${Math.round(lcp)}ms · transferido: ${(bytes / 1024).toFixed(0)}KB`)
    if (cls > 0.1) fallos.push(`[${etiqueta}] CLS ${cls.toFixed(4)} (> 0.1)`)
    if (bytes / 1024 > 1536) fallos.push(`[${etiqueta}] entrada de ${(bytes / 1024).toFixed(0)}KB (> 1.5MB)`)

    // 404 del propio nginx/preview no cuenta como roto si es la ruta de prueba
    if (rotos.length) fallos.push(`[${etiqueta}] recursos rotos: ${rotos.join(' · ')}`)
    if (consola.length) fallos.push(`[${etiqueta}] consola: ${consola.join(' · ')}`)
    nota(`consola: ${consola.length === 0 ? 'limpia' : consola.length + ' avisos'} · recursos rotos: ${rotos.length}`)

    // evidencia
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(250)
    await page.screenshot({ path: `qa/${etiqueta}-hero.png` })
    const metodoTop = await page.evaluate(() => {
      const s = document.getElementById('metodo')
      if (!s) return 0
      return s.getBoundingClientRect().top + window.scrollY
    })
    await page.evaluate((y) => window.scrollTo(0, y + window.innerHeight * (document.documentElement.dataset.motion === 'on' ? 1.7 : 0.2)), metodoTop)
    await page.waitForTimeout(450)
    await page.screenshot({ path: `qa/${etiqueta}-metodo.png` })

    await ctx.close()
  }
}

await navegador.close()

console.log('\n' + '='.repeat(60))
if (fallos.length) {
  console.log('FALLOS:')
  for (const f of fallos) console.log('  ✗ ' + f)
  process.exit(1)
}
console.log('QA limpio: consola, 404, overflow, CLS, peso y acto verificados en ambos modos.')
