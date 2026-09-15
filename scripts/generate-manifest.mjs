import { readdirSync, writeFileSync } from 'node:fs'

const ordered = (set) => readdirSync(`public/film/${set}`)
  .filter((name) => /^c0[1-4]-\d{3}\.webp$/.test(name))
  .sort()
  .map((name) => `/film/${set}/${name}`)

const desktop = ordered('desktop')
const mobile = ordered('mobile')
if (desktop.length !== 264 || mobile.length !== 264) throw new Error('Se esperaban 264 fotogramas por set')

const manifest = {
  version: 2, fps: 10, pinVh: 22.5, sets: { desktop, mobile },
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
console.log('manifest: 264 desktop + 264 mobile')
