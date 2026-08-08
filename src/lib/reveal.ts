/**
 * Revelados de entrada — catálogo cerrado del kit: fade-up en grupo (UN
 * trigger por grupo, stagger 0.09), mask-rise en titulares, rule-draw y
 * contadores. Nada de esto existe si `animar` es falso: el CSS pinta la
 * página completa por defecto y el JS sólo añade la mecánica.
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function montarReveals(animar: boolean): gsap.Context {
  return gsap.context(() => {
    if (!animar) return

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = gsap.utils.toArray<HTMLElement>('.reveal', group)
      if (!items.length) return
      gsap.fromTo(
        items,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
        },
      )
    })

    gsap.utils.toArray<HTMLElement>('.reveal-mask > *').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.3,
          ease: 'expo.out',
          scrollTrigger: { trigger: el.parentElement, start: 'top 85%', once: true },
        },
      )
    })

    gsap.utils.toArray<HTMLElement>('.rule').forEach((el) => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        },
      )
    })

    // Contadores de la prueba social. El DOM trae el valor final (así queda
    // en modo quieto); aquí se rebobinan a 0 y cuentan al entrar.
    gsap.utils.toArray<HTMLElement>('[data-contador]').forEach((el) => {
      const fin = Number(el.dataset.contador ?? 0)
      const obj = { v: 0 }
      el.textContent = '0'
      gsap.to(obj, {
        v: fin,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.v).toLocaleString('es-MX')
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    })

    // La cita a sangre deriva más lento que la página: el intersticio se
    // siente como un plano sostenido, no como otra sección que pasa.
    gsap.utils.toArray<HTMLElement>('[data-parallax-lento]').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.intersticio') ?? el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        },
      )
    })

    // La pista «Desplaza» se disuelve con el primer gesto de scroll.
    const hint = document.querySelector('.h-hint')
    if (hint) {
      gsap.to(hint, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: '40% top', scrub: 0.5 },
      })
    }
  })
}
