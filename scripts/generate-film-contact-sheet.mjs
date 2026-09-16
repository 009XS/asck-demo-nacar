import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const manifest = JSON.parse(readFileSync('public/film/manifest.json', 'utf8'))
const frames = manifest.sets.desktop
const indexes = Array.from({ length: 12 }, (_, index) => Math.round(index * (frames.length - 1) / 11))
const width = 480
const height = 270
const tiles = await Promise.all(indexes.map(async (index, sample) => ({
  input: await sharp(`public${frames[index].split('?')[0]}`).resize(width, height, { fit: 'cover' }).toBuffer(),
  left: (sample % 4) * width,
  top: Math.floor(sample / 4) * height,
})))

await sharp({ create: { width: width * 4, height: height * 3, channels: 3, background: '#10201c' } })
  .composite(tiles)
  .webp({ quality: 82 })
  .toFile('qa/R1/film-12-contact-sheet.webp')

console.log(`Contact sheet: ${indexes.map((index) => index + 1).join(', ')}`)
