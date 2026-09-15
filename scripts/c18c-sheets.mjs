import { mkdirSync, readdirSync } from 'node:fs'
import sharp from 'sharp'

const out = 'qa/v2.1'
mkdirSync(out, { recursive: true })

async function pixels(path) {
  return sharp(path).resize(64, 64, { fit: 'fill' }).greyscale().raw().toBuffer()
}

async function rankedPairs(directory) {
  const files = readdirSync(directory).filter((name) => name.endsWith('.webp')).sort()
  const buffers = await Promise.all(files.map((name) => pixels(`${directory}/${name}`)))
  const pairs = []
  for (let index = 0; index < buffers.length - 1; index += 1) {
    let delta = 0
    for (let p = 0; p < buffers[index].length; p += 1) delta += Math.abs(buffers[index][p] - buffers[index + 1][p])
    pairs.push({ after: index + 1, mean: delta / buffers[index].length })
  }
  return pairs.sort((a, b) => b.mean - a.mean)
}

const label = (text, width, height = 32) => ({
  input: Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#10201c"/><text x="10" y="22" fill="#f4efe5" font-family="Arial" font-size="16">${text}</text></svg>`),
  left: 0,
  top: 0,
})

async function contactSheet(directory, destination, pairs) {
  const tileWidth = 360
  const tileHeight = 203
  const rowHeight = tileHeight + 32
  const composites = []
  for (let row = 0; row < pairs.length; row += 1) {
    const { after, mean } = pairs[row]
    const first = Math.max(1, Math.min(63, after - 1))
    for (let column = 0; column < 4; column += 1) {
      const frame = first + column
      composites.push({
        input: await sharp(`${directory}/f${String(frame).padStart(3, '0')}.webp`).resize(tileWidth, tileHeight, { fit: 'cover' }).toBuffer(),
        left: column * tileWidth,
        top: row * rowHeight + 32,
      })
    }
    const heading = label(`Par ${after}->${after + 1} | mean ${mean.toFixed(3)} | frames ${first}-${first + 3}`, tileWidth * 4)
    composites.push({ ...heading, top: row * rowHeight })
  }
  await sharp({ create: { width: tileWidth * 4, height: rowHeight * pairs.length, channels: 3, background: '#10201c' } })
    .composite(composites).webp({ quality: 88 }).toFile(destination)
}

const configs = [
  ['02', 'qa/v2.1/frames/c02'],
  ['03', 'qa/v2.1/frames/c03'],
  ['04', 'qa/v2.1/frames/c04'],
]
for (const [clip, directory] of configs) {
  const pairs = (await rankedPairs(directory)).slice(0, 5)
  await contactSheet(directory, `${out}/pares-c${clip}.webp`, pairs)
  console.log(`c${clip}: ${pairs.map(({ after, mean }) => `${after}->${after + 1}=${mean.toFixed(3)}`).join(', ')}`)
}
const reference = (await rankedPairs('qa/v2.1/frames/ref')).slice(0, 1)
await contactSheet('qa/v2.1/frames/ref', `${out}/pares-ref-salto-c02-original.webp`, reference)
console.log(`ref: ${reference.map(({ after, mean }) => `${after}->${after + 1}=${mean.toFixed(3)}`).join(', ')}`)

for (const [clip, directory, after] of [
  ['02', 'qa/v2.1/frames/c02', 30],
  ['03', 'qa/v2.1/frames/c03', 35],
  ['04', 'qa/v2.1/frames/c04', 38],
]) {
  const rows = []
  for (const [name, source] of [['main con blend', `public/film/desktop`], ['clip nuevo sin blend', directory]]) {
    const first = after - 1
    const items = []
    for (let column = 0; column < 4; column += 1) {
      const frame = first + column
      const path = source.startsWith('public') ? `${source}/c${clip}-${String(frame).padStart(3, '0')}.webp` : `${source}/f${String(frame).padStart(3, '0')}.webp`
      items.push({ input: await sharp(path).resize(360, 203, { fit: 'cover' }).toBuffer(), left: column * 360, top: rows.length * 235 + 32 })
    }
    rows.push({ name, items })
  }
  const composites = rows.flatMap((row, index) => [{ ...label(`${row.name} | frames ${after - 1}-${after + 2}`, 1440), top: index * 235 }, ...row.items])
  await sharp({ create: { width: 1440, height: 470, channels: 3, background: '#10201c' } })
    .composite(composites).webp({ quality: 88 }).toFile(`${out}/comparativa-c${clip}.webp`)
}

const manifestFrames = [
  ...Array.from({ length: 21 }, (_, index) => index + 85),
  ...Array.from({ length: 21 }, (_, index) => index + 180),
  ...Array.from({ length: 21 }, (_, index) => index + 225),
]
const reviewTiles = []
for (let index = 0; index < manifestFrames.length; index += 1) {
  const globalFrame = manifestFrames[index]
  const clip = Math.floor((globalFrame - 1) / 66) + 1
  const local = ((globalFrame - 1) % 66) + 1
  const input = `public/film/desktop/c${String(clip).padStart(2, '0')}-${String(local).padStart(3, '0')}.webp`
  const row = Math.floor(index / 7)
  const column = index % 7
  reviewTiles.push({ input: await sharp(input).resize(240, 135, { fit: 'cover' }).toBuffer(), left: column * 240, top: row * 163 + 28 })
  reviewTiles.push({ ...label(`Global ${globalFrame}`, 240, 28), left: column * 240, top: row * 163 })
}
await sharp({ create: { width: 1680, height: 1467, channels: 3, background: '#10201c' } })
  .composite(reviewTiles).webp({ quality: 88 }).toFile(`${out}/tramos-integrados.webp`)
