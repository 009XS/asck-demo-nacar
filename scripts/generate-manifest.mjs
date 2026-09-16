import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const names = (set) => readdirSync(`public/film/${set}`)
  .filter((name) => /^c0[1-4]-\d{3}\.webp$/.test(name))
  .sort()

// Huella del set: sha256 sobre los bytes de sus 264 fotogramas. Los nombres son
// estables entre versiones, así que sin esta huella el `immutable` de nginx
// congelaría la secuencia anterior en los navegadores que ya la visitaron.
const fingerprint = (set, list) => {
  const hash = createHash('sha256')
  for (const name of list) hash.update(readFileSync(`public/film/${set}/${name}`))
  return hash.digest('hex').slice(0, 10)
}

const ordered = (set) => {
  const list = names(set)
  const version = fingerprint(set, list)
  return { version, urls: list.map((name) => `/film/${set}/${name}?v=${version}`) }
}

const desktop = ordered('desktop')
const mobile = ordered('mobile')
if (desktop.urls.length !== 264 || mobile.urls.length !== 264) throw new Error('Se esperaban 264 fotogramas por set')

const manifest = {
  version: 2, fps: 10, pinVh: 22.5,
  setVersions: { desktop: desktop.version, mobile: mobile.version },
  sets: { desktop: desktop.urls, mobile: mobile.urls },
  chapters: [
    { id: 'materia', from: 0, to: 0.12 }, { id: 'diagnostico', from: 0.105, to: 0.23 },
    { id: 'escucha', from: 0.215, to: 0.34 }, { id: 'escanear', from: 0.325, to: 0.45 },
    { id: 'planear', from: 0.435, to: 0.56 }, { id: 'decidir', from: 0.545, to: 0.67 },
    { id: 'precision', from: 0.655, to: 0.78 }, { id: 'claridad', from: 0.765, to: 0.89 },
    { id: 'cierre', from: 0.875, to: 1 },
  ],
  cuts: [
    { after: 65, from: 'c01-066', to: 'c02-001' },
    { after: 131, from: 'c02-066', to: 'c03-001' },
    { after: 197, from: 'c03-066', to: 'c04-001' },
  ],
}
writeFileSync('public/film/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`manifest: 264 desktop (v=${desktop.version}) + 264 mobile (v=${mobile.version})`)
