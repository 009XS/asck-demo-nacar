import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, extname } from 'node:path'

const sources = Array.from({ length: 9 }, (_, i) => `assets-src/img/${String(i + 1).padStart(2, '0')}-${[
  'nacar-maestra','nacar-capas','esmalte','umbral','sala','sillon','instrumental','radiografia','nacar-oro'
][i]}.png`)
const encoded = sources.map((p) => `data:image/${extname(p).slice(1)};base64,${readFileSync(p).toString('base64')}`)
const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent('<canvas id="c"></canvas>')
await page.evaluate(async (urls) => {
  window.images = await Promise.all(urls.map((url) => new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = url
  })))
}, encoded)

async function makeSet(name, width, height, quality) {
  const out = `public/film/${name}`
  mkdirSync(out, { recursive: true })
  for (let frame = 0; frame < 180; frame++) {
    const data = await page.evaluate(({ frame, width, height, quality }) => {
      const canvas = document.querySelector('#c'); canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d', { alpha: false }); ctx.fillStyle = '#10201c'; ctx.fillRect(0, 0, width, height)
      const position = frame / 179 * 8; const a = Math.min(8, Math.floor(position)); const b = Math.min(8, a + 1)
      const local = position - a; const fade = Math.max(0, Math.min(1, (local - .76) / .24));
      const smooth = fade * fade * (3 - 2 * fade)
      const draw = (img, alpha, index, t) => {
        const cover = Math.max(width / img.width, height / img.height)
        const zoom = 1.02 + .09 * t
        const sw = width / cover / zoom, sh = height / cover / zoom
        const dx = (img.width - sw) * (.42 + .12 * Math.sin(index * 1.7 + t * 1.2))
        const dy = (img.height - sh) * (.48 + .08 * Math.cos(index * 1.3 + t))
        ctx.globalAlpha = alpha; ctx.drawImage(img, dx, dy, sw, sh, 0, 0, width, height)
      }
      draw(window.images[a], 1, a, local)
      if (b !== a && smooth > 0) { ctx.fillStyle = `rgba(16,32,28,${Math.sin(smooth*Math.PI)*.35})`; ctx.fillRect(0,0,width,height); draw(window.images[b], smooth, b, local) }
      ctx.globalAlpha = 1
      return canvas.toDataURL('image/webp', quality)
    }, { frame, width, height, quality })
    writeFileSync(`${out}/f${String(frame).padStart(3, '0')}.webp`, Buffer.from(data.split(',')[1], 'base64'))
  }
}

await makeSet('desktop', 1600, 900, .64)
await makeSet('mobile', 960, 1200, .56)
for (const [file, width, height, quality] of [['poster.webp',1600,900,.72],['poster-mobile.webp',960,1200,.68]]) {
  const data = await page.evaluate(({url,width,height,quality}) => new Promise((resolve,reject) => { const img=new Image(); img.onload=()=>{const c=document.querySelector('#c');c.width=width;c.height=height;const x=c.getContext('2d');const s=Math.max(width/img.width,height/img.height);const sw=width/s,sh=height/s;x.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,0,0,width,height);resolve(c.toDataURL('image/webp',quality))};img.onerror=reject;img.src=url }), {url:encoded[0],width,height,quality})
  writeFileSync(`public/film/${file}`, Buffer.from(data.split(',')[1], 'base64'))
}
await browser.close()
console.log(`Generated 360 frames from ${sources.map(basename).join(', ')}`)
