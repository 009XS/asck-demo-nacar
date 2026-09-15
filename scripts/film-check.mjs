import { readFileSync, statSync } from 'node:fs'
import sharp from 'sharp'

const manifest = JSON.parse(readFileSync('public/film/manifest.json', 'utf8'))
const declaredCuts = new Set(manifest.cuts.map(({ after }) => after))
const LIMITS = { desktop: 8_000_000, mobile: 3_000_000 }
const absolute = (url) => `public${url}`
const sum = (values) => values.reduce((total, value) => total + value, 0)
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

async function pixels(url) {
  const { data } = await sharp(absolute(url)).resize(64, 64, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true })
  return data
}

async function inspect(set) {
  const frames = manifest.sets[set]
  if (frames.length !== 264) throw new Error(`${set}: ${frames.length} frames; se esperaban 264`)
  const sampled = []
  for (let index = 0; index < frames.length - 1; index += 1) {
    sampled.push({ index, left: await pixels(frames[index]), right: await pixels(frames[index + 1]) })
  }
  const diffs = []
  const cuts = []
  for (const pair of sampled) {
    let delta = 0
    for (let p = 0; p < pair.left.length; p += 1) delta += Math.abs(pair.left[p] - pair.right[p])
    const mean = delta / pair.left.length
    const cut = declaredCuts.has(pair.index) ? pair.index : undefined
    if (cut === undefined) diffs.push({ index: pair.index, mean })
    else cuts.push({ after: cut, fromSample: pair.index, toSample: pair.index + 1, diferenciaMedia: Number(mean.toFixed(3)) })
  }
  const middle = median(diffs.map(({ mean }) => mean))
  const peakItem = [...diffs].sort((a, b) => b.mean - a.mean)[0]
  const peak = peakItem.mean
  return {
    frames: frames.length,
    sampled: sampled.length,
    bytes: sum(frames.map((frame) => statSync(absolute(frame)).size)),
    mediana: Number(middle.toFixed(3)),
    pico: Number(peak.toFixed(3)),
    picoAfter: peakItem.index,
    razonCorte: Number((peak / middle).toFixed(3)),
    paresSobreLimite: diffs.filter(({ mean }) => mean / middle > 3.5).map(({ index, mean }) => ({ after: index, razon: Number((mean / middle).toFixed(3)) })),
    cortesDeclarados: cuts,
  }
}

const report = {
  fps: manifest.fps,
  pinScreens: manifest.pinVh,
  contentScreensMax: 8,
  desktop: await inspect('desktop'),
  mobile: await inspect('mobile'),
}
console.log(JSON.stringify(report, null, 2))

const failures = []
if (manifest.pinVh < 20) failures.push(`pin ${manifest.pinVh} < 20 pantallas`)
if (report.desktop.razonCorte > 3.5) failures.push(`desktop razonCorte ${report.desktop.razonCorte} > 3.5`)
if (report.mobile.razonCorte > 3.5) failures.push(`mobile razonCorte ${report.mobile.razonCorte} > 3.5`)
if (report.desktop.bytes > LIMITS.desktop) failures.push(`desktop ${report.desktop.bytes} B > ${LIMITS.desktop} B`)
if (report.mobile.bytes > LIMITS.mobile) failures.push(`mobile ${report.mobile.bytes} B > ${LIMITS.mobile} B`)
if (failures.length) {
  console.error(`FILM-CHECK FALLÓ: ${failures.join('; ')}`)
  process.exit(1)
}
console.log('FILM-CHECK APROBADO: secuencia real, cortes declarados y presupuestos conformes.')
