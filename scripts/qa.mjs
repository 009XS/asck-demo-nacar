import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'

const BASE = process.env.QA_BASE ?? 'http://localhost:4187'
const ownServer = !process.env.QA_BASE
const server = ownServer ? spawn('npm run preview', { stdio: 'pipe', shell: true }) : undefined
const waitForServer = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(BASE)).ok) return } catch { /* retry */ }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`Preview no respondió en ${BASE}`)
}

mkdirSync('qa/v2', { recursive: true })
await waitForServer()
const manifest = JSON.parse(readFileSync('public/film/manifest.json', 'utf8'))
const frameBytes = (set) => manifest.sets[set].reduce((total, url) => total + readFileSync(`public${url}`).length, 0)
const budgets = { desktop: frameBytes('desktop'), mobile: frameBytes('mobile') }
const limits = { desktop: 8_000_000, mobile: 3_000_000 }
const viewports = [['390x844',390,844],['667x375',667,375],['768x1024',768,1024],['1024x768',1024,768],['1440x900',1440,900],['1920x1080',1920,1080]]
const failures = []
const results = []
let browser

try {
  browser = await chromium.launch()
  for (const mode of ['on', 'off']) for (const [name, width, height] of viewports) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: mode === 'off' ? 'reduce' : 'no-preference' })
    const page = await context.newPage()
    const errors = []
    const broken = []
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('response', (response) => { if (response.status() >= 400) broken.push(`${response.status()} ${response.url()}`) })
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
      window.__qa = { clsInitial: 0, clsScroll: 0, phase: 'initial', lcp: 0, shifts: [] }
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
          else window.__qa.clsScroll += entry.value
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
        await page.waitForTimeout(100)
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
    const postScroll = await page.evaluate(() => ({ clsScroll: window.__qa.clsScroll, shifts: window.__qa.shifts }))
    const row = { mode, name, lcpMs: Math.round(metrics.lcp), clsInitial: Number(metrics.clsInitial.toFixed(4)), clsScroll: Number(postScroll.clsScroll.toFixed(4)), overflowPx: metrics.overflow, errors, broken, scrollProof, contentScreens: contentScreens === null ? null : Number(contentScreens.toFixed(2)), motionToggle: metrics.motionToggle, shifts: postScroll.shifts }
    results.push(row)
    const invalidToggle = metrics.motionToggle.width < 44 || metrics.motionToggle.height < 44 || metrics.motionToggle.pressed !== String(mode === 'on')
    if (metrics.overflow > 0 || metrics.clsInitial > 0.05 || invalidToggle || (name === '390x844' && metrics.lcp > 2500) || errors.length || broken.length || (mode === 'on' && (scrollProof ?? 0) < 40) || (contentScreens !== null && height >= 600 && contentScreens > 8.01)) failures.push(row)
    console.log(`${mode} ${name}: LCP ${row.lcpMs}ms CLS inicial ${row.clsInitial} CLS scroll ${row.clsScroll} overflow ${row.overflowPx}px cambios ${scrollProof ?? '-'} coda ${row.contentScreens ?? '-'}vh`)
    await context.close()
  }
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
