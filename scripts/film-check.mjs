/**
 * FILM-CHECK v2.2
 *
 * Guardarraíl absoluto calibrado con el salto humano confirmado del clip 02
 * original: REF_SALTO = 43.109 y LIMITE_SALTO = 0.75 * REF_SALTO = 32.33175.
 * Falla si cualquier par interno alcanza ese límite. La mediana, razón local,
 * aislamiento y rachas se conservan como información; no deciden la puerta.
 * Los cortes declarados tras 65/131/197 se excluyen y se siguen listando.
 * También se exigen 264 fotogramas y 8 MB desktop / 3 MB mobile.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import sharp from 'sharp'

const manifestPath = process.env.FILM_MANIFEST ?? 'public/film/manifest.json'
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const declaredCuts = new Set(manifest.cuts.map(({ after }) => after))
const LIMITS = { desktop: 8_000_000, mobile: 3_000_000 }
const REF_SALTO = 43.109
const LIMITE_SALTO = 0.75 * REF_SALTO
const RATIO_THRESHOLD = 4.0
const ISOLATION_THRESHOLD = 2.0
const referenceClip02 = process.env.FILM_REFERENCE_C02
const manifestRoot = dirname(manifestPath)
const publicRoot = manifestPath === 'public/film/manifest.json' ? 'public' : dirname(manifestRoot)
const absolute = (url) => url.startsWith('/') ? join(publicRoot, url.slice(1)) : isAbsolute(url) ? url : join(manifestRoot, url)
const sum = (values) => values.reduce((total, value) => total + value, 0)
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
const rounded = (value) => Number(value.toFixed(3))

async function pixels(url) {
  const { data } = await sharp(absolute(url)).resize(64, 64, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true })
  return data
}

async function inspect(set) {
  const frames = [...manifest.sets[set]]
  if (referenceClip02) {
    const referenceFrames = readdirSync(referenceClip02).filter((name) => name.endsWith('.webp')).sort()
    if (referenceFrames.length !== 66) throw new Error(`${referenceClip02}: ${referenceFrames.length} frames; se esperaban 66`)
    referenceFrames.forEach((name, index) => { frames[66 + index] = join(referenceClip02, name) })
  }
  if (frames.length !== 264) throw new Error(`${set}: ${frames.length} frames; se esperaban 264`)
  const buffers = await Promise.all(frames.map(pixels))
  const diffs = []
  const cuts = []
  for (let index = 0; index < buffers.length - 1; index += 1) {
    let delta = 0
    for (let p = 0; p < buffers[index].length; p += 1) delta += Math.abs(buffers[index][p] - buffers[index + 1][p])
    const mean = delta / buffers[index].length
    if (!declaredCuts.has(index)) diffs.push({ globalAfter: index, mean })
    else cuts.push({ after: index, fromSample: index, toSample: index + 1, diferenciaMedia: rounded(mean) })
  }
  const clips = []
  for (let clipIndex = 0; clipIndex < 4; clipIndex += 1) {
    const start = clipIndex * 66
    const clipDiffs = diffs.filter(({ globalAfter }) => globalAfter >= start && globalAfter < start + 65)
      .map((item) => ({ ...item, localAfter: item.globalAfter - start }))
    const middle = median(clipDiffs.map(({ mean }) => mean))
    const elevated = clipDiffs.map((item) => ({ ...item, ratio: item.mean / middle })).filter(({ ratio }) => ratio > RATIO_THRESHOLD)
    const velocity = []
    let run = []
    for (const item of elevated) {
      if (run.length && item.localAfter !== run.at(-1).localAfter + 1) {
        if (run.length > 1) velocity.push(run)
        run = []
      }
      run.push(item)
    }
    if (run.length > 1) velocity.push(run)
    const velocityIndexes = new Set(velocity.flatMap((items) => items.map(({ globalAfter }) => globalAfter)))
    const relativeJumps = elevated.filter((item) => {
      if (velocityIndexes.has(item.globalAfter)) return false
      const neighbors = clipDiffs.filter(({ localAfter }) => localAfter !== item.localAfter && Math.abs(localAfter - item.localAfter) <= 3)
      item.isolation = item.mean / (sum(neighbors.map(({ mean }) => mean)) / neighbors.length)
      return item.isolation > ISOLATION_THRESHOLD
    })
    const peak = [...clipDiffs].sort((a, b) => b.mean - a.mean)[0]
    const absoluteJumps = clipDiffs.filter(({ mean }) => mean >= LIMITE_SALTO)
    clips.push({
      clip: clipIndex + 1,
      mediana: rounded(middle), pico: rounded(peak.mean), picoAfter: peak.globalAfter,
      picoLocalAfter: peak.localAfter, razonMaxima: rounded(peak.mean / middle),
      saltosAbsolutos: absoluteJumps.map((item) => ({ after: item.globalAfter, localAfter: item.localAfter, diferenciaMedia: rounded(item.mean) })),
      saltosRelativosInformativos: relativeJumps.map((item) => ({ after: item.globalAfter, localAfter: item.localAfter, razon: rounded(item.ratio), aislamiento: rounded(item.isolation) })),
      velocidadInformativa: velocity.map((items) => ({ desde: items[0].globalAfter, hasta: items.at(-1).globalAfter, pares: items.length, maximo: rounded(Math.max(...items.map(({ ratio }) => ratio))) })),
    })
  }
  return {
    frames: frames.length, sampled: frames.length - 1,
    bytes: sum(frames.map((frame) => statSync(absolute(frame)).size)), clips,
    saltos: clips.flatMap(({ clip, saltosAbsolutos }) => saltosAbsolutos.map((jump) => ({ clip, ...jump }))),
    cortesDeclarados: cuts,
  }
}

const report = {
  version: 2.2,
  calibracion: { refSalto: REF_SALTO, limiteSalto: LIMITE_SALTO, factor: 0.75, escala: 'gris 64x64, diferencia media absoluta' },
  metricasInformativas: { razonClip: RATIO_THRESHOLD, picoAislado: ISOLATION_THRESHOLD },
  fps: manifest.fps, pinScreens: manifest.pinVh, contentScreensMax: 8,
  desktop: await inspect('desktop'), mobile: await inspect('mobile'),
}
console.log(JSON.stringify(report, null, 2))

const failures = []
if (manifest.pinVh < 20) failures.push(`pin ${manifest.pinVh} < 20 pantallas`)
for (const set of ['desktop', 'mobile']) {
  if (report[set].saltos.length) failures.push(`${set}: ${report[set].saltos.length} SALTO(S) >= ${LIMITE_SALTO.toFixed(4)}`)
  if (report[set].bytes > LIMITS[set]) failures.push(`${set} ${report[set].bytes} B > ${LIMITS[set]} B`)
}
if (failures.length) {
  console.error(`FILM-CHECK FALLÓ: ${failures.join('; ')}`)
  process.exit(1)
}
console.log(`FILM-CHECK APROBADO: ningún par interno alcanza ${LIMITE_SALTO.toFixed(4)}; cortes declarados y presupuestos conformes.`)
