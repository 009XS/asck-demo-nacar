import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

async function pixels(path) {
  return sharp(path).resize(64, 64, { fit: 'fill' }).greyscale().raw().toBuffer()
}

async function inspect(directory) {
  const files = readdirSync(directory).filter((file) => file.endsWith('.webp')).sort()
  if (files.length !== 66) throw new Error(`${directory}: ${files.length} frames; se esperaban 66`)
  const frames = await Promise.all(files.map((file) => pixels(join(directory, file))))
  const diffs = []
  for (let index = 0; index < frames.length - 1; index += 1) {
    let delta = 0
    for (let p = 0; p < frames[index].length; p += 1) delta += Math.abs(frames[index][p] - frames[index + 1][p])
    diffs.push({ after: index + 1, mean: delta / frames[index].length })
  }
  const middle = median(diffs.map(({ mean }) => mean))
  const peak = [...diffs].sort((a, b) => b.mean - a.mean)[0]
  const neighbors = diffs.filter(({ after }) => after !== peak.after && Math.abs(after - peak.after) <= 3)
  const neighborMean = neighbors.reduce((total, { mean }) => total + mean, 0) / neighbors.length
  const saltosRangoMasPermisivo = diffs.flatMap((item) => {
    const around = diffs.filter(({ after }) => after !== item.after && Math.abs(after - item.after) <= 3)
    const aroundMean = around.reduce((total, { mean }) => total + mean, 0) / around.length
    const razon = item.mean / middle
    const aislamiento = item.mean / aroundMean
    return razon > 3 && aislamiento > 1.8 ? [{ after: item.after, razon: Number(razon.toFixed(3)), aislamiento: Number(aislamiento.toFixed(3)) }] : []
  })
  return {
    frames: files.length,
    mediana: Number(middle.toFixed(3)),
    pico: Number(peak.mean.toFixed(3)),
    picoAfter: peak.after,
    razon: Number((peak.mean / middle).toFixed(3)),
    mediaVecinos: Number(neighborMean.toFixed(3)),
    aislamiento: Number((peak.mean / neighborMean).toFixed(3)),
    saltosRangoMasPermisivo,
  }
}

const report = {}
for (const item of process.argv.slice(2)) {
  const separator = item.indexOf('=')
  const name = item.slice(0, separator)
  const directory = item.slice(separator + 1)
  if (directory.includes('|')) {
    const [leftPath, rightPath] = directory.split('|')
    const [left, right] = await Promise.all([pixels(leftPath), pixels(rightPath)])
    let delta = 0
    for (let p = 0; p < left.length; p += 1) delta += Math.abs(left[p] - right[p])
    report[name] = { diferenciaMedia: Number((delta / left.length).toFixed(3)) }
  } else report[name] = await inspect(directory)
}
console.log(JSON.stringify(report, null, 2))
