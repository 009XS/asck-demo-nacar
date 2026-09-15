import './styles/base.css'
import './styles/sections.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { render } from './render'
import { alCambiar, animar, aplicarEstado, elegir } from './lib/motion'
import { montarReveals } from './lib/reveal'
import { montarActo } from './lib/acto'

gsap.registerPlugin(ScrollTrigger);
(window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger

declare const __BUILD_ID__: string
;(window as unknown as { __BUILD_ID__: string }).__BUILD_ID__ = __BUILD_ID__

// El estado de movimiento va en <html> ANTES de montar nada: el CSS de los
// dos modos (pinneado / apilado) cuelga de ese atributo.
aplicarEstado()

const root = document.getElementById('root')
if (root) render(root)

// ------------------------------------------------------------- movimiento

let contextos: gsap.Context[] = []

function montar(): void {
  contextos = [montarReveals(animar()), montarActo(animar())]
  ScrollTrigger.refresh()
}

function desmontar(): void {
  contextos.forEach((c) => c.revert())
  contextos = []
}

const toggle = document.querySelector<HTMLButtonElement>('[data-motion-toggle]')

function pintarToggle(): void {
  if (toggle) toggle.textContent = animar() ? 'Quitar movimiento' : 'Ver con movimiento'
}

toggle?.addEventListener('click', () => {
  elegir(animar() ? 'off' : 'on')
})

alCambiar(() => {
  desmontar()
  montar()
  pintarToggle()
})

montar()
pintarToggle()

// El pin mide mal si la pestaña estuvo oculta durante un resize (lección del
// kit): re-medir al volver.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) ScrollTrigger.refresh()
})

// ------------------------------------------------- nav sólida y píldora WA
// Esto es funcionalidad (feedback de posición), no animación: corre en ambos
// modos con IntersectionObserver; en modo quieto el CSS omite la transición.

const heroEl = document.getElementById('hero')
const navEl = document.querySelector('.nav')
const pill = document.querySelector('.wa-pill')

if (heroEl) {
  const io = new IntersectionObserver(
    (entradas) => {
      const e = entradas[0]
      if (!e) return
      const pasado = e.intersectionRatio < 0.35
      navEl?.classList.toggle('nav--solida', pasado)
      if (pasado) pill?.removeAttribute('data-oculta')
      else pill?.setAttribute('data-oculta', '')
    },
    { threshold: [0, 0.35, 1] },
  )
  io.observe(heroEl)
}
