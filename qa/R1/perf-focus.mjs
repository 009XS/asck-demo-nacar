import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
const browser=await chromium.launch()
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'})
const page=await context.newPage(); const cdp=await context.newCDPSession(page)
await cdp.send('Network.setCacheDisabled',{cacheDisabled:true})
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4})
await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:100,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8,connectionType:'cellular4g'})
await page.addInitScript(()=>{window.__p={cls:0,lcp:0,shifts:[]};new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput){window.__p.cls+=e.value;window.__p.shifts.push({value:e.value,time:e.startTime})}}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>window.__p.lcp=l.getEntries().at(-1)?.startTime||0).observe({type:'largest-contentful-paint',buffered:true})})
const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('pageerror',e=>errors.push(e.message))
await page.goto('http://localhost:4187/?motion=on',{waitUntil:'domcontentloaded'});await page.waitForTimeout(8000)
const initial=await page.evaluate(()=>({...window.__p,scrollHeight:document.documentElement.scrollHeight,bodyScreens:Number((document.documentElement.scrollHeight/innerHeight).toFixed(2))}))
await page.focus('[data-motion-toggle]')
const focus=await page.locator('[data-motion-toggle]').evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return{outline:s.outline,outlineOffset:s.outlineOffset,width:r.width,height:r.height,text:e.textContent,ariaLabel:e.getAttribute('aria-label')}})
await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1})
const top=await page.locator('.film').evaluate(e=>e.getBoundingClientRect().top+scrollY);const seen=new Set()
for(let i=0;i<45;i++){await page.evaluate(y=>scrollTo(0,y),top+844*22.5*i/44);await page.waitForTimeout(180);seen.add(await page.locator('.film').getAttribute('data-frame'))}
const output={initial,focus,mobileScrollProofUnthrottledAfterWarmup:seen.size,errors}
writeFileSync('qa/R1/perf-focus.json',JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify(output,null,2));await browser.close()
