/**
 * «02 — El método»: la pieza pinneada (estructura B del kit). UN solo
 * ScrollTrigger gobierna pin, arcos, tarjetas y raíl — crear un segundo sobre
 * el elemento pinneado hace que GSAP mida start/end sobre una posición
 * alterada (error ya pagado en UMBRAL).
 *
 * El `end` va en PÍXELES DE VIEWPORT y como función, no en `+=X%`: el
 * porcentaje es relativo a la altura medida del trigger y se rompe donde
 * `100svh` no coincide con `innerHeight` (lección medida del kit).
 *
 * En modo quieto este módulo no hace nada: el CSS apila los mismos pasos con
 * los arcos ya trazados — misma obra, otra mecánica.
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** ≈ 85 vh de recorrido por paso: lectura cómoda sin hacer eterno el acto. */
const PIN_VH = 340

export function montarActo(animar: boolean): gsap.Context {
  return gsap.context(() => {
    const pin = document.querySelector<HTMLElement>('.acto__pin')
    if (!pin || !animar) return

    const arcos = gsap.utils.toArray<SVGPathElement>('.arco', pin)
    arcos.forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })
    const piezas = gsap.utils.toArray<SVGCircleElement>('.arco-pieza', pin)
    gsap.set(piezas, { opacity: 0 })

    const pasos = gsap.utils.toArray<HTMLElement>('.paso', pin)
    const cabeza = pin.querySelector('.acto__cabeza')
    const ctaFila = pin.querySelector('.acto__cta-fila')
    const avance = pin.querySelector('.rail__avance')
    const minuto = pin.querySelector('[data-minuto]')

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => '+=' + Math.round((PIN_VH / 100) * window.innerHeight),
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // La cabecera cede el escenario en cuanto arranca el primer paso.
    if (cabeza) tl.to(cabeza, { autoAlpha: 0, y: -24, duration: 0.06 }, 0.05)

    // Los tres arcos se trazan a lo largo de todo el acto, en capas.
    tl.to('.arco-a', { strokeDashoffset: 0, duration: 0.85 }, 0)
    tl.to('.arco-b', { strokeDashoffset: 0, duration: 0.85 }, 0.05)
    tl.to('.arco-c', { strokeDashoffset: 0, duration: 0.85 }, 0.1)
    tl.to(piezas, { opacity: 1, duration: 0.02, stagger: 0.045 }, 0.12)

    // Raíl de minutos: el tiempo de la cita ES el progreso del scroll.
    if (avance) tl.fromTo(avance, { scaleX: 0 }, { scaleX: 1, duration: 0.89 }, 0.06)
    if (minuto) {
      const m = { v: 0 }
      tl.to(
        m,
        {
          v: 45,
          duration: 0.89,
          onUpdate: () => {
            minuto.textContent = `${Math.round(m.v)}'`
          },
        },
        0.06,
      )
    }

    // Tarjetas con tramos propios (independientes del trazado — regla del
    // kit). El último paso se queda en escena y recibe al CTA.
    const tramos = [
      { entra: 0.06, sale: 0.27 },
      { entra: 0.29, sale: 0.5 },
      { entra: 0.52, sale: 0.73 },
      { entra: 0.75, sale: -1 },
    ]

    // «Capa por capa» dejado de ser sólo copy: cada paso ILUMINA su capa del
    // arco (esmalte → dentina → nervio → las tres) y atenúa las demás. Es el
    // concepto de la marca convertido en la mecánica del scroll.
    const capas = ['.arco-a', '.arco-b', '.arco-c']
    const foco = [
      [1, 0.35, 0.25],
      [0.3, 1, 0.3],
      [0.25, 0.35, 1],
      [0.85, 0.85, 0.85],
    ]

    pasos.forEach((paso, i) => {
      const t = tramos[i]
      if (!t) return
      const num = paso.querySelector('.paso__num')
      const tit = paso.querySelector('.paso__titulo')
      tl.fromTo(paso, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.055 }, t.entra)
      if (num) tl.fromTo(num, { yPercent: 26 }, { yPercent: 0, duration: 0.075 }, t.entra)
      if (tit) tl.fromTo(tit, { y: 34 }, { y: 0, duration: 0.075 }, t.entra)

      const pesos = foco[i]
      if (pesos) {
        capas.forEach((capa, c) => {
          const el = pin.querySelector(capa)
          if (el) tl.to(el, { opacity: pesos[c], duration: 0.05 }, t.entra)
        })
      }

      if (t.sale > 0) tl.to(paso, { autoAlpha: 0, y: -28, duration: 0.05 }, t.sale)
    })

    if (ctaFila) tl.fromTo(ctaFila, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.86)

    // Ancla la duración total en 1.0: así cada posición del timeline equivale
    // exactamente a esa fracción del recorrido de scroll.
    tl.set({}, {}, 1)
  })
}
