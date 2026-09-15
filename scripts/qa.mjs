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
mkdirSync('qa/v2.2/contrast', { recursive: true })
await waitForServer()
const manifest = JSON.parse(readFileSync('public/film/manifest.json', 'utf8'))
const frameBytes = (set) => manifest.sets[set].reduce((total, url) => total + readFileSync(`public${url}`).length, 0)
const budgets = { desktop: frameBytes('desktop'), mobile: frameBytes('mobile') }
const limits = { desktop: 8_000_000, mobile: 3_000_000 }
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

async function screenshotContrast(buffer) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const values = []
  for (let index = 0; index < data.length; index += info.channels) {
    values.push(luminance([data[index], data[index + 1], data[index + 2]]))
  }
  values.sort((a, b) => a - b)
  const background = values[Math.floor(values.length * 0.1)]
  const foreground = values[Math.floor(values.length * 0.995)]
  return (foreground + 0.05) / (background + 0.05)
}

async function measureAllLabelContrasts(page, mode, name, height) {
  const contrasts = []
  const filmTop = await page.locator('.film').evaluate((element) => element.getBoundingClientRect().top + scrollY)
  for (let index = 0; index < 9; index += 1) {
    const card = page.locator('.film-card').nth(index)
    if (mode === 'on') {
      await page.evaluate((y) => scrollTo(0, y), filmTop + 1)
      await page.waitForTimeout(Math.max(150, STEP_MS))
      await card.evaluate((element) => {
        element.style.visibility = 'visible'
        element.style.opacity = '1'
        element.style.transform = 'none'
      })
    } else {
      await card.scrollIntoViewIfNeeded()
    }
    const label = card.locator('.label')
    const box = await label.boundingBox()
    if (!box) throw new Error(`Etiqueta ${index + 1} sin caja en ${name}/${mode}`)
    const shot = await page.screenshot({
      path: `qa/v2.2/contrast/${name}-${mode}-${String(index + 1).padStart(2, '0')}.png`,
      clip: box,
      animations: 'disabled',
    })
    contrasts.push(await screenshotContrast(shot))
  }
  return contrasts
}

try {
  browser = await chromium.launch()
  for (const mode of ['on', 'off']) for (const [name, width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: mode === 'off' ? 'reduce' : 'no-preference' })
    const page = await context.newPage()
    const errors = []
    const broken = []
    const responseBytes = new Map()
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('response', (response) => {
      if (response.status() >= 400) broken.push(`${response.status()} ${response.url()}`)
      const length = Number(response.headers()['content-length'] ?? 0)
      if (length > 0) responseBytes.set(response.url(), length)
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
    let labelContrasts = null
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
      const visibleCards = await page.locator('.film-card').evaluateAll((cards) => cards.filter((card) => getComputedStyle(card).visibility === 'visible').length)
      if (visibleCards !== 9) failures.push({ mode, name, visibleCards })
    }
    if (name === '390x844' || name === '1440x900') {
      labelContrasts = await measureAllLabelContrasts(page, mode, name, height)
      if (labelContrasts.some((contrast) => contrast < 4.5)) failures.push({ mode, name, labelContrasts })
    }
    const postScroll = await page.evaluate(() => ({ clsScrollDiagnostico: window.__qa.clsScrollDiagnostico, shifts: window.__qa.shifts }))
    const inputBytes = [...responseBytes.values()].reduce((total, bytes) => total + bytes, 0)
    const row = { mode, name, lcpMs: Math.round(metrics.lcp), clsInitial: Number(metrics.clsInitial.toFixed(4)), clsScrollDiagnostico: Number(postScroll.clsScrollDiagnostico.toFixed(4)), inputBytes, overflowPx: metrics.overflow, errors, broken, scrollProof, contentScreens: contentScreens === null ? null : Number(contentScreens.toFixed(2)), labelContrasts: labelContrasts?.map((value) => Number(value.toFixed(2))) ?? null, motionToggle: metrics.motionToggle, shifts: postScroll.shifts }
    results.push(row)
    const invalidToggle = metrics.motionToggle.width < 44 || metrics.motionToggle.height < 44 || metrics.motionToggle.pressed !== String(mode === 'on')
    const invalidInput = mode === 'on' && (name === '667x375' || name === '768x1024') && inputBytes > 3_300_000
    const invalidScrollCls = mode === 'on' && (name === '390x844' || name === '1440x900') && postScroll.clsScrollDiagnostico >= 0.25
    if (metrics.overflow > 0 || metrics.clsInitial > 0.05 || invalidToggle || invalidInput || invalidScrollCls || (name === '390x844' && metrics.lcp > 2500) || errors.length || broken.length || (mode === 'on' && (scrollProof ?? 0) < 40) || (contentScreens !== null && height >= 600 && contentScreens > 8.01)) failures.push(row)
    console.log(`${mode} ${name}: LCP ${row.lcpMs}ms CLS inicial ${row.clsInitial} CLS barrido ${row.clsScrollDiagnostico} entrada ${row.inputBytes} B contraste min ${labelContrasts ? Math.min(...labelContrasts).toFixed(2) : '-'} overflow ${row.overflowPx}px cambios ${scrollProof ?? '-'} coda ${row.contentScreens ?? '-'}vh`)
    await context.close()
  }

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
  const summary = { frameBytes: budgets, limits, results, failures }
  writeFileSync('qa/v2/metrics.json', `${JSON.stringify(summary, null, 2)}\n`)
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2))
    process.exitCode = 1
  } else console.log('QA APROBADO: 6 viewports, consola/404/overflow/CLS/LCP, >=40 cambios y motion-off.')
} finally {
  await browser?.close()
  if (server) server.kill()
}
