import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import sharp from 'sharp'

const OUT = 'qa/R1'
const BASE = 'http://localhost:4187'
mkdirSync(OUT, { recursive: true })
const manifest = JSON.parse(readFileSync('public/film/manifest.json', 'utf8'))
const sampleIndexes = Array.from({ length: 12 }, (_, i) => Math.round(i * 263 / 11))
for (const [i, index] of sampleIndexes.entries()) {
  copyFileSync(`public${manifest.sets.desktop[index]}`, `${OUT}/film-${String(i + 1).padStart(2, '0')}-frame-${String(index).padStart(3, '0')}.webp`)
}
const detailIndexes = [92,93,94,95,96,97,98,99]
const detailTiles = await Promise.all(detailIndexes.map(async (index) => {
  const image = sharp(`public${manifest.sets.desktop[index]}`).resize(480, 270, { fit: 'cover' })
  return { input: await image.webp().toBuffer(), left: (index % 4) * 480, top: Math.floor((index - 92) / 4) * 270 }
}))
await sharp({ create: { width: 1920, height: 540, channels: 3, background: '#10201c' } }).composite(detailTiles).webp().toFile(`${OUT}/film-pico-92-99.webp`)

const browser = await chromium.launch()
const results = { generatedAt: new Date().toISOString(), frameBytes: {}, local: [], references: [] }
results.frameBytes.desktop = manifest.sets.desktop.reduce((n, p) => n + readFileSync(`public${p}`).length, 0)
results.frameBytes.mobile = manifest.sets.mobile.reduce((n, p) => n + readFileSync(`public${p}`).length, 0)
const sizes = [['390x844',390,844],['667x375',667,375],['768x1024',768,1024],['1024x768',1024,768],['1440x900',1440,900],['1920x1080',1920,1080]]

for (const mode of ['on','off']) for (const [name,width,height] of sizes) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: mode === 'off' ? 'reduce' : 'no-preference' })
  const page = await context.newPage(); const errors=[]; const broken=[]
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) }); page.on('pageerror', e => errors.push(e.message))
  page.on('response', r => { if (r.status() >= 400) broken.push(`${r.status()} ${r.url()}`) })
  const cdp = await context.newCDPSession(page)
  if (name === '390x844') {
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await cdp.send('Network.emulateNetworkConditions', { offline:false, latency:100, downloadThroughput:1.6*1024*1024/8, uploadThroughput:750*1024/8, connectionType:'cellular4g' })
  }
  await page.addInitScript(() => { window.__r1={cls:0,lcp:0}; new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__r1.cls+=e.value}).observe({type:'layout-shift',buffered:true}); new PerformanceObserver(l=>window.__r1.lcp=l.getEntries().at(-1)?.startTime||0).observe({type:'largest-contentful-paint',buffered:true}) })
  await page.goto(`${BASE}/?motion=${mode}`, { waitUntil:'domcontentloaded' }); await page.waitForTimeout(name === '390x844' ? 2500 : 500)
  let scrollProof=null
  if(mode==='on') { await page.waitForFunction(()=>document.querySelector('.film')?.classList.contains('is-painted')); const top=await page.locator('.film').evaluate(e=>e.getBoundingClientRect().top+scrollY); const seen=new Set(); for(let i=0;i<45;i++){await page.evaluate(y=>scrollTo(0,y),top+height*22.5*i/44);await page.waitForTimeout(80);seen.add(await page.locator('.film').getAttribute('data-frame'))} scrollProof=seen.size }
  const m=await page.evaluate(()=>{const film=document.querySelector('.film'),pill=document.querySelector('[data-motion-toggle]'),cs=pill?getComputedStyle(pill):null;return {scrollHeight:document.documentElement.scrollHeight,innerHeight,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,cls:window.__r1.cls,lcp:window.__r1.lcp,motion:document.documentElement.dataset.motion,filmHeight:film?.getBoundingClientRect().height||0,triggerCount:window.ScrollTrigger?.getAll?.().length||document.querySelectorAll('.pin-spacer').length,visibleCards:[...document.querySelectorAll('.film-card')].filter(e=>getComputedStyle(e).visibility==='visible').length,pillWidth:cs?parseFloat(cs.width):0,pillHeight:cs?parseFloat(cs.height):0,pillVisible:!!pill&&cs.display!=='none'&&cs.visibility!=='hidden',focusOutline:getComputedStyle(document.querySelector('[data-motion-toggle]')).outlineStyle}})
  results.local.push({mode,name,...m,scrollProof,errors,broken})
  if(name==='390x844') await page.screenshot({path:`${OUT}/local-${mode}-${name}.png`,fullPage:false})
  await context.close()
}

for (const [slug,url] of [['umbral','https://arquitectura.asck.tech'],['danza','https://danza.asck.tech'],['excamormar','https://excamormar.asck.tech']]) {
  const context=await browser.newContext({viewport:{width:1440,height:900}}); const page=await context.newPage(); const errors=[]
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())}); page.on('pageerror',e=>errors.push(e.message))
  let status=null, title=''; try { const r=await page.goto(url,{waitUntil:'load',timeout:30000}); await page.waitForTimeout(1500); status=r?.status()??null; title=await page.title(); await page.screenshot({path:`${OUT}/ref-${slug}.png`,fullPage:false}); const metrics=await page.evaluate(()=>({scrollScreens:Number((document.documentElement.scrollHeight/innerHeight).toFixed(2)),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,h1:document.querySelector('h1')?.innerText||'',bodyText:document.body.innerText.slice(0,800)})); results.references.push({slug,url,status,title,...metrics,errors}) } catch(e) { results.references.push({slug,url,status,title,error:String(e),errors}) } await context.close()
}
await browser.close()
writeFileSync(`${OUT}/metrics.json`, JSON.stringify(results,null,2)+'\n')
console.log(JSON.stringify(results,null,2))
