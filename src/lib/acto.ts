import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type FilmManifest = {
  fps: number
  pinVh: number
  sets: { desktop: string[]; mobile: string[] }
  cuts: Array<{ after: number; from: string; to: string }>
}

const MOBILE_QUERY = '(max-width: 640px)'
const BATCH = 12

function drawCover(ctx: CanvasRenderingContext2D, image: HTMLImageElement): void {
  const scale = Math.max(ctx.canvas.width / image.naturalWidth, ctx.canvas.height / image.naturalHeight)
  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale
  ctx.drawImage(image, (ctx.canvas.width - width) / 2, (ctx.canvas.height - height) / 2, width, height)
}

export function montarActo(animar: boolean): gsap.Context {
  return gsap.context(() => {
    const root = document.querySelector<HTMLElement>('.film')
    const canvas = root?.querySelector<HTMLCanvasElement>('canvas')
    if (!root || !canvas || !animar) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let progress = 0
    let lastFrame = -1
    let manifest: FilmManifest | undefined
    let frames: string[] = []
    let images: Array<HTMLImageElement | undefined> = []

    const paint = (force = false): void => {
      if (!manifest || !frames.length) return
      const raw = progress * (frames.length - 1)
      const index = Math.round(raw)
      if (!force && index === lastFrame) return
      const image = images[index]
      if (!image?.complete || !image.naturalWidth) return
      ctx.fillStyle = '#10201c'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const cut = manifest.cuts.find(({ after }) => raw > after && raw <= after + 3)
      if (cut) {
        const outgoing = images[cut.after]
        const incoming = images[cut.after + 1]
        if (outgoing?.complete && incoming?.complete) {
          drawCover(ctx, outgoing)
          const t = Math.min(1, Math.max(0, (raw - cut.after) / 3))
          const smooth = t * t * (3 - 2 * t)
          ctx.fillStyle = `rgba(16,32,28,${Math.sin(smooth * Math.PI) * 0.35})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.globalAlpha = smooth
          drawCover(ctx, incoming)
          ctx.globalAlpha = 1
        } else drawCover(ctx, image)
      } else drawCover(ctx, image)
      lastFrame = index
      root.dataset.frame = String(index)
      root.style.setProperty('--film-progress', String(progress))
      root.classList.add('is-painted')
    }

    const loadBatch = (index: number): void => {
      const first = Math.max(0, Math.floor(index / BATCH) * BATCH)
      for (let i = first; i < Math.min(first + BATCH * 2, frames.length); i += 1) {
        if (images[i]) continue
        const image = new Image()
        image.decoding = 'async'
        images[i] = image
        image.src = frames[i]
        void image.decode().then(() => paint(true)).catch(() => undefined)
      }
    }

    const resize = (): void => {
      const dpr = Math.min(devicePixelRatio, 2)
      canvas.width = Math.round(root.clientWidth * dpr)
      canvas.height = Math.round(root.clientHeight * dpr)
      lastFrame = -1
      paint(true)
    }

    void fetch('/film/manifest.json').then((response) => {
      if (!response.ok) throw new Error(`Film manifest ${response.status}`)
      return response.json() as Promise<FilmManifest>
    }).then((data) => {
      manifest = data
      frames = data.sets[matchMedia(MOBILE_QUERY).matches ? 'mobile' : 'desktop']
      images = new Array(frames.length)
      loadBatch(0)
      const cards = gsap.utils.toArray<HTMLElement>('.film-card', root)
      const count = root.querySelector<HTMLElement>('[data-film-count]')
      const timeline = gsap.timeline()
      cards.forEach((card, index) => {
        const from = Number(card.dataset.from)
        const to = Number(card.dataset.to)
        const span = to - from
        timeline.fromTo(card, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: span * 0.18, ease: 'power2.out' }, from + span * 0.06)
        if (index < cards.length - 1) timeline.to(card, { autoAlpha: 0, y: -20, duration: span * 0.14, ease: 'power2.in' }, to - span * 0.2)
      })
      timeline.set({}, {}, 1)
      ScrollTrigger.create({
        trigger: root, start: 'top top', end: () => `+=${Math.round(data.pinVh * innerHeight)}`,
        pin: true, pinSpacing: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        animation: timeline,
        onUpdate: ({ progress: next }) => {
          progress = next
          const index = Math.round(progress * (frames.length - 1))
          loadBatch(index)
          paint()
          if (count) count.textContent = String(Math.min(9, Math.floor(progress * 9) + 1)).padStart(2, '0')
        },
      })
      ScrollTrigger.addEventListener('refresh', resize)
      resize()
      ScrollTrigger.refresh()
    }).catch((error: unknown) => console.error(error))

  })
}
