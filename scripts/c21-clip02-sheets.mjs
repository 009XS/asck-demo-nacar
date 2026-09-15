import { mkdirSync, readdirSync } from 'node:fs'
import sharp from 'sharp'

const outputDirectory = 'qa/v2.2'
mkdirSync(outputDirectory, { recursive: true })

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

const label = (text, width, height = 30) => Buffer.from(
  `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#10201c"/><text x="10" y="21" fill="#f4efe5" font-family="Arial" font-size="15">${text}</text></svg>`,
)

async function pairSheet(candidate) {
  const directory = `${outputDirectory}/${candidate}/desktop`
  const pairs = (await rankedPairs(directory)).slice(0, 4)
  const tileWidth = 360
  const tileHeight = 203
  const rowHeight = tileHeight + 30
  const composites = []
  for (let row = 0; row < pairs.length; row += 1) {
    const { after, mean } = pairs[row]
    composites.push({ input: label(`Par ${after}->${after + 1} | diferencia ${mean.toFixed(3)}`, tileWidth * 4), left: 0, top: row * rowHeight })
    for (let column = 0; column < 4; column += 1) {
      const frame = Math.max(1, Math.min(66, after - 1 + column))
      composites.push({
        input: await sharp(`${directory}/f${String(frame).padStart(3, '0')}.webp`).resize(tileWidth, tileHeight, { fit: 'cover' }).toBuffer(),
        left: column * tileWidth,
        top: row * rowHeight + 30,
      })
    }
  }
  await sharp({ create: { width: tileWidth * 4, height: rowHeight * pairs.length, channels: 3, background: '#10201c' } })
    .composite(composites).webp({ quality: 88 }).toFile(`${outputDirectory}/clip02-${candidate}.webp`)
  console.log(`${candidate}: ${pairs.map(({ after, mean }) => `${after}->${after + 1}=${mean.toFixed(3)}`).join(', ')}`)
}

async function integratedSheet() {
  const indexes = Array.from({ length: 24 }, (_, index) => Math.round(index * 65 / 23) + 1)
  const tileWidth = 360
  const tileHeight = 203
  const composites = []
  for (let index = 0; index < indexes.length; index += 1) {
    const frame = indexes[index]
    const column = index % 6
    const row = Math.floor(index / 6)
    composites.push({ input: label(`Clip 02 | fotograma ${frame}`, tileWidth), left: column * tileWidth, top: row * (tileHeight + 30) })
    composites.push({
      input: await sharp(`public/film/desktop/c02-${String(frame).padStart(3, '0')}.webp`).resize(tileWidth, tileHeight, { fit: 'cover' }).toBuffer(),
      left: column * tileWidth,
      top: row * (tileHeight + 30) + 30,
    })
  }
  await sharp({ create: { width: tileWidth * 6, height: (tileHeight + 30) * 4, channels: 3, background: '#10201c' } })
    .composite(composites).webp({ quality: 88 }).toFile(`${outputDirectory}/clip02-24-contact-sheet.webp`)
}

await pairSheet('cand-a')
await pairSheet('cand-b')
if (process.argv.includes('--integrated')) await integratedSheet()
